import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const POSTS_DIRECTORY = path.join(process.cwd(), '/src/posts')
const DATA_DIRECTORY = path.join(process.cwd(), '/src/data')

if (!fs.existsSync(DATA_DIRECTORY)) {
  fs.mkdirSync(DATA_DIRECTORY, { recursive: true })
}

const files = fs.readdirSync(POSTS_DIRECTORY)

const postsData = files
  .reverse()
  .map(filename => {
    const slug = filename.replace('.md', '')
    const markdownWithMeta = fs.readFileSync(
      path.join(POSTS_DIRECTORY, filename),
      'utf-8',
    )
    const { data, content } = matter(markdownWithMeta)

    if (
      process.env.NODE_ENV === 'development' &&
      /.*blog-format.*/.test(data.title)
    ) {
      data.isPublished = true
    }

    if (
      !data.isPublished ||
      !data.title ||
      !data.createdAt ||
      !data.updatedAt
    ) {
      return null
    }

    const formattedData = {
      title: String(data.title),
      createdAt: data.createdAt.toISOString().slice(0, 10),
      updatedAt: data.updatedAt.toISOString().slice(0, 10),
      thumbnail: data.thumbnail
        ? String(data.thumbnail)
        : '/images/pencil01.svg',
      isNew: false,
      isUpdated: false,
    }

    const today = new Date()
    const twoWeeksAgo = new Date(today)
    twoWeeksAgo.setDate(today.getDate() - 14)

    const isNew = new Date(data.createdAt) > twoWeeksAgo
    if (isNew) {
      formattedData.isNew = true
    }

    const isUpdated = new Date(data.updatedAt) > twoWeeksAgo
    if (isUpdated && !isNew) {
      formattedData.isUpdated = true
    }

    return {
      slug,
      formattedData,
      content,
    }
  })
  .filter(post => post !== null)

fs.writeFileSync(
  path.join(DATA_DIRECTORY, 'posts.json'),
  JSON.stringify(postsData, null, 2),
  'utf-8',
)

console.log(`✅ 処理完了: ${postsData.length}件の投稿を生成しました`)

import matter from 'gray-matter'
import fs from 'node:fs'
import path from 'node:path'

export type Post = {
  slug: string
  formattedData: {
    title: string
    createdAt: string
    updatedAt: string
    thumbnail: string
    isNew: boolean
    isUpdated: boolean
  }
  content: string
}

export type PostIndex = {
  slug: string
  title: string
  createdAt: string
  updatedAt: string
  thumbnail: string
  version: number
  isNew?: boolean
  isUpdated?: boolean
}

// --- 共通ユーティリティ用型 ---
export type PostFrontmatter = {
  title: string
  createdAt: string | Date
  updatedAt: string | Date
  thumbnail?: string
  isPublished: boolean
  version?: number
}

function getAssetsBinding() {
  try {
    // OpenNext for Cloudflareの正しい方法
    const { getCloudflareContext } = require('@opennextjs/cloudflare')
    const { env } = getCloudflareContext()
    console.log('Found Cloudflare context, ASSETS available:', !!env.ASSETS)
    return env.ASSETS
  } catch {
    // 開発環境では @opennextjs/cloudflare が利用できない場合があります
    console.log('Cloudflare context not available, using Node.js fs')
    return null
  }
}

// Cloudflare ASSETS用のベースURL取得
function getAssetsBaseUrl(): string {
  // Cloudflare環境では実際のホスト名は関係なく、パス部分のみが使用される
  // 本番環境やwrangler devなど、どの環境でも動作する汎用的なURLを使用
  if (typeof globalThis !== 'undefined' && globalThis.location) {
    return globalThis.location.origin
  }
  // フォールバック: 実際には使用されないが、有効なURL形式である必要がある
  return 'https://assets.local'
}

// --- 共通ユーティリティ ---
function validatePostData(data: unknown): data is PostFrontmatter {
  return !!(
    data &&
    typeof data === 'object' &&
    'isPublished' in data &&
    'title' in data &&
    'createdAt' in data &&
    'updatedAt' in data &&
    data.isPublished &&
    data.title &&
    data.createdAt &&
    data.updatedAt
  )
}

function formatPostMeta(data: PostFrontmatter) {
  return {
    title: String(data.title),
    createdAt:
      typeof data.createdAt === 'string'
        ? data.createdAt.slice(0, 10)
        : data.createdAt.toISOString().slice(0, 10),
    updatedAt:
      typeof data.updatedAt === 'string'
        ? data.updatedAt.slice(0, 10)
        : data.updatedAt.toISOString().slice(0, 10),
    thumbnail: data.thumbnail ? String(data.thumbnail) : '/images/pencil01.svg',
    isNew: false,
    isUpdated: false,
  }
}

function processMarkdownContent(
  mdContent: string,
  slug: string,
): Post | undefined {
  const { data, content } = matter(mdContent)

  if (!validatePostData(data)) {
    return undefined
  }

  let formattedData = formatPostMeta(data)
  formattedData = addNewUpdateFlags(formattedData)

  return {
    slug,
    formattedData,
    content,
  }
}

// ファイル取得の抽象化
async function fetchPostContent(slug: string): Promise<string | undefined> {
  const ASSETS = getAssetsBinding()

  if (ASSETS) {
    try {
      const baseUrl = getAssetsBaseUrl()
      const response = await ASSETS.fetch(
        new Request(`${baseUrl}/posts/${slug}.md`),
      )
      if (!response.ok) {
        return undefined
      }
      return await response.text()
    } catch (error) {
      console.error(`Failed to load ${slug}.md:`, error)
      return undefined
    }
  } else {
    try {
      const postPath = path.join(process.cwd(), 'public/posts', `${slug}.md`)
      if (!fs.existsSync(postPath)) {
        return undefined
      }
      return fs.readFileSync(postPath, 'utf-8')
    } catch (error) {
      console.error(`Failed to load ${slug}.md (dev):`, error)
      return undefined
    }
  }
}

async function fetchPostsIndex(): Promise<PostIndex[] | undefined> {
  const ASSETS = getAssetsBinding()

  if (ASSETS) {
    try {
      const baseUrl = getAssetsBaseUrl()
      const response = await ASSETS.fetch(
        new Request(`${baseUrl}/posts/index.json`),
      )
      if (!response.ok) {
        console.error('Failed to load posts index, status:', response.status)
        return undefined
      }
      return await response.json()
    } catch (error) {
      console.error('Failed to load posts index:', error)
      return undefined
    }
  } else {
    try {
      const postsIndexPath = path.join(process.cwd(), 'public/posts/index.json')
      if (!fs.existsSync(postsIndexPath)) {
        console.warn(
          'Posts index file not found. Run "npm run generate-posts-index" first.',
        )
        return undefined
      }
      const content = fs.readFileSync(postsIndexPath, 'utf-8')
      return JSON.parse(content)
    } catch (error) {
      console.error('Failed to load posts index (dev):', error)
      return undefined
    }
  }
}

function addNewUpdateFlags<
  T extends {
    createdAt: string
    updatedAt: string
    isNew?: boolean
    isUpdated?: boolean
  },
>(obj: T): T {
  const today = new Date()
  const twoWeeksAgo = new Date(today)
  twoWeeksAgo.setDate(today.getDate() - 14)
  const isNew = new Date(obj.createdAt) > twoWeeksAgo
  const isUpdated = new Date(obj.updatedAt) > twoWeeksAgo && !isNew
  return {
    ...obj,
    isNew,
    isUpdated,
  }
}

export const getAllPostsIndex = async (): Promise<PostIndex[]> => {
  const posts = await fetchPostsIndex()
  if (!posts) return []

  return posts.map(post => addNewUpdateFlags(post))
}

export const getPostBySlug = async (
  slug: string,
): Promise<Post | undefined> => {
  const mdContent = await fetchPostContent(slug)
  if (!mdContent) return undefined

  return processMarkdownContent(mdContent, slug)
}

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

// 開発環境用：Node.js fsを使用してローカルファイルを読み取り
function getAllPostsIndexDev(): PostIndex[] {
  try {
    const postsIndexPath = path.join(process.cwd(), 'public/posts/index.json')

    // ファイルが存在しない場合は空配列を返す
    if (!fs.existsSync(postsIndexPath)) {
      console.warn(
        'Posts index file not found. Run "npm run generate-posts-index" first.',
      )
      return []
    }

    const content = fs.readFileSync(postsIndexPath, 'utf-8')
    const posts: PostIndex[] = JSON.parse(content)

    // New/Updateラベル判定を追加
    const today = new Date()
    const twoWeeksAgo = new Date(today)
    twoWeeksAgo.setDate(today.getDate() - 14)

    return posts.map(post => {
      const isNew = new Date(post.createdAt) > twoWeeksAgo
      const isUpdated = new Date(post.updatedAt) > twoWeeksAgo && !isNew

      return {
        ...post,
        isNew,
        isUpdated,
      }
    })
  } catch (error) {
    console.error('Failed to load posts index (dev):', error)
    return []
  }
}

// 開発環境用：Node.js fsを使用してローカルファイルから投稿を読み取り
function getPostBySlugDev(slug: string): Post | undefined {
  try {
    const postPath = path.join(process.cwd(), 'public/posts', `${slug}.md`)

    // ファイルが存在しない場合は undefined を返す
    if (!fs.existsSync(postPath)) {
      return undefined
    }

    const mdContent = fs.readFileSync(postPath, 'utf-8')
    const { data, content } = matter(mdContent)

    // 公開チェック
    if (
      !data.isPublished ||
      !data.title ||
      !data.createdAt ||
      !data.updatedAt
    ) {
      return undefined
    }

    const formattedData = {
      title: String(data.title),
      createdAt:
        typeof data.createdAt === 'string'
          ? data.createdAt.slice(0, 10)
          : data.createdAt.toISOString().slice(0, 10),
      updatedAt:
        typeof data.updatedAt === 'string'
          ? data.updatedAt.slice(0, 10)
          : data.updatedAt.toISOString().slice(0, 10),
      thumbnail: data.thumbnail
        ? String(data.thumbnail)
        : '/images/pencil01.svg',
      isNew: false,
      isUpdated: false,
    }

    // New/Updateラベル判定
    const today = new Date()
    const twoWeeksAgo = new Date(today)
    twoWeeksAgo.setDate(today.getDate() - 14)

    const isNew = new Date(formattedData.createdAt) > twoWeeksAgo
    if (isNew) {
      formattedData.isNew = true
    }

    const isUpdated = new Date(formattedData.updatedAt) > twoWeeksAgo
    if (isUpdated && !isNew) {
      formattedData.isUpdated = true
    }

    return {
      slug,
      formattedData,
      content,
    }
  } catch (error) {
    console.error(`Failed to load ${slug}.md (dev):`, error)
    return undefined
  }
}

export const getAllPostsIndex = async (): Promise<PostIndex[]> => {
  // ASSETSバインディングが利用可能かチェック
  const ASSETS = getAssetsBinding()

  if (ASSETS) {
    // Cloudflare ASSETS を使用（wrangler dev含む）
    try {
      // OpenNext for Cloudflare ではRequestオブジェクトが必要
      const baseUrl = getAssetsBaseUrl()
      const response = await ASSETS.fetch(
        new Request(`${baseUrl}/posts/index.json`),
      )
      if (!response.ok) {
        console.error('Failed to load posts index, status:', response.status)
        return []
      }

      const posts: PostIndex[] = await response.json()
      console.log(`Successfully loaded ${posts.length} posts`)

      // New/Updateラベル判定を追加
      const today = new Date()
      const twoWeeksAgo = new Date(today)
      twoWeeksAgo.setDate(today.getDate() - 14)

      return posts.map(post => {
        const isNew = new Date(post.createdAt) > twoWeeksAgo
        const isUpdated = new Date(post.updatedAt) > twoWeeksAgo && !isNew

        return {
          ...post,
          isNew,
          isUpdated,
        }
      })
    } catch (error) {
      console.error('Failed to load posts index:', error)
      return []
    }
  } else {
    // Node.js fs を使用（通常の npm run dev）
    return getAllPostsIndexDev()
  }
}

export const getPostBySlug = async (
  slug: string,
): Promise<Post | undefined> => {
  // ASSETSバインディングが利用可能かチェック
  const ASSETS = getAssetsBinding()

  if (ASSETS) {
    // Cloudflare ASSETS を使用（wrangler dev含む）
    try {
      // OpenNext for Cloudflare ではRequestオブジェクトが必要
      const baseUrl = getAssetsBaseUrl()
      const response = await ASSETS.fetch(
        new Request(`${baseUrl}/posts/${slug}.md`),
      )
      if (!response.ok) {
        return undefined
      }

      const mdContent = await response.text()
      const { data, content } = matter(mdContent)

      // 公開チェック
      if (
        !data.isPublished ||
        !data.title ||
        !data.createdAt ||
        !data.updatedAt
      ) {
        return undefined
      }

      const formattedData = {
        title: String(data.title),
        createdAt:
          typeof data.createdAt === 'string'
            ? data.createdAt.slice(0, 10)
            : data.createdAt.toISOString().slice(0, 10),
        updatedAt:
          typeof data.updatedAt === 'string'
            ? data.updatedAt.slice(0, 10)
            : data.updatedAt.toISOString().slice(0, 10),
        thumbnail: data.thumbnail
          ? String(data.thumbnail)
          : '/images/pencil01.svg',
        isNew: false,
        isUpdated: false,
      }

      // New/Updateラベル判定
      const today = new Date()
      const twoWeeksAgo = new Date(today)
      twoWeeksAgo.setDate(today.getDate() - 14)

      const isNew = new Date(formattedData.createdAt) > twoWeeksAgo
      if (isNew) {
        formattedData.isNew = true
      }

      const isUpdated = new Date(formattedData.updatedAt) > twoWeeksAgo
      if (isUpdated && !isNew) {
        formattedData.isUpdated = true
      }

      return {
        slug,
        formattedData,
        content,
      }
    } catch (error) {
      console.error(`Failed to load ${slug}.md:`, error)
      return undefined
    }
  } else {
    // Node.js fs を使用（通常の npm run dev）
    return getPostBySlugDev(slug)
  }
}

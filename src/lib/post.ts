import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import type { Post, PostIndex } from '@/types/post'

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
  // pnpm dev環境では、@opennextjs/cloudflareのモックが不完全なため、
  // 意図的にfsフォールバックを使用する
  if (process.env.NODE_ENV === 'development') {
    return null
  }

  try {
    // OpenNext for Cloudflareの正しい方法
    const { getCloudflareContext } = require('@opennextjs/cloudflare')
    const { env } = getCloudflareContext()
    return env.ASSETS
  } catch {
    // 本番環境でコンテキストが取得できない場合
    return null
  }
}

// Cloudflare ASSETS用のベースURL取得
function getAssetsBaseUrl(): string {
  // ASSETS.fetchは完全なURLを持つRequestオブジェクトを期待するため、
  // ダミーのベースURLを生成する。パス部分のみが実際に使用される。
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

  const formattedData = formatPostMeta(data)

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
    // preview環境 (NODE_ENV=production)
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
    // dev環境 (NODE_ENV=development)
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
    // preview環境 (NODE_ENV=production)
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
    // dev環境 (NODE_ENV=development)
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

export const getAllPostsIndex = async (): Promise<PostIndex[]> => {
  const posts = await fetchPostsIndex()
  if (!posts) return []

  return posts
}

export const getPostBySlug = async (
  slug: string,
): Promise<Post | undefined> => {
  const mdContent = await fetchPostContent(slug)
  if (!mdContent) return undefined

  return processMarkdownContent(mdContent, slug)
}

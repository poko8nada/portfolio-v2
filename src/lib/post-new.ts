import matter from 'gray-matter'

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

// Cloudflare環境への対応
interface CloudflareProcess extends NodeJS.Process {
  env: NodeJS.ProcessEnv & {
    ASSETS?: {
      fetch: (url: string) => Promise<Response>
    }
  }
}

interface CloudflareGlobal {
  cloudflareEnv?: {
    ASSETS?: {
      fetch: (url: string) => Promise<Response>
    }
  }
}

function getAssetsBinding() {
  // OpenNext for Cloudflareでは、process.env.ASSETS が利用可能
  if (
    typeof process !== 'undefined' &&
    process.env &&
    (process as CloudflareProcess).env.ASSETS
  ) {
    return (process as CloudflareProcess).env.ASSETS
  }

  // グローバル環境からのアクセス（開発時やランタイム時）
  const globalEnv = globalThis as unknown as CloudflareGlobal
  if (typeof globalThis !== 'undefined' && globalEnv.cloudflareEnv?.ASSETS) {
    return globalEnv.cloudflareEnv.ASSETS
  }

  return null
}

export const getAllPostsIndex = async (): Promise<PostIndex[]> => {
  try {
    const ASSETS = getAssetsBinding()
    if (!ASSETS) {
      console.error('Cloudflare ASSETS binding not available')
      return []
    }

    const response = await ASSETS.fetch('/posts/index.json')
    if (!response.ok) {
      console.error('Failed to load posts index')
      return []
    }

    const posts: PostIndex[] = await response.json()

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
}

export const getPostBySlug = async (
  slug: string,
): Promise<Post | undefined> => {
  try {
    const ASSETS = getAssetsBinding()
    if (!ASSETS) {
      console.error('Cloudflare ASSETS binding not available')
      return undefined
    }

    const response = await ASSETS.fetch(`/posts/${slug}.md`)
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
}

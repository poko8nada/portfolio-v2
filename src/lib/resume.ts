'use server'
import matter from 'gray-matter'
import { headers } from 'next/headers'

// Resume frontmatter type
type ResumeFrontmatter = {
  title: string
  type: 'resume' | 'career' | 'skills'
  createdAt: string
  updatedAt: string
}

// Resume data type
export type ResumeData = {
  slug: string
  frontmatter: ResumeFrontmatter
  content: string
}

/**
 * Validate resume frontmatter data
 */
function validateResumeData(data: unknown): data is ResumeFrontmatter {
  if (typeof data !== 'object' || data === null) return false

  const obj = data as Record<string, unknown>
  return (
    typeof obj.title === 'string' &&
    (obj.type === 'resume' || obj.type === 'career' || obj.type === 'skills') &&
    typeof obj.createdAt === 'string' &&
    typeof obj.updatedAt === 'string'
  )
}

/**
 * Process markdown content with frontmatter
 */
function processResumeContent(
  content: string,
  slug: string,
): ResumeData | undefined {
  const { data, content: mdContent } = matter(content)

  if (!validateResumeData(data)) {
    console.warn(`Invalid resume frontmatter for ${slug}`)
    return undefined
  }

  return {
    slug,
    frontmatter: data,
    content: mdContent,
  }
}

/**
 * Constructs the base URL from a host string.
 * This function prioritizes the NEXT_PUBLIC_APP_URL environment variable
 * for explicit overrides in special environments (e.g., complex proxy setups).
 * Otherwise, it dynamically constructs the URL from the host header.
 *
 * @param {string | null} host - The host string from request headers.
 * @returns {string} The full base URL.
 */
function constructBaseUrl(host: string | null): string {
  // If an explicit URL is set in environment variables, use it.
  // This is useful for overriding the URL in specific deployment environments
  // where header-based detection might fail (e.g., behind multiple proxies).
  // For normal local development (`pnpm dev`, `pnpm preview`) or standard deployments,
  // this variable is typically not needed.
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  if (!host) {
    throw new Error('Could not determine host.')
  }

  const protocol = host.includes('localhost') ? 'http' : 'https'
  return `${protocol}://${host}`
}

/**
 * Fetch content from internal API with Basic auth
 */
async function fetchContentFromAPI(slug: string): Promise<string | null> {
  try {
    const requestHeaders = await headers()
    const host =
      requestHeaders.get('x-forwarded-host') || requestHeaders.get('host')
    const baseUrl = constructBaseUrl(host)

    // Basic認証の認証情報を取得
    const username = process.env.BASIC_AUTH_USERNAME
    const password = process.env.BASIC_AUTH_PASSWORD

    if (!username || !password) {
      throw new Error('Basic auth credentials not found')
    }

    const credentials = Buffer.from(`${username}:${password}`).toString(
      'base64',
    )

    const response = await fetch(`${baseUrl}/api/resume/${slug}`, {
      cache: 'no-store', // Always fetch fresh data
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch content: ${response.status}`)
    }

    return await response.text()
  } catch (error) {
    console.error(`Error fetching content for ${slug}:`, error)
    return null
  }
}

/**
 * Get resume data by slug
 */
export async function getResumeBySlug(
  slug: string,
): Promise<ResumeData | undefined> {
  const content = await fetchContentFromAPI(slug)

  if (content === null) {
    return undefined
  }

  return processResumeContent(content, slug)
}

/**
 * Get all resume data
 */
export async function getAllResumeData(): Promise<ResumeData[]> {
  const slugs = ['resume', 'career', 'skills']
  const results: ResumeData[] = []

  for (const slug of slugs) {
    const data = await getResumeBySlug(slug)
    if (data) {
      results.push(data)
    }
  }

  // 固定順序: resume → career → skills
  return results.sort((a, b) => {
    const order: Record<string, number> = { resume: 0, career: 1, skills: 2 }
    return order[a.frontmatter.type] - order[b.frontmatter.type]
  })
}

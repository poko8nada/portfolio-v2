'use server'
import matter from 'gray-matter'
import resumeContent from '@/content/resume/resume.md'
import careerContent from '@/content/resume/career.md'

// Resume frontmatter type
type ResumeFrontmatter = {
  title: string
  type: 'resume' | 'career'
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
    (obj.type === 'resume' || obj.type === 'career') &&
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
 * Get resume data by slug
 */
export async function getResumeBySlug(
  slug: string,
): Promise<ResumeData | undefined> {
  let content: string

  switch (slug) {
    case 'resume':
      content = resumeContent
      break
    case 'career':
      content = careerContent
      break
    default:
      return undefined
  }

  return processResumeContent(content, slug)
}

/**
 * Get all resume data
 */
export async function getAllResumeData(): Promise<ResumeData[]> {
  const slugs = ['resume', 'career']
  const results: ResumeData[] = []

  for (const slug of slugs) {
    const data = await getResumeBySlug(slug)
    if (data) {
      results.push(data)
    }
  }

  return results.sort(
    (a, b) =>
      new Date(b.frontmatter.updatedAt).getTime() -
      new Date(a.frontmatter.updatedAt).getTime(),
  )
}

/**
 * Get basic profile information from resume data (for use in other components)
 */
export async function getBasicProfileInfo(): Promise<
  | {
      name?: string
      title?: string
      skills?: string[]
    }
  | undefined
> {
  const resumeData = await getResumeBySlug('resume')
  if (!resumeData) return undefined

  // Extract basic info from resume content
  const content = resumeData.content

  // Simple regex to extract basic information
  const nameMatch = content.match(/\*\*氏名\*\*:\s*(.+)/)
  const skillsSection = content.match(
    /### プログラミング言語\n([\s\S]+?)(?=\n###|\n##|$)/,
  )

  return {
    name: nameMatch?.[1]?.trim(),
    title: resumeData.frontmatter.title,
    skills:
      skillsSection?.[1]
        ?.split('\n')
        .map(line => line.replace(/^-\s*/, '').trim())
        .filter(Boolean) || [],
  }
}

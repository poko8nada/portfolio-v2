import postsData from '@/data/posts.json'

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

export const getAllPosts = (): Post[] => {
  return postsData
}

export const getPostsBySlug = (slug: string): Post | undefined => {
  console.log(`getPostsBySlug: ${slug}`)

  return getAllPosts().find(post => post.slug === slug)
}

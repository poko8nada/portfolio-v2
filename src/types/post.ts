export type Post = {
  slug: string
  formattedData: {
    title: string
    createdAt: string
    updatedAt: string
    thumbnail: string
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
}

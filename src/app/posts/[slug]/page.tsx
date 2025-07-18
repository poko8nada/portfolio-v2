import { notFound } from 'next/navigation'
import PostBody from '@/components/postBody'
import PostFooter from '@/components/postFooter'
import PostHeader from '@/components/postHeader'
import SectionBody from '@/components/sectionBody'
import { getAllPostsIndex, getPostBySlug } from '@/lib/post'

export async function generateStaticParams() {
  const allPosts = await getAllPostsIndex()
  return allPosts.map(({ slug }) => {
    return { slug }
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug

  const post = await getPostBySlug(slug)
  return {
    title: `${post?.formattedData.title} | pokoHanadaCom`,
    canonical: `https://pokohanada.com/posts/${slug}`,
    openGraph: {
      title: `${post?.formattedData.title} | pokoHanadaCom`,
      description: post?.formattedData.title,
      type: 'article',
      url: `https://pokohanada.com/posts/${slug}`,
      images: 'https://pokohanada.com/images/profile01.png',
    },
    twitter: {
      card: 'summary',
      title: `${post?.formattedData.title} | pokoHanadaCom`,
      description: post?.formattedData.title,
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug
  const allPosts = await getAllPostsIndex()

  const post = await getPostBySlug(slug)
  const content: string | undefined = post?.content

  if (!post) {
    console.log(`Post not found: ${slug}`)
    return notFound()
  }

  const postIndex = allPosts.findIndex(p => p.slug === slug)
  const prevPost = allPosts[postIndex - 1]
  const nextPost = allPosts[postIndex + 1]

  return (
    <SectionBody>
      <PostHeader post={post} />
      <PostBody content={content as string} />
      {allPosts.length <= 1 ? null : (
        <PostFooter
          prevPost={
            prevPost
              ? {
                  slug: prevPost.slug,
                  formattedData: {
                    title: prevPost.title,
                    createdAt: prevPost.createdAt,
                    updatedAt: prevPost.updatedAt,
                    thumbnail: prevPost.thumbnail,
                  },
                  content: '', // PostFooterでは使用されない
                }
              : undefined
          }
          nextPost={
            nextPost
              ? {
                  slug: nextPost.slug,
                  formattedData: {
                    title: nextPost.title,
                    createdAt: nextPost.createdAt,
                    updatedAt: nextPost.updatedAt,
                    thumbnail: nextPost.thumbnail,
                  },
                  content: '', // PostFooterでは使用されない
                }
              : undefined
          }
        />
      )}
    </SectionBody>
  )
}

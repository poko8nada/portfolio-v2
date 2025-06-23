import { notFound } from 'next/navigation'
import PostBody from '@/components/postBody'
import PostFooter from '@/components/postFooter'
import PostHeader from '@/components/postHeader'
import SectionBody from '@/components/sectionBody'
import { getAllPosts, getPostsBySlug } from '@/lib/post'

export function generateStaticParams() {
  return getAllPosts().map(({ slug }) => {
    return { slug }
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug

  const post = getPostsBySlug(slug)
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
  const allPosts = getAllPosts()

  const post = getPostsBySlug(slug)
  const content: string | undefined = post?.content

  if (!post) {
    console.log(`${slug} ${content}`)
    return notFound()
  }

  const postIndex = allPosts.findIndex(post => post.slug === slug)
  const prevPost = allPosts[postIndex - 1]
  const nextPost = allPosts[postIndex + 1]

  return (
    <>
      <SectionBody>
        <PostHeader post={post} />
        {/* {post.content} */}
        <PostBody content={content as string} />
        {allPosts.length <= 1 ? null : (
          <PostFooter prevPost={prevPost} nextPost={nextPost} />
        )}
      </SectionBody>
    </>
  )
}

import type { Metadata } from 'next'
import PostsCard from '@/components/postsCard'
import SectionBody from '@/components/sectionBody'
import { getAllPostsIndex } from '@/lib/post'

export const metadata: Metadata = {
  title: 'blog | pokoHanadaCom',
}

export default async function PostsPage() {
  const allPosts = await getAllPostsIndex()

  return (
    <>
      <SectionBody>
        <div
          style={{ marginBottom: '24px', textAlign: 'center', padding: '1rem' }}
        >
          <p>手を動かすwebディレクターの雑記です。</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 px-14 sm:px-18 p-4'>
          {allPosts.map((post, index) => {
            return (
              <PostsCard
                key={post.slug}
                slug={post.slug}
                index={index}
                formattedData={{
                  title: post.title,
                  createdAt: post.createdAt,
                  updatedAt: post.updatedAt,
                  thumbnail: post.thumbnail,
                }}
              />
            )
          })}
        </div>
      </SectionBody>
    </>
  )
}

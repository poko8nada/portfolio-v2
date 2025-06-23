import PostsCard from '@/components/postsCard'
import SectionBody from '@/components/sectionBody'
import { getAllPosts } from '@/lib/post'
import type { Metadata } from 'next'

export const runtime = 'edge'

export const metadata: Metadata = {
  title: 'blog | pokoHanadaCom',
}

const allPosts = getAllPosts()

export default () => {
  return (
    <>
      <SectionBody>
        <div
          style={{ marginBottom: '24px', textAlign: 'center', padding: '1rem' }}
        >
          <p>手を動かすwebディレクターの雑記です。</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 px-14 sm:px-18 p-4'>
          {allPosts.map(({ slug, formattedData }, index) => {
            return (
              <PostsCard
                key={slug}
                slug={slug}
                index={index}
                formattedData={formattedData}
              />
            )
          })}
        </div>
      </SectionBody>
    </>
  )
}

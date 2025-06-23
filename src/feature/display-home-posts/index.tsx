import PostsCard from '@/components/postsCard'
import Button from '@/components/ui/button'
import { getAllPosts } from '@/lib/post'
import Image from 'next/image'

export default function DisplayHomePosts() {
  const topPosts = getAllPosts().slice(0, 3)
  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:px-12 p-2'>
        {topPosts.map(({ slug, formattedData }, index) => {
          return (
            <PostsCard
              key={slug}
              slug={slug}
              formattedData={formattedData}
              index={index}
              isHome={true}
            />
          )
        })}
      </div>
      <div className='mt-6'>
        <Button href='/posts'>
          すべての投稿を見る
          <Image
            src={'/images/arrow-next.svg'}
            width={16}
            height={16}
            alt='arrow next'
            className='inline ml-2'
          />
        </Button>
      </div>
    </>
  )
}

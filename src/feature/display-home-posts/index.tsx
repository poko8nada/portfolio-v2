import Image from 'next/image'
import PostsCard from '@/components/postsCard'
import Button from '@/components/ui/button'
import { getAllPostsIndex } from '@/lib/post'

export default async function DisplayHomePosts() {
  const allPosts = await getAllPostsIndex()
  const topPosts = allPosts.slice(0, 3)

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:px-12 p-2'>
        {topPosts.map((post, index) => {
          return (
            <PostsCard
              key={post.slug}
              slug={post.slug}
              formattedData={{
                title: post.title,
                createdAt: post.createdAt,
                thumbnail: post.thumbnail,
                isNew: post.isNew || false,
                isUpdated: post.isUpdated || false,
              }}
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

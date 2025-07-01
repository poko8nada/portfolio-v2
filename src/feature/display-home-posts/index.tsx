import Image from 'next/image'
import Link from 'next/link'
import PostsCard from '@/components/postsCard'
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
                updatedAt: post.updatedAt,
                thumbnail: post.thumbnail,
              }}
              index={index}
              isHome={true}
            />
          )
        })}
      </div>
      <div className='mt-6'>
        <Link
          href='/posts'
          className='flex items-center justify-center text-pr hover:underline'
        >
          すべての投稿を見る
          <Image
            src={'/images/arrow-next.svg'}
            width={16}
            height={16}
            alt='arrow next'
            className='inline ml-2'
          />
        </Link>
      </div>
    </>
  )
}

import PostThumbnail from '@/components/ui/postThumbnail'
import type { Post } from '@/lib/post'
import Image from 'next/image'

export default ({ post }: { post?: Post }) => {
  const title = post?.formattedData.title
  const createdAt = post?.formattedData.createdAt
  const updatedAt = post?.formattedData.updatedAt
  const thumbnail = post?.formattedData.thumbnail

  return (
    <div className='flex flex-col items-center mb-5'>
      <h2 className='text-xl md:text-2xl my-5 py-2'>{title}</h2>
      <div className='flex items-center justify-center px-4 py-3 rounded-lg bg-fg'>
        <PostThumbnail thumbnail={thumbnail} />
      </div>
      <p className='inline-flex justify-center item-center pt-5'>
        <Image
          src='/images/posts/icon_create.svg'
          alt=''
          width={16}
          height={16}
          className='inline mr-2'
        />
        <span className='text-fg text-sm'>{createdAt}</span>
        {updatedAt === createdAt ? null : (
          <>
            <Image
              src='/images/posts/icon_update.svg'
              alt=''
              width={16}
              height={16}
              className='inline ml-3 mr-2'
            />
            <span className='text-fg text-sm'>{updatedAt}</span>
          </>
        )}
      </p>
    </div>
  )
}

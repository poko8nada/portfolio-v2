import Link from 'next/link'
import { cn } from '@/lib/cn'
import { LabelNew, LabelUpdate } from './ui/labels'
import PostThumbnail from './ui/postThumbnail'
import { isNewPost, isUpdatedPost } from '@/lib/date-utils'

export default ({
  slug,
  formattedData,
  index,
  isHome,
}: {
  slug: string
  formattedData: {
    title: string
    createdAt: string
    updatedAt: string
    thumbnail: string
  }
  index: number
  isHome?: boolean
}) => {
  const { title, createdAt, updatedAt, thumbnail } = formattedData
  const isNew = isNewPost(createdAt)
  const isUpdated = isUpdatedPost(createdAt, updatedAt)
  const articleClass =
    'bg-fg flex items-center justify-center rounded-lg min-h-28 relative'
  const linkClass =
    'flex w-full items-center justify-start gap-4 p-5 h-full hover:scale-105 transition-transform ease-in-out'
  const textClass = 'text-bg w-full flex flex-col h-full'

  console.log(createdAt, updatedAt, isNew, isUpdated)

  return (
    <article
      key={slug}
      className={
        index === 0 && isHome
          ? `first:row-span-2 ${articleClass}`
          : `${articleClass}`
      }
    >
      {isNew && <LabelNew />}
      {isUpdated && <LabelUpdate />}
      <Link
        href={`/posts/${slug}`}
        className={cn(`${linkClass}`, index === 0 && isHome && 'sm:flex-col')}
      >
        <PostThumbnail
          thumbnail={thumbnail}
          className={cn(
            'w-[60px] h-[60px]',
            index === 0 &&
              isHome &&
              'w-[60px] h-[60px] sm:w-[100px] sm:h-[100px]',
          )}
        />
        <div
          className={
            isHome
              ? `justify-center ${textClass}`
              : `justify-between ${textClass}`
          }
        >
          <p
            className={
              index === 0 && isHome
                ? 'md:text-xl hover:underline'
                : 'hover:underline'
            }
          >
            {title}
          </p>
          <small className={!isHome ? 'ml-auto' : ''}>{createdAt}</small>
        </div>
      </Link>
    </article>
  )
}

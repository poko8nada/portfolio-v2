import Link from 'next/link'
import { cn } from '@/lib/cn'
import { isNewPost, isUpdatedPost } from '@/lib/date-utils'
import { LabelNew, LabelUpdate } from './ui/labels'
import PostThumbnail from './ui/postThumbnail'

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
    'bg-fg flex items-center justify-center rounded-lg min-h-28 relative transition-colors duration-200'
  const linkClass =
    'flex w-full items-center justify-start gap-4 px-4 pt-6 pb-4 h-full group focus:outline-none'
  const textClass =
    'text-bg w-full flex flex-col h-full transition-colors duration-200'

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
      {isUpdated && !isNew && <LabelUpdate />}
      <Link
        href={`/posts/${slug}`}
        className={cn(
          `${linkClass} bg-fg hover:bg-bg hover:text-fg border border-transparent hover:border-fg shadow-none hover:shadow-lg hover:shadow-fg/10 transition-all duration-200`,
          index === 0 && isHome && 'sm:flex-col',
        )}
      >
        <PostThumbnail
          thumbnail={thumbnail}
          className={cn(
            'w-[60px] h-[60px] transition-all duration-200',
            index === 0 &&
              isHome &&
              'w-[60px] h-[60px] sm:w-[100px] sm:h-[100px]',
            'group-hover:brightness-110 group-hover:scale-105 group-hover:invert',
          )}
        />
        <div
          className={
            isHome
              ? `justify-center ${textClass} group-hover:text-fg`
              : `justify-between ${textClass} group-hover:text-fg`
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

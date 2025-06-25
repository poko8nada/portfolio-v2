import Link from 'next/link'
import type { Post } from '@/types/post'
export default ({
  prevPost,
  nextPost,
}: {
  prevPost?: Post
  nextPost?: Post
}) => {
  const prevPostTitle = prevPost?.formattedData.title
  const nextPostTitle = nextPost?.formattedData.title
  const prevPostSlug = prevPost?.slug
  const nextPostSlug = nextPost?.slug

  const linkClass = 'hover:underline text-pr text-xs sm:text-sm my-3'
  return (
    <div className='px-4 md:px-8 w-full flex flex-col md:flex-row items-center justify-between'>
      {prevPostSlug && (
        <Link
          href={`/posts/${prevPostSlug}`}
          className={`prev relative self-start ${linkClass}`}
        >
          {prevPostTitle}
        </Link>
      )}
      {nextPostSlug && (
        <Link
          href={`/posts/${nextPostSlug}`}
          className={
            prevPostSlug
              ? `next relative self-end ${linkClass}`
              : `next relative ml-auto ${linkClass}`
          }
        >
          {nextPostTitle}
        </Link>
      )}
    </div>
  )
}

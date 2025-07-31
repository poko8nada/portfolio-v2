'use client'

import Markdown from 'markdown-to-jsx'

// Custom image component to proxy relative paths and prevent interaction
const ProxiedImage = ({
  src,
  alt,
  ...props
}: {
  src?: string
  alt?: string
}) => {
  if (!src) {
    return null
  }

  // Check if the src is an absolute URL or a data URI. If so, use it directly.
  // Otherwise, rewrite it to use the image proxy API.
  const isExternal = src.startsWith('http') || src.startsWith('data:')
  const imageSrc = isExternal
    ? src
    : `/api/proxy-image?path=${encodeURIComponent(src.replace(/^\.?\//, ''))}`

  return (
    <img
      {...props}
      src={imageSrc}
      alt={alt || 'Image'}
      draggable={false}
      onContextMenu={e => e.preventDefault()}
    />
  )
}

type SimpleMarkdownProps = {
  content: string
}

export function MarkdownForResume({ content }: SimpleMarkdownProps) {
  return (
    <div className='prose prose-gray max-w-none'>
      <Markdown
        options={{
          overrides: {
            img: {
              component: ProxiedImage,
            },
            h1: {
              props: {
                className: 'text-xl font-bold mt-6 mb-4 text-gray-900',
              },
            },
            h2: {
              props: {
                className: 'text-lg font-bold mt-6 mb-3 text-gray-900',
              },
            },
            h3: {
              props: {
                className: 'text-base font-semibold mt-4 mb-2 text-gray-900',
              },
            },
            h4: {
              props: {
                className: 'text-base font-semibold mt-4 mb-2 text-gray-900',
              },
            },
            p: {
              props: {
                className: 'mb-2 text-sm text-gray-700',
              },
            },
            ul: {
              props: {
                className: 'ml-4 space-y-1 text-sm text-gray-700',
              },
            },
            li: {
              props: {
                className: 'mb-1 text-sm text-gray-700',
              },
            },
            table: {
              props: {
                className: 'w-full border-collapse',
              },
            },
            th: {
              props: {
                className:
                  'border border-gray-300 px-2 py-2 bg-gray-100 font-semibold text-sm text-gray-900',
              },
            },
            td: {
              props: {
                className:
                  'border border-gray-300 px-2 py-2 text-sm text-gray-700',
              },
            },
            strong: {
              props: {
                className: 'font-bold text-gray-900',
              },
            },
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  )
}

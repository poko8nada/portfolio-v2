import Markdown from 'markdown-to-jsx'

type SimpleMarkdownProps = {
  content: string
}

export function MarkdownForResume({ content }: SimpleMarkdownProps) {
  return (
    <div className='prose prose-gray max-w-none'>
      <Markdown
        options={{
          overrides: {
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

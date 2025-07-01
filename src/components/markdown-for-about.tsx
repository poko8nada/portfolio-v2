import Markdown from 'markdown-to-jsx'

type SimpleMarkdownProps = {
  content: string
}

export function MarkdownForAbout({ content }: SimpleMarkdownProps) {
  return (
    <div className='prose prose-invert max-w-none'>
      <Markdown
        options={{
          overrides: {
            h2: {
              props: {
                className:
                  'text-xl font-bold mt-8 mb-4 text-fg border-b-2 border-pr pb-2',
              },
            },
            h3: {
              props: {
                className: 'text-lg font-semibold mt-6 mb-3 text-fg-2',
              },
            },
            ul: {
              props: {
                className:
                  'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 list-none p-0',
              },
            },
            li: {
              props: {
                className:
                  'bg-bg-2 p-4 rounded-lg text-center hover:bg-pr hover:text-white transition-all duration-200 cursor-pointer',
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

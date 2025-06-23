import Post_embed from '@/components/ui/postEmbed'
import Markdown from 'markdown-to-jsx'
import { StH2, StH3, StP } from './post-strike-through'

export default ({ content }: { content: string }) => {
  return (
    <article className='markdown-body article_container rounded-lg py-20 px-2 md:px-12 w-full'>
      <Markdown
        options={{
          overrides: {
            code: Post_embed,
            p: StP,
            h2: StH2,
            h3: StH3,
          },
        }}
      >
        {content}
      </Markdown>
    </article>
  )
}

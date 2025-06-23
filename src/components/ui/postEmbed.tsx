import Link from 'next/link'
import type { ClassAttributes, HTMLAttributes } from 'react'
// import type { ExtraProps } from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight'
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/hljs'

const embedType = ['Link', 'Amazon', 'Youtube', 'Twitter', 'Callout']
const getType = (matchStr: string | undefined) => {
  return embedType.find(type => type === matchStr)
}
export default ({
  children,
  className,
}: ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement>) => {
  const match = /lang-(\w+)/.exec(className || '')
  const embedType = getType(match?.[1])

  console.log(className)

  const getData = (
    children: string,
  ): {
    title: string
    host: string
    url: string
    image: string
  } => {
    if (embedType === 'Callout') {
      return {
        title: '',
        host: '',
        url: '',
        image: '',
      }
    }

    const [title, host, url, image] = children.split('\n')
    return {
      title,
      host,
      url,
      image,
    }
  }

  if (embedType) {
    const { title, host, url, image } = getData(children as string)
    switch (embedType) {
      case 'Link':
        return (
          <Link
            className='w-full !bg-fg flex items-stretch rounded-lg p-1 gap-1 !decoration-bg max-w-[700px] mx-auto hover:underline'
            href={url}
            target='_blank'
            rel='noopener noreferrer'
          >
            {image && (
              <div className='max-w-[120px] md:max-w-[220px] !bg-bg-1 rounded-l-md shrink-0'>
                <img
                  src={image}
                  alt={title}
                  width={200}
                  height={200}
                  className='object-cover max-h-[110px] w-full h-full rounded-l-md object-center'
                />
              </div>
            )}
            <div className='p-1 font-normal text-bg-2'>
              <h3 className='whitespace-pre-line line-clamp-2 !m-0 md:!text-lg !text-sm'>
                {title}
              </h3>
              <p className='whitespace-pre-line !text-xs !mt-1'>{host}</p>
            </div>
          </Link>
        )
      case 'Amazon':
        return (
          <div className='w-full !bg-fg flex flex-col items-center rounded-lg p-3 gap-3 !decoration-bg max-w-[360px] mx-auto'>
            <Link
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className=''
            >
              {image && (
                <img
                  src={image}
                  alt={title}
                  width={150}
                  height={150}
                  className='object-cover h-full max-w-[150px] object-center'
                />
              )}
            </Link>
            <Link
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='p-1 font-normal !text-bg-2 hover:underline'
            >
              <h3 className='text-center whitespace-break-spaces line-clamp-2 !m-0 !text-md'>
                {title}
              </h3>
              <p className='!text-xs !mt-1 text-center !m-0'>{host}</p>
            </Link>
          </div>
        )
      case 'Callout':
        return (
          <div className='flex gap-1 !bg-[#011627] p-3'>
            <img
              src='/images/posts/bulb.svg'
              alt={title}
              width={36}
              height={36}
            />
            <p className='!m-0 break-all whitespace-break-spaces !text-sm'>
              {children}
            </p>
          </div>
        )
    }
  }
  return match ? (
    <SyntaxHighlighter
      style={nightOwl}
      language={match[1]}
      PreTag='div'
      showLineNumbers={true}
      wrapLines={true}
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (
    <code className={className}>{children}</code>
  )
}

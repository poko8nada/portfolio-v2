import Image from 'next/image'

const toolsCard = ({
  title,
  description,
  img,
  link,
}: {
  title: string
  description: string
  img: string
  link: string
}) => {
  return (
    <div className='max-w-full sm:max-w-[377px] bg-bg border-1 border-fg rounded-lg shadow-sm flex group transition-all duration-200 hover:scale-[1.025] hover:shadow-md hover:border-pr/40 hover:bg-bg/95'>
      <a
        href={link}
        target='_blank'
        rel='noreferrer'
        className='p-2 border-r-1 border-fg flex items-center w-[80px] shrink-0 justify-center group-hover:bg-pr/10 group-hover:border-pr/40 transition-all duration-200 rounded-l-lg'
        tabIndex={-1}
        aria-label={title}
      >
        <Image
          src={img}
          alt=''
          width={60}
          height={60}
          className='rounded-md bg-[#fff] w-[60px] h-[60px] group-hover:brightness-110 transition-all duration-200'
        />
      </a>
      <div className='p-2 flex flex-col'>
        <a href={link} target='_blank' rel='noreferrer' className='group/title'>
          <h3 className='mb-2 md:text-md tracking-tight text-fg group-hover/title:text-pr group-hover/title:underline group-hover/title:decoration-pr group-hover/title:underline-offset-2 transition-colors duration-200'>
            {title}
          </h3>
        </a>
        <p className='mb-3 text-sm text-fg-2'>{description}</p>
        <a
          href={link}
          target='_blank'
          rel='noreferrer'
          className='inline-flex text-sm items-center text-pr hover:underline ml-auto mt-auto group-hover:text-pr/80 transition-colors duration-200'
        >
          つかってみる
          <Image
            src='/images/linkOut.svg'
            alt=''
            width={16}
            height={16}
            className='ml-1 group-hover:scale-110 group-hover:text-pr/80 transition-all duration-200'
            style={{ color: 'inherit' }}
          />
        </a>
      </div>
    </div>
  )
}

export default toolsCard

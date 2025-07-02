import Image from 'next/image'
import Link from 'next/link'

export default function DisplaySns() {
  return (
    <div className='flex flex-row items-center justify-center gap-4 mt-8'>
      <Link
        href='https://x.com/you88451h'
        target='_blank'
        className='p-2 rounded transition-colors duration-200 hover:bg-white/5'
      >
        <Image
          src='/images/x-logo.svg'
          alt='X (Twitter)'
          width={22}
          height={22}
          className='opacity-80 hover:opacity-100 transition-opacity duration-200'
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      </Link>

      <Link
        href='https://github.com/poko8nada'
        target='_blank'
        className='p-2 rounded transition-colors duration-200 hover:bg-white/5'
      >
        <Image
          src='/images/github-mark-white.svg'
          alt='GitHub'
          width={22}
          height={22}
          className='opacity-80 hover:opacity-100 transition-opacity duration-200'
        />
      </Link>
    </div>
  )
}

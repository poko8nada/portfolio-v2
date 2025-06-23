import Image from 'next/image'
import Link from 'next/link'

export default function DisplaySns() {
  return (
    <div className='flex flex-row items-center justify-center gap-8 mt-8'>
      <Link
        href='https://x.com/you88451h'
        target='_blank'
        className='hover:scale-125 ease-in-out transition-transform'
      >
        <Image src='/images/x-logo.svg' alt='xlogo' width={26} height={26} />
      </Link>
      <Link
        href='https://github.com/poko8nada'
        target='_blank'
        className='hover:scale-125 ease-in-out transition-transform'
      >
        <Image
          src='/images/github-mark-white.svg'
          alt='githublogo'
          width={32}
          height={30}
        />
      </Link>
    </div>
  )
}

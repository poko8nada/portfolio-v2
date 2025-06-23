import { Nunito } from 'next/font/google'
import Image from 'next/image'

const nunito = Nunito({ subsets: ['latin'] })

export default ({
  imgSize = 120,
  fontSize = 1.5,
}: {
  imgSize?: number
  fontSize?: number
}) => {
  return (
    <header
      className={`${nunito.className} bg-bg text-3xl p-6 border-b-1 border-bg-2`}
    >
      <div className='flex flex-col items-center'>
        <Image
          src='/images/profile01.png'
          width={imgSize}
          height={imgSize}
          alt=''
          className='rounded-full'
        />
        <h1 className='text-center mt-4' style={{ fontSize: `${fontSize}rem` }}>
          PokoHanadaCom
        </h1>
      </div>
    </header>
  )
}

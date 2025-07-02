import Image from 'next/image'
import Link from 'next/link'
import DisplayHomePosts from '@/feature/display-home-posts'
import DisplayHomeSection from '@/feature/display-home-section'
import DisplaySns from '@/feature/display-sns'
import DisplayToolCards from '@/feature/display-tool-cards'

export default async function Home() {
  return (
    <div>
      <DisplayHomeSection title='About' id='about'>
        <p className='p-1 mt-2 text-center'>こんにちは。PokoHanadaです。</p>
        <p className='p-1 mt-2 text-center'>
          Webディレクター兼、デベロッパー。
          <br />
          企画から制作管理、なんなら実装まで一貫して担当します。
        </p>
        <DisplaySns />
        <div className='mt-6'>
          <Link
            href='/about'
            className='flex items-center justify-center text-pr hover:underline'
          >
            詳しい経歴を見る
            <Image
              src={'/images/arrow-next.svg'}
              width={16}
              height={16}
              alt='arrow next'
              className='inline ml-2'
            />
          </Link>
        </div>
      </DisplayHomeSection>

      <DisplayHomeSection title='Recent posts' id='posts'>
        <DisplayHomePosts />
      </DisplayHomeSection>

      <DisplayHomeSection title='Works & Tools' id='works'>
        <DisplayToolCards />
      </DisplayHomeSection>
    </div>
  )
}

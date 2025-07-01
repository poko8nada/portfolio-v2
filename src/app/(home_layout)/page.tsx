import DisplayHomePosts from '@/feature/display-home-posts'
import DisplayHomeSection from '@/feature/display-home-section'
import DisplaySns from '@/feature/display-sns'
import DisplayToolCards from '@/feature/display-tool-cards'
import Link from 'next/link'
import Image from 'next/image'

export default async function Home() {
  return (
    <div>
      <DisplayHomeSection title='about me' id='about'>
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

      <DisplayHomeSection title='recent posts' id='posts'>
        <DisplayHomePosts />
      </DisplayHomeSection>

      <DisplayHomeSection title='works & tools' id='works'>
        <DisplayToolCards />
      </DisplayHomeSection>
    </div>
  )
}

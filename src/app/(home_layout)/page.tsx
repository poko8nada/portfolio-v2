import DisplayHomePosts from '@/feature/display-home-posts'
import DisplayHomeSection from '@/feature/display-home-section'
import DisplaySns from '@/feature/display-sns'
import DisplayToolCards from '@/feature/display-tool-cards'

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

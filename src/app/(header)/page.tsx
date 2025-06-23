import DisplayHomePosts from '@/feature/display-home-posts'
import DisplayHomeSection from '@/feature/display-home-section'
import DisplaySns from '@/feature/display-sns'
import DisplayToolCards from '@/feature/display-tool-cards'

export default function Home() {
  return (
    <>
      <DisplayHomeSection title='about me'>
        <p className='p-1 mt-2 text-center'>こんにちは。PokoHanadaです。</p>
        <p className='p-1 mt-2 text-center'>
          手を動かすwebディレクターです。
          <br />
          webエンジニア、ディベロッパーでもあります。
        </p>
        <DisplaySns />
      </DisplayHomeSection>
      <DisplayHomeSection title='recent posts'>
        <DisplayHomePosts />
      </DisplayHomeSection>
      <DisplayHomeSection title='works & tools'>
        <DisplayToolCards />
      </DisplayHomeSection>
    </>
  )
}

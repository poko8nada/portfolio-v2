import { getResumeBySlug } from '@/lib/resume'
import { MarkdownForAbout } from '@/components/markdown-for-about'
import SectionBody from '@/components/sectionBody'
import SectionHeader from '@/components/sectionHeader'

export default async function AboutPage() {
  const resumeData = await getResumeBySlug('technical-skills')

  if (!resumeData) {
    return <div>Loading...</div>
  }

  return (
    <SectionBody>
      <SectionHeader>About</SectionHeader>
      <div className='text-center mb-12'>
        <p className='mb-4'>こんにちは。PokoHanadaです。</p>
        <p>
          Webディレクター兼、デベロッパー。
          <br />
          企画から制作管理、なんなら実装まで一貫して担当します。
        </p>
      </div>
      <div className='w-full px-4'>
        <MarkdownForAbout content={resumeData.content} />
      </div>
    </SectionBody>
  )
}

import { MarkdownForAbout } from '@/components/markdown-for-about'
import SectionBody from '@/components/sectionBody'
import { getResumeBySlug } from '@/lib/resume'

export default async function AboutPage() {
  const resumeData = await getResumeBySlug('technical-skills')

  if (!resumeData) {
    return <div>Loading...</div>
  }

  return (
    <SectionBody>
      <div className='mt-16 mb-22 px-4 sm:px-0 w-full'>
        <div className='w-full text-center'>
          <p className='text-base md:text-md leading-relaxed text-fg/90'>
            Webディレクター／デベロッパーとして、企画・設計から実装・運用まで一貫して担当。
            <br className='hidden sm:inline' />
            技術力と多様な業界経験、チームワーク・課題解決力を活かし、価値あるWeb体験をつくります。
          </p>
          <p className='mt-16 text-lg md:text-xl text-fg'>
            スキル一覧
          </p>
        </div>
      </div>
      <div className='w-full px-4'>
        <MarkdownForAbout content={resumeData.content} />
      </div>
    </SectionBody>
  )
}

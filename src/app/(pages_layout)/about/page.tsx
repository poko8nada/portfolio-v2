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
        <div className='w-full text-center md:px-4 px-0'>
          <p className='text-base md:text-md leading-relaxed text-fg/90 mt-5'>
            Next.js・React・TypeScriptを中心に幅広い技術をカバー。
            <br />
            Tailwind CSS・Drizzle
            ORMなどのフロントエンド、Node.js・Supabase・Cloudflareなどのバックエンド・クラウドまで構築できます。
          </p>
          <p className='text-base md:text-md leading-relaxed text-fg/90 mt-5'>
            設計・実装から運用・分析まで、最適な技術で価値あるWeb体験を提供します。
          </p>
          <p className='mt-16 text-lg md:text-xl text-fg'>スキル一覧</p>
        </div>
      </div>
      <div className='w-full px-4'>
        <MarkdownForAbout content={resumeData.content} />
      </div>
    </SectionBody>
  )
}

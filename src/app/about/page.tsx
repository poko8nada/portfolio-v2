import { LockClosedIcon } from '@heroicons/react/24/solid'
import { MarkdownForAbout } from '@/components/markdown-for-about'
import SectionBody from '@/components/sectionBody'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
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
          <p className='text-base md:text-md leading-relaxed text-fg/90 mt-3'>
            Next.js・React・TypeScriptを中心に幅広い技術をカバー。
          </p>
          <p className='text-base md:text-md leading-relaxed text-fg/90 mt-3'>
            Tailwind CSS・Drizzle ORMなどのフロントエンド、
            <br />
            Node.js・Supabase・Cloudflareなどのバックエンド・クラウドまで構築できます。
          </p>
          <p className='text-base md:text-md leading-relaxed text-fg/90 mt-3'>
            設計・実装から運用・分析まで、最適な技術で価値あるWeb体験を提供します。
          </p>
          <div className='mt-12 flex justify-center'>
            <ConfirmationDialog
              href='/resume'
              title='Resume - Private Area'
              description='このページは非公開情報を含んでいます。続行しますか？'
              className='inline-flex items-center gap-1 bg-transparent border-none p-0 text-base transition-colors duration-200'
            >
              <span className='flex items-center gap-2 cursor-pointer text-pr transition-colors duration-200 hover:text-pr-hover hover:underline hover:underline-offset-4 hover:decoration-pr-hover'>
                <LockClosedIcon className='w-5 h-5' />
                <span>レジュメ（閲覧にはパスワードが必要です）</span>
              </span>
            </ConfirmationDialog>
          </div>
        </div>
      </div>
      <div className='w-full px-4'>
        <p className='mb-12 text-center text-lg md:text-xl text-fg'>
          スキル一覧
        </p>
        <MarkdownForAbout content={resumeData.content} />
      </div>
    </SectionBody>
  )
}

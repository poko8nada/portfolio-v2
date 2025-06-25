import type { Metadata } from 'next'
import { MarkdownForResume } from '@/components/markdown-for-resume'
import { getAllResumeData } from '@/lib/resume'

export const metadata: Metadata = {
  title: 'Resume - Private Area',
  robots: 'noindex, nofollow, noarchive, nosnippet',
}

export default async function ResumePage() {
  const resumeData = await getAllResumeData()

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
          <div className='bg-bg-2 text-white px-6 py-4'>
            <h1 className='text-xl font-bold'>Private Area - Resume</h1>
            <p className='text-gray-300 mt-1 text-sm'>
              Confidential Information
            </p>
          </div>

          <div className='p-6'>
            {resumeData.length === 0 ? (
              <p className='text-gray-500 text-center py-8 text-sm'>
                No resume data available.
              </p>
            ) : (
              <div className='space-y-8'>
                {resumeData.map(item => (
                  <div
                    key={item.slug}
                    className='border-b border-gray-200 pb-8 last:border-b-0'
                  >
                    <div className='flex justify-between items-start mb-4'>
                      <h2 className='text-lg font-semibold text-gray-900'>
                        {item.frontmatter.title}
                      </h2>
                      <div className='text-xs text-gray-500'>
                        <span className='inline-block px-2 py-1 bg-gray-100 rounded text-xs mr-2'>
                          {item.frontmatter.type}
                        </span>
                        <div className='text-xs'>
                          Updated:{' '}
                          {new Date(
                            item.frontmatter.updatedAt,
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <MarkdownForResume content={item.content} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='bg-gray-50 px-6 py-4 border-t border-gray-200'>
            <p className='text-xs text-gray-600'>
              <span className='font-medium'>⚠️ Confidential:</span>
              This information is private and not indexed by search engines.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

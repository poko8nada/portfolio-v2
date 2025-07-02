import type { Metadata } from 'next'
import { MarkdownForResume } from '@/components/markdown-for-resume'
import profileImageData from '@/content/resume/images/profile.json'
import { getAllResumeData } from '@/lib/resume'
import type { ImageData } from '@/types/profile'

export const metadata: Metadata = {
  title: 'Resume - Private Area',
  robots: 'noindex, nofollow, noarchive, nosnippet',
}

export default async function ResumePage() {
  const resumeData = await getAllResumeData()
  const profileImage: ImageData = profileImageData

  const latestUpdated =
    resumeData.length > 0
      ? new Date(
          Math.max(
            ...resumeData.map(item =>
              new Date(item.frontmatter.updatedAt).getTime(),
            ),
          ),
        )
      : null

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-white shadow-lg rounded-lg overflow-hidden relative'>
          <div className='bg-bg-2 text-white px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center'>
            <div>
              <h1 className='text-xl font-bold'>Private Area - Resume</h1>
              <p className='text-gray-300 mt-1 text-sm'>
                Confidential Information
              </p>
            </div>
            {latestUpdated && (
              <div className='text-xs text-gray-200 min-w-[120px] text-right mt-4 sm:mt-0'>
                <span className='block'>Updated:</span>
                <span>{latestUpdated.toLocaleDateString()}</span>
              </div>
            )}
          </div>
          <div
            className='
              sm:absolute sm:top-38 sm:right-8
              sm:w-32 sm:h-40
              w-24 h-32
              mx-auto sm:mx-0
              mt-4 sm:mt-0
              border border-gray-300 bg-white
              flex items-center justify-center
              shadow-sm
              z-10
            '
          >
            <img
              src={profileImage.src}
              alt='プロフィール写真'
              className='object-cover w-full h-full'
              draggable={false}
            />
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

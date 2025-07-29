export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { DisplayResume } from '@/feature/display-resume'
import { getAllResumeData } from '@/lib/resume'

export const metadata: Metadata = {
  title: 'Resume - Private Area',
  robots: 'noindex, nofollow, noarchive, nosnippet',
}

export default async function ResumePage() {
  const resumeData = await getAllResumeData()

  return <DisplayResume resumeData={resumeData} />
}

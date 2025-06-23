import Link from 'next/link'
import SectionBody from '@/components/sectionBody'

export default function NotFound() {
  return (
    <SectionBody>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link
        href='/'
        style={{ marginTop: '3rem', display: 'inline-block', color: '#4199ff' }}
      >
        Return Home
      </Link>
    </SectionBody>
  )
}

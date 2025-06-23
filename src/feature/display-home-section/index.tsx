import SectionBody from '@/components/sectionBody'
import SectionHeader from '@/components/sectionHeader'

export default function DisplayHomeSection({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  return (
    <SectionBody>
      <SectionHeader>{title}</SectionHeader>
      {children}
    </SectionBody>
  )
}

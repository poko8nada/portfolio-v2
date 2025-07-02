import SectionBody from '@/components/sectionBody'
import SectionHeader from '@/components/sectionHeader'

export default function DisplayHomeSection({
  title,
  children,
  id,
}: {
  title: string
  children: React.ReactNode
  id?: string
}) {
  return (
    <SectionBody id={id}>
      <SectionHeader>{title}</SectionHeader>
      {children}
    </SectionBody>
  )
}

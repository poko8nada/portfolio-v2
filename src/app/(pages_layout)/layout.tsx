import PageHeader from '@/components/page-header'
import Main from '@/components/main'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHeader />
      <Main>{children}</Main>
    </>
  )
}

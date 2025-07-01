import MainHeader from '@/components/main-header'
import Main from '@/components/main'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainHeader />
      <Main>{children}</Main>
    </>
  )
}

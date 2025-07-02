import Header from '@/components/header'
import Main from '@/components/main'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header isHomePage={true} />
      <Main>{children}</Main>
    </>
  )
}

import Header from '@/components/header'
import Main from '@/components/main'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header imgSize={90} fontSize={1.2} />
      <Main>{children}</Main>
    </>
  )
}

import Header from '@/components/header'
import Main from '@/components/main'

export const runtime = 'edge'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Main>{children}</Main>
    </>
  )
}

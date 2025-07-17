import Header from '@/components/header'
import Main from '@/components/main'

export default function Layout({ children }: { children: React.ReactNode }) {
  const siteKey = process.env.TURNSTILE_SITE_KEY

  return (
    <>
      <Header isHomePage={false} siteKey={siteKey} />
      <Main>{children}</Main>
    </>
  )
}

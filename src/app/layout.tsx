import type { Metadata } from 'next'
import './globals.css'
import { GoogleTagManager } from '@next/third-parties/google'
import Footer from '@/components/footer'

export const metadata: Metadata = {
  title: 'pokoHanadaCom | freelance Web developer',
  description:
    'webディレクター兼エンジニア兼マーケターです。webディベロッパーでもあります。Webアプリケーション開発、フロントエンド開発が得意です。',
  alternates: {
    canonical: 'https://pokohanada.com/',
  },
  openGraph: {
    title: 'pokoHanadaCom | freelance Web developer',
    description:
      'webディレクター兼エンジニア兼マーケターです。webディベロッパーでもあります。Webアプリケーション開発、フロントエンド開発が得意です。',
    type: 'website',
    url: 'https://pokohanada.com/',
    images: 'https://pokohanada.com/images/profile01.png',
  },
  twitter: {
    card: 'summary',
    title: 'pokoHanadaCom | freelance Web developer',
    description:
      'webディレクター兼エンジニア兼マーケターです。webディベロッパーでもあります。Webアプリケーション開発、フロントエンド開発が得意です。',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ja'>
      <body>
        {children}
        <Footer />
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID as string} />
      </body>
    </html>
  )
}

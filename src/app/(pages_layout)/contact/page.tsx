import type { Metadata } from 'next'
import SectionBody from '@/components/sectionBody'
import SectionHeader from '@/components/sectionHeader'
import { ContactFormFeature } from '@/feature/contact/contact-form-feature'

export const metadata: Metadata = {
  title: 'Contact | pokoHanadaCom',
  description: 'お問い合わせフォームです。お気軽にご連絡ください。',
  alternates: {
    canonical: 'https://pokohanada.com/contact',
  },
}

export default function ContactPage() {
  const turnstileSiteKey = process.env.TURNSTILE_SITE_KEY

  if (!turnstileSiteKey) {
    console.error('TURNSTILE_SITE_KEY is not set.')
    return (
      <SectionBody>
        <SectionHeader>お問い合わせ</SectionHeader>
        <div className='rounded-md bg-red-900/50 p-6 text-center text-white'>
          <p>設定エラーが発生しました。管理者にお問い合わせください。</p>
        </div>
      </SectionBody>
    )
  }

  return (
    <SectionBody>
      <SectionHeader>お問い合わせ</SectionHeader>
      <div className='w-full max-w-2xl rounded-lg bg-bg-2 p-8 shadow-lg'>
        <ContactFormFeature siteKey={turnstileSiteKey} />
      </div>
    </SectionBody>
  )
}

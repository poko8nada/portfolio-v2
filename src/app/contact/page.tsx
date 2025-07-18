import { ContactFormFeature } from '@/feature/contact/contact-form-feature'

export default function ContactPage() {
  const siteKey = process.env.TURNSTILE_SITE_KEY || ''

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8 text-center'>お問い合わせ</h1>
        <ContactFormFeature siteKey={siteKey} />
      </div>
    </div>
  )
}

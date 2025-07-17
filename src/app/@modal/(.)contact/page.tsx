import { Modal } from '@/components/ui/modal'
import { ContactFormFeature } from '@/feature/contact/contact-form-feature'

export default function ContactModal() {
  const siteKey = process.env.TURNSTILE_SITE_KEY || ''

  return (
    <Modal>
      <ContactFormFeature siteKey={siteKey} />
    </Modal>
  )
}

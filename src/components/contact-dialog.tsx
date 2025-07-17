'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ContactFormFeature } from '@/feature/contact/contact-form-feature'

interface ContactDialogProps {
  children: React.ReactNode
  className?: string
  siteKey: string
}

export function ContactDialog({ children, className, siteKey }: ContactDialogProps) {
  return (
    <Dialog>
      <DialogTrigger className={className}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-bg-2 border-gray-600 text-fg">
        <DialogHeader>
          <DialogTitle>お問い合わせ</DialogTitle>
        </DialogHeader>
        <ContactFormFeature siteKey={siteKey} />
      </DialogContent>
    </Dialog>
  )
}

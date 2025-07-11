'use client'

import { useState } from 'react'
import { ContactForm } from '@/components/contact-form'
import { ERROR_MESSAGES } from '@/config/contact'
import { sendContactEmail } from '@/feature/contact/send-contact-email'
import type { ContactFormData, ContactResult } from '@/types/contact'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function ContactFormFeature({ siteKey }: { siteKey: string }) {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [result, setResult] = useState<ContactResult | null>(null)

  const handleSubmit = async (data: ContactFormData) => {
    setStatus('submitting')
    const result = await sendContactEmail(data)
    setResult(result)
    setStatus(result.ok ? 'success' : 'error')
  }

  if (status === 'success') {
    return (
      <div className='rounded-md bg-green-900/50 p-6 text-center text-white'>
        <h3 className='text-lg font-medium'>送信完了</h3>
        <p className='mt-2'>{result?.ok && result.message}</p>
      </div>
    )
  }

  return (
    <div>
      {status === 'error' && result && !result.ok && (
        <div className='mb-6 rounded-md bg-red-900/50 p-4 text-center text-white'>
          <p>{ERROR_MESSAGES[result.error]}</p>
        </div>
      )}
      <ContactForm
        onSubmitAction={handleSubmit}
        isSubmitting={status === 'submitting'}
        siteKey={siteKey}
      />
    </div>
  )
}

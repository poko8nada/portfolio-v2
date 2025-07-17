'use client'

import Image from 'next/image'
import { useCallback, useState } from 'react'
import { ContactForm } from '@/components/contact-form'
import { ERROR_MESSAGES } from '@/config/contact'
import { sendContactEmail } from '@/feature/contact/send-contact-email'
import { useSessionStorage } from '@/hooks/use-session-storage'
import type { ContactFormData, ContactResult } from '@/types/contact'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function ContactFormFeature({ siteKey }: { siteKey: string }) {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [result, setResult] = useState<ContactResult | null>(null)

  // sessionStorageでフォーム状態を管理
  const [formData, setFormData, clearFormData] = useSessionStorage<
    Partial<ContactFormData>
  >('contact-form-data', {})

  // useCallbackでonFormChangeをメモ化して無限ループを防ぐ
  const handleFormChange = useCallback(
    (data: Partial<ContactFormData>) => {
      setFormData(data)
    },
    [setFormData],
  )

  const handleSubmit = async (data: ContactFormData) => {
    setStatus('submitting')
    const result = await sendContactEmail(data)
    setResult(result)
    setStatus(result.ok ? 'success' : 'error')

    // 送信成功時はフォームデータをクリア
    if (result.ok) {
      clearFormData()
    }
  }

  if (status === 'success') {
    return (
      <div>
        <div className='rounded-md bg-green-900/50 p-6 text-center text-white'>
          <h3 className='text-lg font-medium'>送信完了</h3>
          <p className='mt-2'>{result?.ok && result.message}</p>
        </div>
        <div className='mt-6'>
          <a
            href='/'
            className='flex items-center justify-center text-pr hover:underline'
          >
            ホームに戻る
            <Image
              src={'/images/arrow-next.svg'}
              width={16}
              height={16}
              alt='arrow next'
              className='inline ml-2'
            />
          </a>
        </div>
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
        defaultValues={formData}
        onFormChange={handleFormChange}
      />
    </div>
  )
}

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Turnstile } from '@marsidev/react-turnstile'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import { contactSchema } from '@/config/contact'

export type ContactFormData = z.infer<typeof contactSchema>

type Props = {
  onSubmitAction: (data: ContactFormData) => void
  isSubmitting: boolean
  siteKey: string
}

export function ContactForm({ onSubmitAction, isSubmitting, siteKey }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmitAction)} className='space-y-6'>
      <div>
        <label htmlFor='name' className='block text-sm font-medium text-fg'>
          名前
        </label>
        <input
          id='name'
          {...register('name')}
          className='mt-1 block w-full rounded-md border-gray-600 bg-bg-2 p-2 text-fg shadow-sm focus:border-pr focus:ring-pr'
        />
        {errors.name && (
          <p className='mt-1 text-sm text-red-400'>{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor='email' className='block text-sm font-medium text-fg'>
          メールアドレス
        </label>
        <input
          id='email'
          type='email'
          {...register('email')}
          className='mt-1 block w-full rounded-md border-gray-600 bg-bg-2 p-2 text-fg shadow-sm focus:border-pr focus:ring-pr'
        />
        {errors.email && (
          <p className='mt-1 text-sm text-red-400'>{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor='subject' className='block text-sm font-medium text-fg'>
          件名
        </label>
        <input
          id='subject'
          {...register('subject')}
          className='mt-1 block w-full rounded-md border-gray-600 bg-bg-2 p-2 text-fg shadow-sm focus:border-pr focus:ring-pr'
        />
        {errors.subject && (
          <p className='mt-1 text-sm text-red-400'>{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label htmlFor='message' className='block text-sm font-medium text-fg'>
          メッセージ
        </label>
        <textarea
          id='message'
          {...register('message')}
          rows={6}
          className='mt-1 block w-full rounded-md border-gray-600 bg-bg-2 p-2 text-fg shadow-sm focus:border-pr focus:ring-pr'
        />
        {errors.message && (
          <p className='mt-1 text-sm text-red-400'>{errors.message.message}</p>
        )}
      </div>

      <div className='flex justify-center'>
        <Turnstile
          siteKey={siteKey}
          onSuccess={(token) => {
            setValue('turnstileToken', token)
            trigger('turnstileToken')
          }}
          options={{ theme: 'dark' }}
        />
      </div>
      {errors.turnstileToken && (
        <p className='text-center text-sm text-red-400'>
          {errors.turnstileToken.message}
        </p>
      )}

      <div className='text-center'>
        <Button
          type='submit'
          disabled={isSubmitting}
          className='w-full max-w-xs rounded-md bg-pr px-4 py-2 text-white shadow-sm hover:bg-pr/80 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isSubmitting ? '送信中...' : '送信'}
        </Button>
      </div>
    </form>
  )
}

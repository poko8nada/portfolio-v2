'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Turnstile } from '@marsidev/react-turnstile'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { contactSchema } from '@/config/contact'

export type ContactFormData = z.infer<typeof contactSchema>

type Props = {
  onSubmitAction: (data: ContactFormData) => void
  isSubmitting: boolean
  siteKey: string
}

export function ContactForm({ onSubmitAction, isSubmitting, siteKey }: Props) {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      turnstileToken: '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitAction)} className='space-y-6' noValidate>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>名前</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input type='email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='subject'
          render={({ field }) => (
            <FormItem>
              <FormLabel>件名</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='message'
          render={({ field }) => (
            <FormItem>
              <FormLabel>メッセージ</FormLabel>
              <FormControl>
                <Textarea rows={6} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='turnstileToken'
          render={() => (
            <FormItem>
              <div className='flex justify-center h-16'>
                <Turnstile
                  siteKey={siteKey}
                  onSuccess={token => {
                    form.setValue('turnstileToken', token)
                    form.trigger('turnstileToken')
                  }}
                  options={{ theme: 'dark' }}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
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
    </Form>
  )
}

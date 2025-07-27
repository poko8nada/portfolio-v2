'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useState } from 'react'
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
import { LazyTurnstile } from './lazy-turnstile'

export type ContactFormData = z.infer<typeof contactSchema>

type Props = {
  onSubmitAction: (data: ContactFormData) => void
  isSubmitting: boolean
  siteKey: string
  defaultValues?: Partial<ContactFormData>
  onFormChange?: (data: Partial<ContactFormData>) => void
}

export function ContactForm({
  onSubmitAction,
  isSubmitting,
  siteKey,
  defaultValues,
  onFormChange,
}: Props) {
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

  // defaultValuesが変更されたときにフォームをリセット
  useEffect(() => {
    if (defaultValues) {
      // 現在のturnstileTokenを保持してリセット
      const currentToken = form.getValues('turnstileToken')
      form.reset({
        name: defaultValues.name || '',
        email: defaultValues.email || '',
        subject: defaultValues.subject || '',
        message: defaultValues.message || '',
        turnstileToken: currentToken || '',
      })
    }
  }, [defaultValues, form])

  // フォーム変更時のハンドラー
  const handleFieldChange = useCallback(
    (fieldName: keyof ContactFormData, value: string) => {
      if (onFormChange) {
        const currentValues = form.getValues()
        const updatedValues = { ...currentValues, [fieldName]: value }
        // turnstileTokenを除外
        const { turnstileToken, ...formData } = updatedValues
        onFormChange(formData)
      }
    },
    [form, onFormChange],
  )

  const [turnstileReady, setTurnstileReady] = useState(false)

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitAction)}
        className='space-y-6'
        noValidate
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>名前</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={e => {
                    field.onChange(e)
                    handleFieldChange('name', e.target.value)
                  }}
                />
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
                <Input
                  type='email'
                  {...field}
                  onChange={e => {
                    field.onChange(e)
                    handleFieldChange('email', e.target.value)
                  }}
                />
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
                <Input
                  {...field}
                  onChange={e => {
                    field.onChange(e)
                    handleFieldChange('subject', e.target.value)
                  }}
                />
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
                <Textarea
                  rows={6}
                  {...field}
                  onChange={e => {
                    field.onChange(e)
                    handleFieldChange('message', e.target.value)
                  }}
                />
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
              <LazyTurnstile
                siteKey={siteKey}
                onSuccessAction={token => {
                  form.setValue('turnstileToken', token)
                  form.trigger('turnstileToken')
                  setTurnstileReady(true)
                }}
                onErrorAction={() => {
                  form.setError('turnstileToken', {
                    message: 'セキュリティ認証に失敗しました',
                  })
                  setTurnstileReady(false)
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='text-center'>
          <Button
            type='submit'
            disabled={isSubmitting || !turnstileReady}
            className='w-full max-w-xs rounded-md bg-pr px-4 py-2 text-white shadow-sm hover:bg-pr/80 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isSubmitting
              ? '送信中...'
              : !turnstileReady
                ? 'セキュリティ認証を完了してください'
                : '送信'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

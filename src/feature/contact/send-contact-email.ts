'use server'

import { Resend } from 'resend'
import { z } from 'zod'
import { contactSchema, ERROR_MESSAGES } from '@/config/contact'
import type { ContactError, ContactResult } from '@/types/contact'

const resend = new Resend(process.env.RESEND_API_KEY)

async function verifyTurnstile(token: string): Promise<boolean> {
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${encodeURIComponent(
        process.env.TURNSTILE_SECRET_KEY || ''
      )}&response=${encodeURIComponent(token)}`,
    }
  )
  const data = await response.json()
  return data.success
}

function handleResult(ok: false, error: ContactError): ContactResult {
  console.error(`Contact form error: ${error}`)
  return { ok, error }
}

export async function sendContactEmail(
  data: unknown
): Promise<ContactResult> {
  // 1. Zodバリデーション
  const validationResult = contactSchema.safeParse(data)
  if (!validationResult.success) {
    console.error('Validation failed:', validationResult.error.flatten())
    return handleResult(false, 'VALIDATION_ERROR')
  }
  const { name, email, subject, message, turnstileToken } = validationResult.data

  // 2. Turnstileトークン検証
  const isTurnstileValid = await verifyTurnstile(turnstileToken)
  if (!isTurnstileValid) {
    return handleResult(false, 'TURNSTILE_ERROR')
  }

  // 3. Resendでメール送信
  try {
    // 自動返信メール
    await resend.emails.send({
      from: 'contact@pokohanada.com',
      to: email,
      subject: '【pokoHanadaCom】お問い合わせありがとうございます',
      html: `<p>${name}様</p><p>お問い合わせいただきありがとうございます。以下の内容で承りました。</p><hr /><p>件名: ${subject}</p><p>内容:</p><p>${message.replace(/\n/g, '<br>')}</p><hr /><p>内容を確認の上、改めてご連絡いたしますので、しばらくお待ちください。</p>`,
      text: `${name}様\n\nお問い合わせいただきありがとうございます。以下の内容で承りました。\n\n---\n件名: ${subject}\n内容:\n${message}\n---\n\n内容を確認の上、改めてご連絡いたしますので、しばらくお待ちください。`,
    })

    // 管理者への通知メール
    await resend.emails.send({
      from: 'notification@pokohanada.com',
      to: process.env.MY_GMAIL_ADDRESS as string,
      subject: `【pokoHanadaCom】新規お問い合わせ: ${subject}`,
      html: `<p>新しいお問い合わせがありました。</p><hr /><p><strong>名前:</strong> ${name}</p><p><strong>メールアドレス:</strong> ${email}</p><p><strong>件名:</strong> ${subject}</p><p><strong>メッセージ:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
      text: `新しいお問い合わせがありました。\n\n---\n名前: ${name}\nメールアドレス: ${email}\n件名: ${subject}\nメッセージ:\n${message}`,
    })

    return { ok: true, message: 'お問い合わせありがとうございます。' }
  } catch (error) {
    console.error('Email send error:', error)
    return handleResult(false, 'EMAIL_SEND_ERROR')
  }
}

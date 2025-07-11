import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, '名前は2文字以上で入力してください').max(50),
  email: z.string().email('有効なメールアドレスを入力してください'),
  subject: z.string().min(5, '件名は5文字以上で入力してください').max(100),
  message: z.string().min(10, 'メッセージは10文字以上で入力してください').max(1000),
  turnstileToken: z.string().min(1, 'セキュリティ認証が必要です')
})

export const ERROR_MESSAGES = {
  VALIDATION_ERROR: '入力内容に誤りがあります。再度確認してください。',
  TURNSTILE_ERROR: 'セキュリティ認証に失敗しました。ページを再読み込みしてください。',
  EMAIL_SEND_ERROR: 'メール送信に失敗しました。しばらく経ってから再度お試しください。',
  RATE_LIMIT_ERROR: '送信回数が上限に達しました。しばらく経ってから再度お試しください。',
  UNKNOWN_ERROR: '予期しないエラーが発生しました。管理者にお問い合わせください。'
} as const
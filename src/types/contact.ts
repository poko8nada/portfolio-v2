export type ContactFormData = {
  name: string
  email: string
  subject: string
  message: string
  turnstileToken: string
}

export type ContactResult =
  | { ok: true; message: string }
  | { ok: false; error: ContactError }

export type ContactError =
  | 'VALIDATION_ERROR'
  | 'TURNSTILE_ERROR'
  | 'EMAIL_SEND_ERROR'
  | 'RATE_LIMIT_ERROR'
  | 'UNKNOWN_ERROR'

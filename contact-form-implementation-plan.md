# お問い合わせフォーム実装計画

## プロジェクト概要
- **フレームワーク**: Next.js 15.2.4 (App Router)
- **デプロイ環境**: Cloudflare Workers (OpenNext v1.3.1)
- **既存設定**: shadcn/ui, Tailwind CSS 4.0, TypeScript

## 技術スタック
- **フォーム**: shadcn/ui Form + React Hook Form + Zod
- **メール送信**: Resend API
- **スパム対策**: Cloudflare Turnstile
- **処理方式**: Server Actions（Next.js 15）
- **エラーハンドリング**: Result型パターン

## 実装ステータス

### ✅ 実装完了済み
- Server Action（メール送信・Turnstile検証）
- Zod バリデーション
- 基本的なフォーム機能
- Turnstile統合
- エラーハンドリング

### ⚠️ 修正が必要
- shadcn/ui Form未使用（現在は生HTMLを使用）
- ページ形式からダイアログ形式への変更

### 📋 設定が必要
- 環境変数設定
- Resendドメイン設定
- Turnstile設定

## 実装計画

### Phase 1: 基本修正
1. **shadcn/ui Form導入**
   ```bash
   npx shadcn@latest add form
   npx shadcn@latest add input
   npx shadcn@latest add textarea
   ```

2. **contact-form.tsx修正**
   - HTML inputからshadcn/ui Formコンポーネントへ変更
   - 統一されたスタイルとバリデーション表示を適用

### Phase 2: ダイアログ化
1. **ナビゲーション設定変更**
   - 全ページでContact常時表示
   - ダイアログトリガー用フラグ追加

2. **ダイアログコンポーネント作成**
   - `ContactDialog`コンポーネント
   - 既存`ContactFormFeature`をダイアログ内に統合

3. **Header統合**
   - ダイアログトリガー処理追加

## 実装詳細

### ファイル構成
```
portfolio-v2/src/
├── components/
│   ├── ui/
│   │   ├── form.tsx           # 新規：shadcn/ui form
│   │   ├── input.tsx          # 新規：shadcn/ui input
│   │   └── textarea.tsx       # 新規：shadcn/ui textarea
│   ├── contact-dialog.tsx     # 新規：ダイアログ統合
│   ├── contact-form.tsx       # 修正：shadcn/ui Form使用
│   └── header.tsx             # 修正：ダイアログトリガー
├── feature/contact/
│   ├── contact-form-feature.tsx  # 既存：変更なし
│   └── send-contact-email.ts     # 既存：変更なし
├── lib/
│   └── navigation.ts          # 修正：Contact常時表示
├── config/
│   └── contact.ts             # 既存：変更なし
├── types/
│   └── contact.ts             # 既存：変更なし
└── app/(pages_layout)/contact/
    └── page.tsx               # 修正：ダイアログ使用
```

### 型定義
```typescript
// src/types/contact.ts
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
```

### 設定
```typescript
// src/config/contact.ts
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
```

### 実装例

#### 1. 修正されたContactForm
```typescript
// src/components/contact-form.tsx
'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { contactSchema } from '@/config/contact'

export function ContactForm({ onSubmitAction, isSubmitting, siteKey }: Props) {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitAction)} className='space-y-6'>
        <FormField
          control={form.control}
          name="name"
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
        {/* 他のフィールドも同様 */}
      </form>
    </Form>
  )
}
```

#### 2. ダイアログコンポーネント
```typescript
// src/components/contact-dialog.tsx
'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ContactFormFeature } from '@/feature/contact/contact-form-feature'

interface ContactDialogProps {
  children: React.ReactNode
  className?: string
}

export function ContactDialog({ children, className }: ContactDialogProps) {
  return (
    <Dialog>
      <DialogTrigger className={className}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>お問い合わせ</DialogTitle>
        </DialogHeader>
        <ContactFormFeature />
      </DialogContent>
    </Dialog>
  )
}
```

#### 3. ナビゲーション設定
```typescript
// src/lib/navigation.ts
export const allNavItems: NavItem[] = [
  { label: 'Contact', href: '/contact', isAnchor: false, icon: 'Mail', isDialog: true },
  { label: 'Home', href: '/', isAnchor: false, icon: 'Home' },
  // ... 他のアイテム
]
```

## 環境設定

### 必須環境変数
```env
# .dev.vars
RESEND_API_KEY=re_your_api_key_here
TURNSTILE_SECRET_KEY=your_cloudflare_turnstile_secret
TURNSTILE_SITE_KEY=your_cloudflare_turnstile_site_key
```

### セットアップ手順
1. Resendでドメイン設定
2. Cloudflare TurnstileでサイトキーとシークレットキーKey取得
3. 環境変数設定
4. 開発サーバー起動: `pnpm dev`

## 実装チェックリスト

### Phase 1: 基本修正
- [ ] shadcn/ui form, input, textarea追加
- [ ] ContactFormをshadcn/ui Form対応に修正
- [ ] バリデーション表示確認

### Phase 2: ダイアログ化
- [ ] ContactDialogコンポーネント作成
- [ ] navigation.tsにisDialogフラグ追加
- [ ] Header統合（ダイアログトリガー）
- [ ] /contactページでもダイアログ使用

### Phase 3: 最終確認
- [ ] 全ページでContact表示確認
- [ ] モバイル・デスクトップ対応確認
- [ ] フォーム送信テスト
- [ ] エラーハンドリング確認

## 実装の優先度
1. **Critical**: shadcn/ui Form導入
2. **High**: ダイアログ化
3. **Medium**: UX改善
4. **Low**: 細かな調整

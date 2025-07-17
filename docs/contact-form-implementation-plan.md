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
- shadcn/ui Form統合
- ContactDialogコンポーネント実装
- ナビゲーション統合（全ページ対応）
- ダークテーマ対応
- React Hook Form制御エラー修正
- アイコンマッピング修正
- HTML5バリデーション無効化（noValidate追加）
- エラーメッセージスタイル統一
- エラー時のUI色調整（red-400統一）
- ダイアログ高さ固定化対応

### 📋 設定が必要
- 環境変数設定（TURNSTILE_SITE_KEY, RESEND_API_KEY）
- Resendドメイン設定
- Turnstile設定

### ⚠️ 既知の問題
- メールアドレス入力欄のオートフィル背景色（白色表示）
- オートフィル対策とオートコンプリート機能のトレードオフ

### 🔧 追加実装済み
- ContactDialog（ダイアログ形式）
- 全ページナビゲーションでContact表示
- モバイル・デスクトップ対応
- プロジェクトテーマに合わせたスタイル調整

## 実装計画（完了済み）

### ✅ Phase 1: 基本修正（完了）
1. **shadcn/ui Form導入**
   ```bash
   npx shadcn@latest add form
   npx shadcn@latest add input
   npx shadcn@latest add textarea
   ```

2. **contact-form.tsx修正**
   - ✅ HTML inputからshadcn/ui Formコンポーネントへ変更済み
   - ✅ 統一されたスタイルとバリデーション表示適用済み
   - ✅ React Hook Formの制御エラー修正済み

### ✅ Phase 2: ダイアログ化（完了）
1. **ナビゲーション設定変更**
   - ✅ 全ページでContact常時表示（最後に配置）
   - ✅ ダイアログトリガー用isDialogフラグ追加済み

2. **ダイアログコンポーネント作成**
   - ✅ `ContactDialog`コンポーネント実装済み
   - ✅ `ContactFormFeature`をダイアログ内に統合済み
   - ✅ ダークテーマ対応済み

3. **Header統合**
   - ✅ ダイアログトリガー処理追加済み
   - ✅ siteKey プロパティ対応済み

### ✅ Phase 3: 追加修正（完了）
1. **アイコン修正**
   - ✅ Mail iconをIconMapに追加
   - ✅ Contact専用アイコン設定

2. **レイアウト統合**
   - ✅ home_layout と pages_layout 両対応
   - ✅ siteKey環境変数の適切な受け渡し

### ✅ Phase 4: UI/UXバリデーション修正（完了）
1. **バリデーション体験向上**
   - ✅ HTML5バリデーション無効化（noValidate属性追加）
   - ✅ Zodカスタムエラーメッセージ優先表示
   - ✅ 日本語エラーメッセージ統一

2. **エラー表示スタイル統一**
   - ✅ エラーメッセージ色: `text-red-400`
   - ✅ エラー時ラベル色: `text-red-400`
   - ✅ エラー時フォーム外枠色: `border-red-400`
   - ✅ エラーメッセージサイズ調整: `text-xs`

3. **ダイアログ高さ安定化**
   - ✅ エラーメッセージ用固定高さ確保: `min-h-[1rem]`
   - ✅ 高さ変動によるレイアウトシフト防止

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

### ✅ Phase 1: 基本修正（完了）
- [x] shadcn/ui form, input, textarea追加
- [x] ContactFormをshadcn/ui Form対応に修正
- [x] バリデーション表示確認
- [x] React Hook Form制御エラー修正

### ✅ Phase 2: ダイアログ化（完了）
- [x] ContactDialogコンポーネント作成
- [x] navigation.tsにisDialogフラグ追加
- [x] Header統合（ダイアログトリガー）
- [x] /contactページでもダイアログ使用
- [x] ダークテーマ対応

### ✅ Phase 3: 最終確認（完了）
- [x] 全ページでContact表示確認
- [x] モバイル・デスクトップ対応確認
- [x] アイコンマッピング修正
- [x] ナビゲーション順序調整（Contact最後）

### ✅ Phase 4: UI/UXバリデーション修正（完了）
- [x] HTML5バリデーション無効化（noValidate）
- [x] Zodエラーメッセージ優先表示
- [x] エラー状態色統一（red-400）
- [x] ダイアログ高さ固定化
- [x] エラーメッセージサイズ調整

### 📋 残作業
- [ ] フォーム送信テスト（環境変数設定後）
- [ ] エラーハンドリング確認

## 実装状況サマリー
- **実装完了**: コア機能・UI統合・ダイアログ化・バリデーション改善
- **次のステップ**: 環境変数設定・動作テスト
- **技術課題**: 主要課題解決済み
- **UI/UX**: ダークテーマ対応・エラー表示統一完了
- **残課題**: メールアドレス入力欄オートフィル背景色のみ

## 今後の作業
1. **環境変数設定**: TURNSTILE_SITE_KEY, RESEND_API_KEY
2. **動作テスト**: フォーム送信・メール配信確認
3. **本番確認**: Cloudflare Workers環境での動作確認

## 技術的な決定事項
- **バリデーション**: HTML5標準バリデーションを無効化してZodカスタムメッセージを優先
- **エラー表示**: `red-400`色で統一し、視認性を向上
- **レイアウト**: エラーメッセージ用固定高さでダイアログの安定性を確保

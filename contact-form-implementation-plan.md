# お問い合わせフォーム実装計画

## 実装指示書（Gemini CLI用）

### プロジェクト概要
- **フレームワーク**: Next.js 15.2.4 (App Router)
- **デプロイ環境**: Cloudflare Workers (OpenNext v1.3.1)
- **既存設定**: shadcn/ui, Tailwind CSS 4.0, TypeScript
- **プロジェクトルート**: `portfolio-v2/`

### 実装状況
**✅ 実装完了済み** - Next.js + OpenNext + Cloudflare Workersを使用したお問い合わせフォームは実装済みです。

## 技術スタック

### フロントエンド
- **フォーム**: shadcn/ui Form + React Hook Form（既存UI体系に合わせる）
- **バリデーション**: Zod（型安全性確保）
- **スパム対策**: Cloudflare Turnstile
- **UI状態管理**: 送信中・成功・失敗状態の明確な表示

### バックエンド
- **処理方式**: Server Actions（Next.js 15のベストプラクティス）
- **メール送信**: Resend API
- **エラーハンドリング**: Result型パターン（プロジェクトルール準拠）
- **レート制限**: Cloudflare Workers機能活用

## 実装状況確認

### ✅ 実装完了済み項目

1. **基盤準備**
   - パッケージインストール完了
   - 型定義ファイル作成済み（`src/types/contact.ts`）
   - 設定ファイル作成済み（`src/config/contact.ts`）

2. **Server Action実装**
   - `src/feature/contact/send-contact-email.ts`実装済み
   - Resend APIでのメール送信機能実装済み
   - Turnstile トークン検証実装済み
   - Zodバリデーション実装済み
   - Result型パターンでのエラーハンドリング実装済み

3. **UI実装**
   - `src/components/contact-form.tsx`実装済み
   - `src/feature/contact/contact-form-feature.tsx`実装済み
   - 全フォームフィールド実装済み
   - UI状態管理実装済み
   - Turnstile統合実装済み

4. **ページ統合**
   - `src/app/(pages_layout)/contact/page.tsx`実装済み
   - ナビゲーション統合済み

### ⚠️ 設定が必要な項目

1. **環境変数の設定**
   - `RESEND_API_KEY`
   - `TURNSTILE_SECRET_KEY`
   - `TURNSTILE_SITE_KEY`

2. **Resendドメイン設定**
   - CloudflareでのDNSレコード設定
   - Resendでのドメイン認証

## 必須ファイル構成

**作成必須ファイル**:
```
portfolio-v2/src/
├── app/(pages_layout)/contact/
│   └── page.tsx                  # お問い合わせページ（Server Component）
├── components/
│   └── contact-form.tsx          # フォームUIコンポーネント（Client Component）
├── config/
│   └── contact.ts                # Zodスキーマと設定
├── feature/contact/
│   ├── contact-form-feature.tsx  # フォーム機能統合（Client Component）
│   └── send-contact-email.ts     # Server Action（'use server'）
└── types/
    └── contact.ts                # TypeScript型定義
```

**プロジェクトルール準拠**:
- `app/` 配下はServer Component優先
- `feature/` で機能をまとめる
- `components/` はロジックなしUI専用

## セキュリティ考慮事項

1. **入力検証**
   - 全フィールドでXSS対策
   - SQLインジェクション対策（該当する場合）
   - ファイルアップロード制限

2. **レート制限**
   - IP単位での送信制限
   - セッション単位での制限

3. **スパム対策**
   - Cloudflare Turnstile必須
   - ハニーポット実装検討

4. **データ保護**
   - 送信データの暗号化
   - ログに機密情報を含めない

## 必須実装コード例

### 1. 型定義（src/types/contact.ts）
```typescript
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

### 2. Zodスキーマ（src/config/contact.ts）
```typescript
import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, '名前は2文字以上で入力してください').max(50),
  email: z.string().email('有効なメールアドレスを入力してください'),
  subject: z.string().min(5, '件名は5文字以上で入力してください').max(100),
  message: z.string().min(10, 'メッセージは10文字以上で入力してください').max(1000),
  turnstileToken: z.string().min(1, 'セキュリティ認証が必要です')
})
```

### 3. エラーメッセージ日本語化
```typescript
export const ERROR_MESSAGES = {
  VALIDATION_ERROR: '入力内容に誤りがあります。再度確認してください。',
  TURNSTILE_ERROR: 'セキュリティ認証に失敗しました。ページを再読み込みしてください。',
  EMAIL_SEND_ERROR: 'メール送信に失敗しました。しばらく経ってから再度お試しください。',
  RATE_LIMIT_ERROR: '送信回数が上限に達しました。しばらく経ってから再度お試しください。',
  UNKNOWN_ERROR: '予期しないエラーが発生しました。管理者にお問い合わせください。'
} as const
```

## テスト計画

1. **フォームバリデーション**
   - 必須フィールドテスト
   - 形式チェック（メールアドレス等）
   - 文字数制限テスト

2. **送信処理**
   - 正常ケース
   - エラーケース（ネットワーク、API障害）
   - Turnstile認証失敗

3. **セキュリティ**
   - XSS攻撃テスト
   - レート制限テスト
   - スパム送信テスト

## パフォーマンス最適化

1. **フォーム最適化**
   - 遅延読み込み（Turnstile）
   - デバウンス処理（バリデーション）

2. **サーバー最適化**
   - レスポンス圧縮
   - キャッシュ戦略

## 実装チェックリスト

### ✅ 実装完了済み
- [x] パッケージインストール完了
- [x] `src/types/contact.ts`作成済み
- [x] `src/config/contact.ts`作成済み
- [x] `src/feature/contact/send-contact-email.ts`作成済み
- [x] Resend APIメール送信機能実装済み
- [x] Turnstile検証機能実装済み
- [x] Result型エラーハンドリング実装済み
- [x] `src/components/contact-form.tsx`作成済み
- [x] `src/feature/contact/contact-form-feature.tsx`作成済み
- [x] フォームバリデーション実装済み
- [x] 全UI状態の表示実装済み
- [x] `src/app/(pages_layout)/contact/page.tsx`作成済み
- [x] `/contact`ページアクセス可能

### ⚠️ 設定・テストが必要な項目
- [ ] 環境変数の設定（`.dev.vars`）
- [ ] Resendドメイン設定とDNS認証
- [ ] Cloudflare Turnstile設定
- [ ] メール送信テスト実行
- [ ] エラーハンドリング動作確認

## 設定・運用手順

### 必須設定手順

1. **環境変数設定**
   - `.dev.vars`ファイルに以下を追加：
   ```
   RESEND_API_KEY=re_your_api_key_here
   TURNSTILE_SECRET_KEY=your_cloudflare_turnstile_secret
   TURNSTILE_SITE_KEY=your_cloudflare_turnstile_site_key
   ```

2. **Resendドメイン設定**
   - Resendでドメイン追加
   - CloudflareでMX・TXTレコード設定
   - ドメイン認証完了

3. **Cloudflare Turnstile設定**
   - Turnstileサイト作成
   - サイトキー・シークレットキー取得

### テスト・確認手順
```bash
# 開発サーバー起動
cd portfolio-v2
pnpm dev

# 本番環境プレビュー
pnpm preview

# 本番デプロイ
pnpm deploy
```

### 実装済み機能の確認
- 既存実装は`src/components/ui/`配下のデザインシステムに準拠
- 日本語メッセージ・エラーハンドリング実装済み
- レスポンシブ対応・アクセシビリティ対応済み

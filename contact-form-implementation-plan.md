# お問い合わせフォーム実装計画

## 実装指示書（Gemini CLI用）

### プロジェクト概要
- **フレームワーク**: Next.js 15.2.4 (App Router)
- **デプロイ環境**: Cloudflare Workers (OpenNext v1.3.1)
- **既存設定**: shadcn/ui, Tailwind CSS 4.0, TypeScript
- **プロジェクトルート**: `portfolio-v2/`

### 必須実装要件
Next.js + OpenNext + Cloudflare Workersを使用したお問い合わせフォームの完全実装

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

## 実装フェーズ

### Phase 1: 基盤準備（必須作業）

1. **パッケージインストール**
   ```bash
   cd portfolio-v2
   pnpm add react-hook-form @hookform/resolvers zod resend @marsidev/react-turnstile
   ```

2. **環境変数ファイル更新**
   - **ファイル**: `portfolio-v2/.dev.vars`
   - **追加内容**:
   ```
   RESEND_API_KEY=re_your_api_key_here
   TURNSTILE_SECRET_KEY=your_cloudflare_turnstile_secret
   TURNSTILE_SITE_KEY=your_cloudflare_turnstile_site_key
   ```

3. **型定義ファイル作成**
   - **場所**: `src/types/contact.ts`
   - **内容**: 下記の完全な型定義を含める

### Phase 2: Server Action実装（コア機能）

**ファイル作成**: `src/feature/contact/send-contact-email.ts`

1. **必須実装内容**:
   - Resend APIでのメール送信
   - Turnstile トークン検証
   - 入力データのZodバリデーション
   - Result型パターンでのエラーハンドリング
   - レート制限チェック

2. **メールテンプレート**:
   - HTML形式とテキスト形式両方
   - 送信者情報の明確な表示
   - 自動返信メール機能

### Phase 3: UI実装（フロントエンド）

**作成ファイル**:
1. `src/components/contact-form.tsx` - フォームUI
2. `src/feature/contact/contact-form-feature.tsx` - 機能統合

**必須要件**:
1. **フォームフィールド**:
   - 名前（必須、2-50文字）
   - メールアドレス（必須、有効形式）
   - 件名（必須、5-100文字）
   - メッセージ（必須、10-1000文字）

2. **UI状態**:
   - 初期状態、送信中、成功、エラーの4状態
   - 送信中はボタン無効化とスピナー表示
   - エラー時は具体的なメッセージ表示

3. **Turnstile統合**:
   - フォーム送信時のみ表示
   - 認証完了後に送信処理実行

### Phase 4: ページ統合（最終工程）

1. **お問い合わせページ作成**
   - **ファイル**: `src/app/(pages_layout)/contact/page.tsx`
   - **要件**: レスポンシブ、アクセシビリティ対応、SEO最適化

2. **ナビゲーション更新**
   - 既存のヘッダーコンポーネントに「お問い合わせ」リンク追加
   - フッター部分への連絡先情報追加

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

### Phase 1 完了条件
- [ ] パッケージインストール完了
- [ ] `.dev.vars`に環境変数追加
- [ ] `src/types/contact.ts`作成
- [ ] `src/config/contact.ts`作成

### Phase 2 完了条件
- [ ] `src/feature/contact/send-contact-email.ts`作成
- [ ] Resend APIメール送信機能実装
- [ ] Turnstile検証機能実装
- [ ] Result型エラーハンドリング実装

### Phase 3 完了条件
- [ ] `src/components/contact-form.tsx`作成
- [ ] `src/feature/contact/contact-form-feature.tsx`作成
- [ ] フォームバリデーション動作確認
- [ ] 全UI状態の表示確認

### Phase 4 完了条件
- [ ] `src/app/(pages_layout)/contact/page.tsx`作成
- [ ] `/contact`ページアクセス可能
- [ ] メール送信テスト成功
- [ ] エラーハンドリング動作確認

## 重要な実装注意事項

### 必須遵守ルール
1. **TypeScript厳格モード**
   - `any`型は絶対使用禁止
   - 全関数に明示的な戻り値型指定
   - Result型パターンでエラーハンドリング

2. **Next.js 15 App Router**
   - Server Actions使用（`'use server'`指定）
   - API Routes作成不要
   - Server Component優先、Client Componentは必要時のみ

3. **Cloudflare Workers対応**
   - Node.js固有APIは使用不可
   - エッジランタイム対応のライブラリのみ使用
   - 環境変数は`.dev.vars`経由でアクセス

### デバッグ・テスト方法
```bash
# 開発サーバー起動
cd portfolio-v2
pnpm dev

# Cloudflare環境でのプレビュー
pnpm preview

# 本番デプロイ
pnpm deploy
```

### 実装時の参考情報
- 既存コンポーネントは`src/components/ui/`配下を参照
- プロジェクトの色・デザインシステムは既存ファイルに準拠
- 日本語コメント・メッセージ使用

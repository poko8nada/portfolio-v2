# Turnstile CPU時間制限対策 - Phase 1実装計画書

## 🎯 目的
Cloudflare Workers無料プラン（CPU時間制限10ms）でTurnstileを使用するため、ページ読み込み時のCPU使用量を削減し、遅延レンダリングを実装する。

## 📋 現状分析

### 技術スタック
- **フレームワーク**: Next.js 15 + App Router
- **デプロイ**: OpenNext + Cloudflare Workers (無料プラン)
- **Turnstile**: `@marsidev/react-turnstile` v1.1.0
- **フォーム**: React Hook Form + Zod + shadcn/ui
- **処理**: Server Actions (`send-contact-email.ts`)

### 問題点
- **CPU時間制限**: 10ms（Cloudflare Workers 無料プラン）
- **発生箇所**: `/contact` ページでのTurnstile処理
- **現在の動作**: ページ読み込み時にTurnstileウィジェットが即座にレンダリング

## 🔧 実装計画

### 1. LazyTurnstileコンポーネント作成

**ファイル**: `src/components/lazy-turnstile.tsx`

```typescript
'use client'

import { Turnstile } from '@marsidev/react-turnstile'
import { useState } from 'react'

type Props = {
  siteKey: string
  onSuccess: (token: string) => void
  onError?: () => void
}

export function LazyTurnstile({ siteKey, onSuccess, onError }: Props) {
  const [shouldRender, setShouldRender] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadTurnstile = () => {
    setIsLoading(true)
    setShouldRender(true)
  }

  if (!shouldRender) {
    return (
      <div className='flex justify-center h-16'>
        <button
          type='button'
          onClick={handleLoadTurnstile}
          className='px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors'
          disabled={isLoading}
        >
          {isLoading ? 'セキュリティ認証読み込み中...' : 'セキュリティ認証を開始'}
        </button>
      </div>
    )
  }

  return (
    <div className='flex justify-center h-16'>
      <Turnstile
        siteKey={siteKey}
        onSuccess={onSuccess}
        onError={onError}
        options={{ theme: 'dark' }}
      />
    </div>
  )
}
```

### 2. ContactFormコンポーネント修正

**ファイル**: `src/components/contact-form.tsx`

**修正内容**:
1. `LazyTurnstile`コンポーネントをインポート
2. `turnstileToken`フィールドを`LazyTurnstile`に変更
3. フォーム送信ボタンの状態管理を追加

**変更箇所**:

```typescript
// インポート追加
import { LazyTurnstile } from './lazy-turnstile'

// 状態管理追加
const [turnstileReady, setTurnstileReady] = useState(false)

// FormFieldのturnstileTokenを変更
<FormField
  control={form.control}
  name='turnstileToken'
  render={() => (
    <FormItem>
      <LazyTurnstile
        siteKey={siteKey}
        onSuccess={token => {
          form.setValue('turnstileToken', token)
          form.trigger('turnstileToken')
          setTurnstileReady(true)
        }}
        onError={() => {
          form.setError('turnstileToken', {
            message: 'セキュリティ認証に失敗しました'
          })
          setTurnstileReady(false)
        }}
      />
      <FormMessage />
    </FormItem>
  )}
/>

// 送信ボタンを変更
<Button
  type='submit'
  disabled={isSubmitting || !turnstileReady}
  className='w-full max-w-xs rounded-md bg-pr px-4 py-2 text-white shadow-sm hover:bg-pr/80 disabled:cursor-not-allowed disabled:opacity-50'
>
  {isSubmitting ? '送信中...' : !turnstileReady ? 'セキュリティ認証を完了してください' : '送信'}
</Button>
```

## 📝 実装手順

### Step 1: LazyTurnstileコンポーネント作成
1. `src/components/lazy-turnstile.tsx`を作成
2. ボタンクリック時のTurnstile遅延ロード機能を実装
3. ローディング状態とエラーハンドリングを追加

### Step 2: ContactForm修正
1. `src/components/contact-form.tsx`に`LazyTurnstile`をインポート
2. `turnstileToken`フィールドを`LazyTurnstile`コンポーネントに変更
3. `turnstileReady`状態を追加し、送信ボタンの制御を実装

### Step 3: 動作確認
1. ローカル環境でページ読み込み時のCPU使用量確認
2. Turnstileボタンクリック後の動作確認
3. フォーム送信の正常動作確認

## 🎯 期待効果

- **ページ読み込み時CPU使用量**: 90%削減
- **初回表示速度**: 向上
- **ユーザビリティ**: 認証のタイミングが明確
- **CPU制限エラー**: 大幅削減

## 🔍 テスト項目

### 機能テスト
- [x] ページ読み込み時にTurnstileが表示されない
- [x] 「セキュリティ認証を開始」ボタンが表示される
- [x] ボタンクリック後にTurnstileが正常に表示される
- [x] Turnstile認証後にフォーム送信が可能になる
- [x] 認証失敗時にエラーメッセージが表示される

### パフォーマンステスト
- [ ] ページ読み込み速度の向上確認
- [ ] CPU使用量の削減確認
- [ ] Turnstile読み込み時間の測定

## 🚀 デプロイ前チェックリスト

- [ ] TypeScriptエラーが発生していない
- [ ] 既存のフォーム機能が正常に動作する
- [ ] Turnstile認証が正常に完了する
- [ ] メール送信が正常に動作する
- [ ] レスポンシブデザインが保たれている

## 📊 成功指標

- **CPU時間制限エラー**: 0件/日
- **フォーム送信成功率**: 95%以上
- **ページ読み込み速度**: 現状比20%向上
- **Turnstile認証成功率**: 98%以上

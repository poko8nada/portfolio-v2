# コンタクトフォーム モダン化実装計画

## プロジェクト概要
既存のDialogベースのコンタクトフォームを、Next.js 15のParallel Routes + Intercept Routesを使用してモダン化する。

## 目標
1. **URL共有対応**: `/contact`でアクセス可能なモーダル
2. **State保持**: sessionStorageによるフォーム内容保持
3. **ブラウザ履歴統合**: 戻る/進むボタンでモーダル制御
4. **ソフトナビゲーション**: 元ページの状態維持

## 技術仕様
- **フレームワーク**: Next.js 15 (App Router)
- **モーダル実装**: Parallel Routes + Intercept Routes
- **State管理**: sessionStorage + React Hook Form
- **バリデーション**: Zod
- **UI**: shadcn/ui
- **メール送信**: Resend API + Server Actions

## 実装アーキテクチャ

### ディレクトリ構造
```
src/app/
├── @modal/                    # Parallel Routes スロット
│   ├── (.)contact/           # Intercept Routes (ソフトナビゲーション)
│   │   └── page.tsx          # モーダル版コンタクトフォーム
│   └── default.tsx           # デフォルトスロット (null)
├── contact/                   # 通常ページ
│   └── page.tsx              # 通常版コンタクトフォーム
├── layout.tsx                # modal slotを追加
└── ...existing files
```

### 実装フロー
1. **ソフトナビゲーション** (`Link`経由): `@modal/(.)contact/page.tsx` → モーダル表示
2. **ハードナビゲーション** (直接アクセス): `contact/page.tsx` → 通常ページ表示
3. **State保持**: sessionStorageで両方の状態を共有

## 実装計画

### Phase 1: 基盤構築 (1-2ファイル)
#### 1.1 ルートレイアウト更新
- `src/app/layout.tsx` にmodal slotを追加
- 型定義の更新

#### 1.2 デフォルトスロット作成
- `src/app/@modal/default.tsx` 作成

### Phase 2: ページ構造作成 (2-3ファイル)
#### 2.1 通常ページ作成
- `src/app/contact/page.tsx` 作成
- 既存のContactFormFeatureを流用

#### 2.2 Intercept Routes作成
- `src/app/@modal/(.)contact/page.tsx` 作成
- モーダルラッパーコンポーネント作成

### Phase 3: State管理実装 (1-2ファイル)
#### 3.1 sessionStorage Hook作成
- `src/hooks/use-session-storage.ts` 作成
- フォーム状態の保存・復元機能

#### 3.2 フォーム統合
- ContactFormFeatureにsessionStorage統合
- フォーム初期値の復元処理

### Phase 4: ナビゲーション統合 (1-2ファイル)
#### 4.1 既存Dialog削除
- `src/components/contact-dialog.tsx` 削除
- navigation設定の更新

#### 4.2 Header統合
- Linkコンポーネントで`/contact`へ遷移
- isDialog設定の削除

### Phase 5: 最終調整・テスト (1-2ファイル)
#### 5.1 スタイル調整
- モーダルとページの一貫性確保
- レスポンシブ対応

#### 5.2 動作確認
- 各遷移パターンのテスト
- sessionStorage動作確認

## 実装詳細

### 1. ルートレイアウト (layout.tsx)
```typescript
export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        {children}
        {modal}
      </body>
    </html>
  )
}
```

### 2. Intercept Routes実装
```typescript
// @modal/(.)contact/page.tsx
import { Modal } from '@/components/ui/modal'
import { ContactFormFeature } from '@/feature/contact/contact-form-feature'

export default function ContactModal() {
  return (
    <Modal>
      <ContactFormFeature />
    </Modal>
  )
}
```

### 3. sessionStorage Hook
```typescript
// hooks/use-session-storage.ts
export function useSessionStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error('sessionStorage error:', error)
    }
  }

  return [storedValue, setValue] as const
}
```

### 4. モーダルコンポーネント
```typescript
// components/ui/modal.tsx
'use client'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back()
    }
  }

  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={handleOpenChange}>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  )
}
```

## 既存実装からの変更点

### 削除対象
- `src/components/contact-dialog.tsx`
- `src/lib/navigation.ts` のisDialogフラグ
- Header.tsxのダイアログ処理

### 変更対象
- `src/app/layout.tsx`: modal slot追加
- `src/components/header.tsx`: Link遷移に変更
- `src/feature/contact/contact-form-feature.tsx`: sessionStorage統合

### 新規作成
- `src/app/@modal/default.tsx`
- `src/app/@modal/(.)contact/page.tsx`
- `src/app/contact/page.tsx`
- `src/hooks/use-session-storage.ts`
- `src/components/ui/modal.tsx`

## 実装後の動作フロー

### ソフトナビゲーション (Link経由)
1. ユーザーがHeaderのContactリンクをクリック
2. Next.jsがソフトナビゲーション実行
3. Intercept Routesが動作し、`@modal/(.)contact/page.tsx`を表示
4. モーダルが元ページの上に表示
5. 元ページの状態は保持される

### ハードナビゲーション (直接アクセス)
1. ユーザーが`/contact`に直接アクセス
2. 通常のページルーティング
3. `contact/page.tsx`が表示
4. フルページとして表示

### State保持
1. フォーム入力時にsessionStorageに自動保存
2. ページ遷移・リロード時に自動復元
3. フォーム送信成功時にsessionStorageクリア

## 実装スケジュール

### Week 1: 基盤構築
- [ ] Phase 1: ルートレイアウト・デフォルトスロット
- [ ] Phase 2: ページ構造作成
- [ ] 動作確認・調整

### Week 2: 機能実装
- [ ] Phase 3: State管理実装
- [ ] Phase 4: ナビゲーション統合
- [ ] Phase 5: 最終調整・テスト

## 期待される効果

### UX改善
- URL共有可能なコンタクトフォーム
- フォーム入力の途中保存
- ブラウザ履歴との自然な統合
- 元ページの状態保持

### 技術的メリット
- モダンなNext.js機能の活用
- パフォーマンス向上（Partial Rendering）
- SEO対応
- 保守性の向上

## リスク・考慮事項

### 技術的リスク
- Parallel Routes/Intercept Routesの学習コスト
- sessionStorageの容量制限
- ブラウザ互換性

### 対策
- 段階的実装による リスク軽減
- エラーハンドリングの充実
- フォールバック機能の実装

## 実装完了後の確認項目

### 機能確認
- [ ] `/contact`直接アクセス (通常ページ)
- [ ] Linkからのアクセス (モーダル)
- [ ] ブラウザ戻るボタンでモーダル閉じる
- [ ] フォーム入力途中でリロード → 内容復元
- [ ] フォーム送信成功 → sessionStorageクリア

### 品質確認
- [ ] TypeScript型エラーなし
- [ ] レスポンシブ対応
- [ ] アクセシビリティ
- [ ] パフォーマンス
- [ ] SEO対応

---

## 実装開始準備

1. **現在のコンタクトフォーム機能の動作確認**
2. **実装予定の機能要件の最終確認**
3. **開発環境の準備**
4. **Phase 1から段階的実装開始**

実装は5ファイル以内の小さな単位で確実に進め、各段階で動作確認を行う。

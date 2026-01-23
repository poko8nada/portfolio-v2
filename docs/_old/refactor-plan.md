# isNew/isUpdated 判定のリファクタリング計画

## 現状の問題点

現在、`isNew`と`isUpdated`の判定は`addNewUpdateFlags`関数で行われ、各ページで実行されている。これにより：

1. **責務の分散**: 判定ロジックがライブラリ層に存在し、表示側での制御が困難
2. **重複処理**: 各ページで同じ判定が実行される
3. **テスタビリティの低下**: コンポーネント単体でのテストが困難

## 目標

`isNew`と`isUpdated`の判定をコンポーネント側で行い、以下を実現する：

1. **単一責任の原則**: 表示ロジックをコンポーネントに集約
2. **再利用可能性**: 汎用的な判定ロジックとして分離
3. **テストしやすさ**: コンポーネント単体でのテスト可能

## 影響範囲

### 修正対象ファイル

1. **`src/lib/post.ts`**
   - `addNewUpdateFlags`関数の削除
   - `isNew`、`isUpdated`プロパティの型定義から削除
   - 関数呼び出し箇所の削除

2. **`src/components/postsCard.tsx`**
   - 判定ロジックの追加
   - プロパティの型更新

3. **ページコンポーネント群**
   - `src/app/(small_header)/posts/page.tsx`
   - `src/app/(small_header)/posts/[slug]/page.tsx`
   - `src/feature/display-home-posts/index.tsx`

### 新規作成ファイル

4. **`src/lib/date-utils.ts`**
   - 日付判定のユーティリティ関数

## 実装手順

### Phase 1: ユーティリティ関数の作成
1. `src/lib/date-utils.ts`を作成
2. `isNew`と`isUpdated`判定のための関数を実装

### Phase 2: postsCardコンポーネントの修正
1. `postsCard.tsx`のprops型定義から`isNew`、`isUpdated`を削除
2. コンポーネント内で判定ロジックを実装
3. 日付情報のpropsを追加

### Phase 3: ライブラリ層の修正
1. `post.ts`から`addNewUpdateFlags`関数を削除
2. 型定義から`isNew`、`isUpdated`を削除
3. 関数の呼び出し箇所を削除

### Phase 4: 各ページコンポーネントの修正
1. `isNew`、`isUpdated`プロパティの受け渡しを削除
2. 日付情報のpropsに変更

### Phase 5: テストと検証
1. 各ページでラベル表示が正常に動作することを確認
2. 日付の境界値テストを実施

## 詳細設計

### 新しいユーティリティ関数

```typescript
// src/lib/date-utils.ts
export function isNewPost(createdAt: string): boolean {
  const today = new Date()
  const twoWeeksAgo = new Date(today)
  twoWeeksAgo.setDate(today.getDate() - 14)
  return new Date(createdAt) > twoWeeksAgo
}

export function isUpdatedPost(createdAt: string, updatedAt: string): boolean {
  const today = new Date()
  const twoWeeksAgo = new Date(today)
  twoWeeksAgo.setDate(today.getDate() - 14)
  return new Date(updatedAt) > twoWeeksAgo && !isNewPost(createdAt)
}
```

### 修正後のpostsCard

```typescript
// src/components/postsCard.tsx
export default ({
  slug,
  formattedData,
  index,
  isHome,
}: {
  slug: string
  formattedData: {
    title: string
    createdAt: string
    updatedAt: string
    thumbnail: string
  }
  index: number
  isHome?: boolean
}) => {
  const { title, createdAt, updatedAt, thumbnail } = formattedData
  const isNew = isNewPost(createdAt)
  const isUpdated = isUpdatedPost(createdAt, updatedAt)
  
  // 以下既存処理...
}
```

## 注意点

1. **日付形式の一貫性**: 現在の`YYYY-MM-DD`形式を維持
2. **境界値の扱い**: 現在の2週間判定ロジックを維持
3. **パフォーマンス**: 各コンポーネントでの判定による計算コスト（軽微）

## 完了条件

- [x] 全ての関連ファイルが修正されている
- [x] ビルドエラーが発生しない
- [x] 各ページでラベル表示が正常に動作する
- [x] 日付の境界値テストがパスする

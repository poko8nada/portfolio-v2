# Navigation Refactoring Plan v2

## 概要
ナビゲーションのUXを改善し、常時アイコン表示とアクティブ状態の実装を行う。

## 現在の問題点
- 現在のページのナビゲーションアイテムが非表示になっている
- デスクトップでは文字のみ、モバイルではアイコンのみの表示
- ユーザーが現在どのページにいるかが分かりにくい

## 新しい要件

### 表示ルール
1. **モバイル（md未満）**: アイコンのみ表示
2. **デスクトップ（md以上）**: アイコン + 文字を縦配置（文字は小さく）
3. **全デバイス**: 現在のページも常時表示
4. **アクティブ状態**: 現在のページのアイコンは反転表示

### デザイン仕様
- アイコンサイズ: モバイル 20px（w-5 h-5）、デスクトップ 28px（w-7 h-7）
- 文字サイズ: 12px（text-xs）
- アクティブ状態: 白色（text-white）+ 塗りつぶし版アイコン
- 非アクティブ状態: 通常の色（text-fg）+ アウトライン版アイコン
- ホバー状態: text-pr + アウトライン版アイコン

## 実装タスク

### Task 1: Navigation Configuration の更新
**ファイル**: `src/lib/navigation.ts`

1. `getNavItemsForPage` 関数を削除または修正
2. 現在のページを除外する処理を削除
3. 現在のページを判定するためのユーティリティ関数を追加

```typescript
// 現在のページかどうかを判定する関数
export function isCurrentPage(href: string, currentPath: string): boolean {
  if (href === '/' && currentPath === '/') return true
  if (href !== '/' && currentPath.startsWith(href)) return true
  if (href.startsWith('#') && currentPath === '/') return true
  return false
}
```

### Task 2: Header Component の更新
**ファイル**: `src/components/header.tsx`

1. `getNavItemsForPage` の使用を停止し、全アイテムを表示
2. アクティブ状態の判定ロジックを追加
3. デスクトップでの縦配置レイアウトを実装
4. アクティブ状態のスタイリングを追加

**実装要素**:
- 現在のページ判定
- アクティブ状態のスタイリング
- デスクトップでの縦配置（アイコン + 文字）
- モバイルでのアイコンのみ表示

### Task 3: Navigation Item Component の作成
**ファイル**: `src/components/ui/nav-item.tsx`

ナビゲーションアイテムのロジックを抽象化し、再利用可能なコンポーネントを作成

```typescript
interface NavItemProps {
  item: NavItem
  isActive: boolean
  isMobile: boolean
  onClick?: () => void
}
```

### Task 4: Active State Styling の実装
**ファイル**: `src/components/ui/navbar-menu.tsx`

アクティブ状態のスタイリングを追加

```typescript
// アクティブ状態のスタイル
const activeStyles = "bg-pr text-bg rounded-full p-2"
const inactiveStyles = "text-fg hover:text-pr"
```

## 詳細実装仕様

### デスクトップレイアウト（md以上）
```jsx
<div className="flex flex-col items-center space-y-0.5">
  <div className={iconStyles}>
    <NavIcon iconName={item.icon} filled={isActive} />
  </div>
  <span className={labelStyles}>{item.label}</span>
</div>
```

### モバイルレイアウト（md未満）
```jsx
<div className={iconStyles}>
  <NavIcon iconName={item.icon} filled={isActive} />
</div>
```

### アクティブ状態のスタイル
```jsx
const iconStyles = isActive
  ? "text-white p-2"
  : "text-fg group-hover:text-pr p-2"
const labelStyles = isActive
  ? "text-xs text-white font-semibold"
  : "text-xs text-fg group-hover:text-pr"
```

## 技術的考慮事項

1. **レスポンシブデザイン**: Tailwind CSSのブレークポイントを使用
2. **アクセシビリティ**: aria-current="page" を現在のページに付与
3. **パフォーマンス**: usePathname の使用を最適化
4. **型安全性**: TypeScript での型定義を維持

## 影響範囲

### 修正ファイル
- `src/lib/navigation.ts`
- `src/components/header.tsx`
- `src/components/ui/navbar-menu.tsx`
- `src/components/ui/nav-icons.tsx`
- `src/app/about/page.tsx`
- `src/components/ui/dialog.tsx`

### 新規ファイル
- `src/components/ui/nav-item.tsx`

### 削除されたパッケージ
- `lucide-react` → `@heroicons/react`に置き換え

## テスト項目

1. **デスクトップ表示**
   - アイコン + 文字が縦配置で表示される
   - 現在のページのアイコンがアクティブ状態で表示される
   - 文字サイズが適切（text-xs）

2. **モバイル表示**
   - アイコンのみが表示される
   - 現在のページのアイコンがアクティブ状態で表示される

3. **ナビゲーション動作**
   - 全てのページでナビゲーションが正常に動作する
   - アンカーリンクが正常に動作する
   - 確認ダイアログが必要な場合は表示される

4. **アクティブ状態**
   - ホームページで適切なアイテムがアクティブ
   - 各ページで適切なアイテムがアクティブ
   - アンカーリンクでもアクティブ状態が正しく動作

## 完了基準

- [x] 全デバイスでアイコンが常時表示される
- [x] デスクトップでアイコン + 文字が縦配置で表示される
- [x] 現在のページのアイコンがアクティブ状態で表示される
- [x] レスポンシブデザインが正常に動作する
- [x] 既存の機能（アンカーリンク、確認ダイアログ）が正常に動作する
- [x] TypeScriptエラーがない
- [x] アクセシビリティが適切に実装されている
- [x] Heroiconsによる塗りつぶし/アウトライン切り替えが実装されている

## 注意事項

- 既存のUIテーマとの一貫性を保つ
- アニメーションやトランジションは既存のものを踏襲
- 5ファイル制限内での実装を心がける
- 段階的なテストを実施する

## 実装完了報告

### 2025年1月 - 実装完了
- ✅ Task 1: Navigation Configuration の更新 - 完了
- ✅ Task 2: Header Component の更新 - 完了
- ✅ Task 3: Navigation Item Component の作成 - 完了
- ✅ Task 4: Active State Styling の実装 - 完了
- ✅ アイコンライブラリをLucideからHeroiconsに移行 - 完了
- ✅ 全ての要件を満たす実装 - 完了

### 主な変更点
1. **アイコンライブラリ変更**: LucideからHeroiconsに移行（outline/solid対応）
2. **アクティブ状態**: 白色 + 塗りつぶし版アイコンに変更
3. **レスポンシブ対応**: アイコンサイズをモバイル/デスクトップで調整
4. **コード整理**: 重複コードを削除し、NavItemコンポーネントで統一

# ヘッダーリファクタリング実行計画

## 🎯 目標
Aceternity UI の navbar-menu を参考に、現在のシンプルなヘッダーから、フローティングナビゲーション付きヘッダーにリファクタリング

## 📋 参考サイト分析 (Aceternity UI)
### 確認された要素
- フローティング・スティッキーデザイン
- 統合レイアウト（プロフィール情報もナビ内）
- シンプルクリック動作（ドロップダウン不要）
- バックドロップブラー効果
- 丸型デザイン

## 🔍 現状分析
### 現在の問題点
- 非フローティングデザイン: 通常のヘッダー配置
- 分離したレイアウト: プロフィール情報とナビが別々
- ドロップダウン仕様: ホバーでメニュー展開（不要）

### 修正後の構造
```
app/
├── (home_layout)/         # トップページ専用（アンカーリンク）
│   ├── layout.tsx        # MainHeader を使用
│   └── page.tsx          # トップページ
└── (pages_layout)/        # 各詳細ページ（ページリンク）
    ├── layout.tsx         # PageHeader を使用
    ├── posts/
    ├── about/            # 新規作成予定
    └── resume/
```

## 🎨 新しいヘッダー設計

### 1. フローティングナビ構造
```
[プロフィール画像] [サイト名] [Home] [Posts] [About] [Resume]
```

### 2. デザイン仕様
- **配置**: `fixed top-4 left-1/2 transform -translate-x-1/2 z-50`
- **背景**: `bg-[--color-bg-2]/90 backdrop-blur-md`
- **境界線**: `border border-[--color-pr]/20`
- **形状**: `rounded-full`
- **影**: `shadow-lg`
- **アニメーション**: 初期表示時にスライドイン

### 3. メニュー項目
**トップページ (/) の場合：**
- **Home** - ページトップへのアンカーリンク (#top)
- **Posts** - 投稿セクションへのアンカーリンク (#posts)
- **About** - プロフィールセクションへのアンカーリンク (#about)
- **Resume** - レジュメページへの直リンク (/resume)

**その他ページの場合：**
- **Home** - トップページへ (/)
- **Posts** - ブログ一覧へ (/posts)  
- **About** - 将来のAboutページへ (/about)
- **Resume** - レジュメページへ (/resume)

### 4. ナビゲーション動作
- ドロップダウンメニューなし
- 直接クリック動作のみ
- ホバー時のスケールアニメーション
- アンカーリンクはスムーススクロール対応

### 5. レスポンシブ対応
- デスクトップ: プロフィール画像 + サイト名 + フルテキストメニュー
- タブレット: プロフィール画像 + サイト名 + フルテキストメニュー  
- スマホ: プロフィール画像 + アイコンのみ表示

## 🛠️ 実装手順

### Phase 0: ディレクトリ構造変更
**⚠️ 重要: この作業はターミナルで行ってください**

```bash
# プロジェクトルートで実行
cd src/app

# ディレクトリ名変更
mv "(header)" "(home_layout)"
mv "(small_header)" "(pages_layout)"

# 変更確認
ls -la
```

**期待される結果:**
```
src/app/
├── (home_layout)/
│   ├── layout.tsx
│   └── page.tsx
├── (pages_layout)/
│   ├── layout.tsx
│   ├── posts/
│   └── resume/
```

**動作確認:** `pnpm run dev` でサイトが正常に表示されることを確認

### Phase 1: navbar-menu.tsx の修正

#### 1-1. MenuItem コンポーネントの簡素化
**編集:** `/src/components/ui/navbar-menu.tsx`

```tsx
'use client'
import type React from 'react'
import { motion } from 'motion/react'

export const MenuItem = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className='cursor-pointer'
    >
      {children}
    </motion.div>
  )
}

export const Menu = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className='fixed top-4 left-1/2 transform -translate-x-1/2 z-50 
                 bg-[--color-bg-2]/90 backdrop-blur-md border border-[--color-pr]/20 
                 rounded-full px-6 py-3 shadow-lg'
    >
      <div className='flex items-center space-x-6'>
        {children}
      </div>
    </motion.nav>
  )
}

export const HoveredLink = ({ 
  children, 
  ...rest 
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: React.ReactNode
}) => {
  return (
    <a
      {...rest}
      className='text-fg hover:text-pr transition-colors duration-200'
    >
      {children}
    </a>
  )
}
```

#### 1-2. メニューデータ定義ファイル作成
**新規作成:** `/src/lib/navigation.ts`

```typescript
// ファイル内容の例
export interface NavItem {
  label: string
  href: string
  isAnchor?: boolean
  icon?: string // モバイル用アイコン
}

export const homeLayoutNavItems: NavItem[] = [
  { label: 'Home', href: '#top', isAnchor: true, icon: 'Home' },
  { label: 'Posts', href: '#posts', isAnchor: true, icon: 'FileText' },
  { label: 'About', href: '#about', isAnchor: true, icon: 'User' },
  { label: 'Resume', href: '/resume', isAnchor: false, icon: 'FileUser' }
]

export const pagesLayoutNavItems: NavItem[] = [
  { label: 'Home', href: '/', isAnchor: false, icon: 'Home' },
  { label: 'Posts', href: '/posts', isAnchor: false, icon: 'FileText' },
  { label: 'About', href: '/about', isAnchor: false, icon: 'User' },
  { label: 'Resume', href: '/resume', isAnchor: false, icon: 'FileUser' }
]
```

#### 1-3. アイコンコンポーネント準備
**パッケージインストール:**
```bash
pnpm add lucide-react
```

**新規作成:** `/src/components/ui/nav-icons.tsx`

```tsx
import { Home, FileText, User, FileUser } from 'lucide-react'

export const iconMap = {
  Home,
  FileText, 
  User,
  FileUser
} as const

export type IconName = keyof typeof iconMap

interface NavIconProps {
  name: IconName
  className?: string
}

export const NavIcon = ({ name, className = "w-5 h-5" }: NavIconProps) => {
  const Icon = iconMap[name]
  return <Icon className={className} />
}
```

### Phase 2: ヘッダーコンポーネント作成

#### 2-1. 既存header.tsxのバックアップ
```bash
cd src/components
cp header.tsx header.tsx.backup
```

#### 2-2. MainHeader作成（home_layout用）
**新規作成:** `/src/components/main-header.tsx`

```tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, MenuItem, HoveredLink } from '@/components/ui/navbar-menu'
import { NavIcon } from '@/components/ui/nav-icons'
import { homeLayoutNavItems } from '@/lib/navigation'

export default function MainHeader() {
  const handleAnchorClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      element?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <Menu>
      {/* プロフィール部分 */}
      <div className="flex items-center space-x-3">
        <Image
          src="/images/profile01.png"
          width={32}
          height={32}
          alt=""
          className="rounded-full"
        />
        <span className="text-fg font-medium hidden sm:block">
          PokoHanadaCom
        </span>
      </div>

      {/* デスクトップナビゲーション */}
      <div className="hidden md:flex items-center space-x-6">
        {homeLayoutNavItems.map((item) => (
          <MenuItem key={item.label}>
            {item.isAnchor ? (
              <HoveredLink
                onClick={() => handleAnchorClick(item.href)}
                className="cursor-pointer"
              >
                {item.label}
              </HoveredLink>
            ) : (
              <Link href={item.href}>
                <HoveredLink>
                  {item.label}
                </HoveredLink>
              </Link>
            )}
          </MenuItem>
        ))}
      </div>

      {/* モバイルナビゲーション */}
      <div className="md:hidden flex items-center space-x-4">
        {homeLayoutNavItems.map((item) => (
          <MenuItem key={item.label}>
            {item.isAnchor ? (
              <button
                onClick={() => handleAnchorClick(item.href)}
                className="text-fg hover:text-pr"
              >
                <NavIcon name={item.icon as any} />
              </button>
            ) : (
              <Link href={item.href} className="text-fg hover:text-pr">
                <NavIcon name={item.icon as any} />
              </Link>
            )}
          </MenuItem>
        ))}
      </div>
    </Menu>
  )
}
```

#### 2-3. PageHeader作成（pages_layout用）
**新規作成:** `/src/components/page-header.tsx`

```tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, MenuItem, HoveredLink } from '@/components/ui/navbar-menu'
import { NavIcon } from '@/components/ui/nav-icons'
import { pagesLayoutNavItems } from '@/lib/navigation'

export default function PageHeader() {
  return (
    <Menu>
      {/* プロフィール部分 */}
      <div className="flex items-center space-x-3">
        <Image
          src="/images/profile01.png"
          width={32}
          height={32}
          alt=""
          className="rounded-full"
        />
        <span className="text-fg font-medium hidden sm:block">
          PokoHanadaCom
        </span>
      </div>

      {/* デスクトップナビゲーション */}
      <div className="hidden md:flex items-center space-x-6">
        {pagesLayoutNavItems.map((item) => (
          <MenuItem key={item.label}>
            <Link href={item.href}>
              <HoveredLink>
                {item.label}
              </HoveredLink>
            </Link>
          </MenuItem>
        ))}
      </div>

      {/* モバイルナビゲーション */}
      <div className="md:hidden flex items-center space-x-4">
        {pagesLayoutNavItems.map((item) => (
          <MenuItem key={item.label}>
            <Link href={item.href} className="text-fg hover:text-pr">
              <NavIcon name={item.icon as any} />
            </Link>
          </MenuItem>
        ))}
      </div>
    </Menu>
  )
}
```

### Phase 3: レイアウトファイル更新

#### 3-1. home_layout用layout.tsx更新
**編集:** `/src/app/(home_layout)/layout.tsx`

```tsx
import MainHeader from '@/components/main-header'
import Main from '@/components/main'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainHeader />
      <div className="pt-20"> {/* フローティングヘッダー分の余白 */}
        <Main>{children}</Main>
      </div>
    </>
  )
}
```

#### 3-2. pages_layout用layout.tsx更新
**編集:** `/src/app/(pages_layout)/layout.tsx`

```tsx
import PageHeader from '@/components/page-header'
import Main from '@/components/main'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHeader />
      <div className="pt-20"> {/* フローティングヘッダー分の余白 */}
        <Main>{children}</Main>
      </div>
    </>
  )
}
```

### Phase 4: トップページのセクションID設定

#### 4-1. トップページ構造確認
**確認ファイル:** `/src/app/(home_layout)/page.tsx`
**必要作業:** 各セクションにアンカーリンク用のIDを追加

```tsx
// 例: セクションにIDを追加
<section id="top">
  {/* ヘッダー直下のメインビュー */}
</section>

<section id="posts">
  {/* ブログ投稿一覧セクション */}
</section>

<section id="about">
  {/* プロフィール・About情報セクション */}
</section>
```

#### 4-2. スムーススクロール動作確認
**テスト項目:**
1. トップページでナビゲーションクリック
2. 各セクションへのスムーススクロール動作
3. URLにハッシュが追加されないことの確認

### Phase 5: スタイリング詳細

#### 5-1. カスタムCSS変数使用例
```css
/* 使用可能な変数（global.cssで定義済み） */
--color-bg: #22232f;      /* メイン背景色 */
--color-bg-2: #323343;    /* セカンダリ背景色 */
--color-fg: #e1e1e1;      /* メインテキスト色 */
--color-fg-2: #959595;    /* セカンダリテキスト色 */
--color-pr: #4199ff;      /* プライマリカラー（ブルー） */
```

#### 5-2. TailwindCSS クラス使用例
```tsx
// 背景色
className="bg-[--color-bg]"

// テキスト色
className="text-fg"

// ボーダー
className="border-[--color-bg-2]"

// ホバー時のプライマリカラー
className="hover:text-pr"
```

#### 5-3. レスポンシブ対応詳細
```tsx
{/* デスクトップ: フルテキスト表示 */}
<div className="hidden md:block">
  <Menu setActive={setActive}>
    {/* メニュー項目 */}
  </Menu>
</div>

{/* モバイル: アイコンのみ表示 */}
<div className="md:hidden flex space-x-4">
  {navItems.map((item) => (
    <div key={item.label} className="text-fg">
      <NavIcon name={item.icon} />
    </div>
  ))}
</div>
```

### Phase 6: テスト・動作確認

#### 6-1. 必須テスト項目
**トップページ (home_layout):**
- [ ] ヘッダーが正しく表示される
- [ ] アンカーリンクでスムーススクロールする
- [ ] Resume ボタンは /resume にページ遷移する
- [ ] モバイルでアイコンが表示される

**詳細ページ (pages_layout):**
- [ ] ヘッダーが正しく表示される
- [ ] 各メニューで適切なページに遷移する
- [ ] /posts, /resume ページで動作確認
- [ ] モバイルでアイコンが表示される

#### 6-2. エラー対応
**よくあるエラーと対処法:**

1. **Motion/React エラー**
   ```bash
   pnpm add motion@latest
   ```

2. **Lucide React エラー**
   ```bash
   pnpm add lucide-react
   ```

3. **CSS変数が効かない場合**
   - `globals.css` が正しく読み込まれているか確認
   - ブラウザの開発者ツールで変数値を確認

3. **スムーススクロールが動かない場合**
   - セクションのIDが正しく設定されているか確認
   - `document.querySelector(href)` で要素が取得できるか確認

#### 6-3. 最終確認チェックリスト
- [ ] すべてのページでヘッダーが正常表示
- [ ] トップページでアンカーリンクが動作
- [ ] 詳細ページでページリンクが動作
- [ ] レスポンシブデザインが正常
- [ ] コンソールエラーがない
- [ ] TypeScript エラーがない

## 📝 技術仕様

### 使用ライブラリ
- **Motion/React** - アニメーション（バージョン最新）
- **Lucide React** - アイコン（SVGアイコンライブラリ）
- **TailwindCSS** - スタイリング（カスタムCSS変数使用）
- **Next.js Link** - ルーティング
- **TypeScript** - 型安全性

### 新規作成ファイル一覧
```
src/
├── lib/
│   └── navigation.ts          # ナビゲーションデータ定義
├── components/
│   ├── main-header.tsx        # トップページ用ヘッダー
│   ├── page-header.tsx        # 詳細ページ用ヘッダー
│   └── ui/
│       └── nav-icons.tsx      # アイコンコンポーネント
```

### 編集対象ファイル一覧
```
src/app/
├── (home_layout)/layout.tsx   # MainHeader を使用
├── (pages_layout)/layout.tsx  # PageHeader を使用
└── (home_layout)/page.tsx     # セクションID追加
```

### 必要な型定義
```typescript
// /src/lib/navigation.ts で定義
interface NavItem {
  label: string           // メニュー表示名
  href: string           // リンク先（アンカーまたはページ）
  isAnchor?: boolean     // アンカーリンクかどうか
  icon?: string          // Lucide React アイコン名
}

// /src/components/ui/nav-icons.tsx で定義
type IconName = 'Home' | 'FileText' | 'User' | 'FileUser'
```

### コンポーネント構成
```
MainHeader (home_layout用) - フローティングナビ
├── プロフィール画像 + サイト名
├── AnchorNavigationMenu
│   ├── MenuItem (Home) - #top + スケールアニメーション
│   ├── MenuItem (Posts) - #posts + スケールアニメーション
│   ├── MenuItem (About) - #about + スケールアニメーション
│   └── MenuItem (Resume) - /resume + スケールアニメーション
└── ResponsiveMenuItems (モバイル: アイコンのみ)

PageHeader (pages_layout用) - フローティングナビ
├── プロフィール画像 + サイト名
├── PageNavigationMenu
│   ├── MenuItem (Home) - / + スケールアニメーション
│   ├── MenuItem (Posts) - /posts + スケールアニメーション
│   ├── MenuItem (About) - /about + スケールアニメーション
│   └── MenuItem (Resume) - /resume + スケールアニメーション
└── ResponsiveMenuItems (モバイル: アイコンのみ)
```

### 追加実装要件
- フローティング・スティッキーデザイン
- バックドロップブラー効果
- 初期表示アニメーション（上からスライドイン）
- ホバー時のスケールアニメーション
- スムーススクロール機能（アンカーリンク用）
- アイコンセット（スマホ表示用）
- カスタムカラー変数の活用

## ⚠️ 注意事項・重要なポイント

### 実装時の注意点
1. **ディレクトリ構造変更は慎重に**
   - 必ずバックアップを取ってから実行
   - ターミナルで `mv` コマンドを使用
   - 変更後は即座に動作確認

2. **CSS変数の正しい使用**
   ```tsx
   // ✅ 正しい書き方
   className="bg-[--color-bg] text-fg"
   
   // ❌ 間違った書き方
   className="bg-color-bg text-color-fg"
   ```

3. **アンカーリンクの実装**
   - `document.querySelector()` は クライアントサイドのみ
   - `'use client'` ディレクティブを忘れずに追加
   - セクションIDは英数字とハイフンのみ使用

4. **Motion/React の使用**
   - 既存の `navbar-menu.tsx` のパターンに従う
   - `transition` オブジェクトは既存のものを再利用
   - アニメーションは控えめに

5. **TypeScript エラー対応**
   - すべての props に型定義を追加
   - `children` の型は `React.ReactNode` を使用
   - イベントハンドラーの型は適切に指定

### デバッグのポイント
1. **スムーススクロールが動かない場合**
   ```tsx
   // デバッグ用コード例
   const handleAnchorClick = (href: string) => {
     console.log('Anchor clicked:', href)
     const element = document.querySelector(href)
     console.log('Element found:', element)
     if (element) {
       element.scrollIntoView({ behavior: 'smooth' })
     }
   }
   ```

2. **CSS変数が効かない場合**
   - ブラウザ開発者ツールで `:root` の変数定義を確認
   - `getComputedStyle()` で変数値を確認

3. **レスポンシブが正しく表示されない場合**
   - `md:` ブレイクポイントは 768px 以上
   - `hidden md:block` と `md:hidden` の組み合わせを確認

### パフォーマンス考慮事項
- アンカーリンクのスムーススクロールは `behavior: 'smooth'` を使用
- Motion/React のアニメーションは必要最小限に
- 画像（プロフィール画像）は Next.js Image コンポーネントを使用
- カスタムCSS変数を活用してバンドルサイズを削減

## 🔄 段階的実装
まずは基本的なナビゲーションから開始し、段階的に機能を追加する方針とする

---

## ✅ 要件確定事項
1. **メニュー項目**: Home, Posts, About, Resume の4つ ✅
2. **ディレクトリ構造**: `(home_layout)` と `(pages_layout)` に変更 ✅
3. **ヘッダー分離**: MainHeader（アンカー）+ PageHeader（リンク） ✅
4. **フローティングデザイン**: スティッキー・フローティングナビ ✅
5. **統合レイアウト**: プロフィール情報もナビ内に配置 ✅
6. **シンプルクリック**: ドロップダウン不要、直接動作 ✅
7. **About ページ**: 将来 `(pages_layout)/about/` に作成予定 ✅  
8. **モバイル対応**: ハンバーガー不要、アイコン表示 ✅
9. **カラーテーマ**: カスタムカラー使用 ✅

## 🎯 実装の明確化
- **フローティングナビ**: 画面上部に固定されたナビゲーション
- **統合デザイン**: プロフィール情報もナビゲーション内に含める
- **直接動作**: メニュークリックで即座にアクション実行
- **トップページ**: アンカーリンクでセクション間移動
- **詳細ページ**: 各ページへの直リンク遷移

## 🚀 実装開始手順

### ステップ 1: 事前準備
```bash
# 1. プロジェクトを最新状態に
git status
git add .
git commit -m "作業開始前のバックアップ"

# 2. 必要なパッケージをインストール
pnpm add lucide-react

# 3. 開発サーバー起動
pnpm run dev

# 4. ブラウザで正常動作を確認
# http://localhost:3000
```

### ステップ 2: Phase 0 実行
```bash
# ディレクトリ名変更
cd src/app
mv "(header)" "(home_layout)"
mv "(small_header)" "(pages_layout)"

# 動作確認（重要！）
cd ../../
pnpm run dev
```

### ステップ 3: 段階的実装
1. **Phase 1完了後**: 必ず動作確認
2. **Phase 2完了後**: 必ず動作確認  
3. **エラーが出た場合**: 一つ前の段階に戻って原因究明

### ステップ 4: 最終確認
```bash
# TypeScript エラーチェック
npx tsc --noEmit

# ビルドテスト
pnpm run build

# 全ページでヘッダーが正常表示されることを確認
```

---

## 📚 参考情報

### Motion/React 公式ドキュメント
- https://motion.dev/
- 既存の `navbar-menu.tsx` の実装パターンを参考にする

### TailwindCSS カスタムプロパティ
- https://tailwindcss.com/docs/customizing-colors#using-css-variables
- CSS変数の使い方: `bg-[--color-bg]`

### Next.js App Router
- https://nextjs.org/docs/app/building-your-application/routing/route-groups
- ルートグループ `()` の使い方

---

## 🎯 成功の定義

### 最低要件（Must Have）
- [ ] トップページでアンカーリンクが動作
- [ ] 詳細ページでページリンクが動作
- [ ] モバイルでアイコン表示
- [ ] TypeScript エラーなし
- [ ] 既存機能の動作維持

### 理想的な完成形（Nice to Have）
- [ ] スムーズなアニメーション効果
- [ ] 美しいホバーエフェクト
- [ ] 完璧なレスポンシブデザイン
- [ ] アクセシビリティ対応

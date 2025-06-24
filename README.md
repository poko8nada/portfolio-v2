# Portfolio Site v2

PokoHanadaのポートフォリオサイト - Next.js 15 + Cloudflare Workers構成

## 概要

手を動かすwebディレクターのポートフォリオサイトです。技術ブログとプロフィール、スキル情報を掲載しています。

## 技術構成

- **Framework**: Next.js 15 (App Router)
- **Styling**: TailwindCSS 4
- **Deployment**: Cloudflare Workers
- **Runtime**: @opennextjs/cloudflare
- **Content**: Markdown (Static Assets)
- **Authentication**: Basic認証 (Resume部のみ)

## 主な機能

- **ホームページ**: プロフィール、最新投稿、ツール紹介
- **ブログシステム**: Markdown形式の投稿管理
- **レジュメページ**: Basic認証付きプライベートページ
- **レスポンシブデザイン**: モバイル・デスクトップ対応

## 開発環境

```bash
# 依存関係のインストール
pnpm install

# 投稿インデックス生成
pnpm run generate-posts-index

# 開発サーバー起動
pnpm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認してください。

## デプロイメント

### プレビュー
```bash
pnpm run preview
```

### 本番環境デプロイ
```bash
pnpm run deploy
```

## 環境変数

Basic認証用の環境変数を設定してください：

```bash
# Cloudflare Workers Secrets
wrangler secret put BASIC_AUTH_USERNAME
wrangler secret put BASIC_AUTH_PASSWORD
```

## プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── (header)/          # ヘッダー付きレイアウト
│   └── (small_header)/    # 簡易ヘッダーレイアウト
├── components/            # 再利用可能コンポーネント
├── feature/               # 機能別コンポーネント
├── lib/                   # ユーティリティ関数
└── types/                 # TypeScript型定義

public/posts/              # ブログ投稿（Markdown）
scripts/                   # ビルドスクリプト
```

## コンテンツ管理

- **投稿追加**: `public/posts/` にMarkdownファイルを追加
- **インデックス更新**: `pnpm run generate-posts-index`
- **投稿公開制御**: frontmatterの `isPublished` フィールドで管理

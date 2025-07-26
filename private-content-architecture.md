# 非公開コンテンツ共有用構成メモ

## はじめに

このドキュメントは、ポートフォリオサイトで関係者向けに非公開コンテンツ（レジュメなど）を安全に共有するための**理想的なアーキテクチャ**を記述したものです。現状の実装とは一部異なる点があり、今後の改修タスクも兼ねています。

## 背景と目的

- 一部の関係者にだけMarkdown形式の資料と画像を共有したい。
- 現状はローカルにGit管理下のmdと画像を置き、ビルド時にバンドルしてBasic認証ページで公開している。
- コンテンツの更新のたびにデプロイが必要であり、コンテンツとコードの分離ができていない。
- 画像の直リンクや保存もできれば防ぎたい。

## 現状の構成 (2025/07/26時点)

- **対象ページ**: `/resume`
- **認証**: Next.js Middleware (`src/middleware.ts`) によるBasic認証。
- **コンテンツ**: ローカルのMarkdownファイル (`src/content/resume/**/*.md`) を、ビルドスクリプト (`scripts/prepare-resume.js`) を使って結合・処理し、アプリケーションにバンドル。
- **画像**: ローカルの画像ファイル (`src/content/resume/images/*`) を直接参照。`draggable="false"` のみ実装済み。

## 理想の構成案

### 保存先

- Markdown・画像は Cloudflare R2 に保存
- R2バケットは public にせず、アクセス制御を Workers 経由で行う
- アップロードは Wrangler CLI または R2 ダッシュボードから行う

### 公開方法

- Git にはテンプレートコードのみ含め、R2のコンテンツは含めない
- Next.js (OpenNext) + Cloudflare Workers で秘匿ページを動的生成
- Basic認証によってページ全体を保護

### 画像表示の扱い

- R2の画像には直接アクセスできないようにする（privateバケット）
- Next.js 経由で `/api/proxy-image?path=...` などのプロキシAPIを実装
- プロキシAPI側で Referer チェックや認証情報により、外部からの直接アクセスを制限
- `<img>` タグには以下のダウンロード抑止策を実装
  - `draggable="false"`
  - `onContextMenu={e => e.preventDefault()}`

---

## R2移行に向けた実装タスク

現状の構成から理想の構成へ移行するための具体的なタスクです。

### 1. R2バケットの準備と設定
- [ ] `wrangler r2 bucket create <BUCKET_NAME>` でプライベートなR2バケットを作成する。
- [ ] `wrangler.jsonc` (または `wrangler.toml`) にR2バケットのバインディング設定を追加する。
  ```json
  "r2_buckets": [
    {
      "binding": "PORTFOLIO_ASSETS",
      "bucket_name": "<BUCKET_NAME>"
    }
  ]
  ```

### 2. コンテンツ取得APIの実装
- [ ] `/app/api/resume/[slug]/route.ts` のようなAPI Routeを作成する。
- [ ] API内でR2バケットから `[slug]` に対応するMarkdownファイルを取得し、その内容を返すロジックを実装する。
- [ ] このAPI RouteがBasic認証ミドルウェアの対象に含まれていることを確認する。

### 3. 画像プロキシAPIの実装
- [ ] `/app/api/proxy-image/route.ts` を作成する。
- [ ] `path` クエリパラメータで指定された画像ファイルをR2から取得し、`Response` オブジェクトとして返すロジックを実装する。
- [ ] （任意）Refererヘッダをチェックし、自サイトからのリクエストでなければアクセスを拒否する。

### 4. フロントエンドのリファクタリング
- [ ] `src/app/resume/page.tsx` と `src/lib/resume.ts` を修正する。
- [ ] ローカルのMarkdownファイルをimportする代わりに、`fetch` を使って `/api/resume/[slug]` から動的にコンテンツを取得するよう変更する。
- [ ] `<img>` タグの `src` 属性を、画像プロキシAPI (`/api/proxy-image?path=<画像パス>`) を指すように書き換える。
- [ ] `<img>` タグに `onContextMenu={e => e.preventDefault()}` を追加し、右クリックメニューを無効化する。

### 5. コンテンツのR2への移行
- [ ] 現在 `src/content/resume/` 以下にあるMarkdownファイルと画像を、作成したR2バケットにアップロードする。
- [ ] アップロード手順（`wrangler r2 object put` コマンドなど）を確立し、ドキュメント化する。

### 6. 旧コンテンツの削除とGit管理からの除外
- [ ] `src/content/` ディレクトリを削除する。
- [ ] `.gitignore` に `src/content/` を追加し、将来的に誤ってコミットされないようにする。

### 7. デプロイと動作確認
- [ ] 変更をデプロイし、Cloudflare環境で以下の点を確認する。
  - `/resume` ページへのアクセス時にBasic認証が要求されるか。
  - 認証後、R2から取得したコンテンツが正しく表示されるか。
  - 画像がプロキシ経由で表示され、直接保存が困難になっているか。
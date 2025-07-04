# 実装タスク一覧

## フェーズ0: SSG→SSR変更（Static Assets活用） ✅ **完了**

### Task0-1: Static Assets設定 ✅
- [x] `wrangler.jsonc`にassets設定を追加
  - `assets.directory`を`.open-next/assets`に設定
  - `assets.binding`を`ASSETS`に設定
- [x] mdファイルをassets配置用ディレクトリに配布する仕組み作成
  - `.open-next/assets/posts/`にmdファイルをコピーするスクリプト作成

### Task0-2: SSR+Static Assets対応実装 ✅
- [x] `src/lib/post.ts`をStatic Assets対応に書き換え
  - `getAllPostsIndex()`関数：開発環境はNode.js fs、本番環境は`env.ASSETS.fetch()`でindexファイル取得
  - `getPostBySlug()`関数：開発環境はNode.js fs、本番環境は`env.ASSETS.fetch('/posts/xxx.md')` + gray-matterでパース
  - File System API（fs）を完全に削除（本番環境から）
- [x] `scripts/process-markdown.js`を削除（不要になるため）
- [x] `src/data/posts.json`を削除（不要になるため）
- [x] `package.json`の`preprocess`スクリプトを削除
- [x] `dev`スクリプトを`copy-posts`に変更
- [x] 各ページコンポーネントでのStatic Assets対応確認
  - 投稿一覧ページ（`/posts`）: 非同期コンポーネントに変更
  - 投稿詳細ページ（`/posts/[slug]`）: 非同期コンポーネントに変更
  - ホームページ投稿表示部分: 非同期コンポーネントに変更
- [x] 高度な投稿配布スクリプト実装
  - `isPublished: false`の投稿は配布しない
  - `version`ベースの差分更新（変更されたファイルのみ再配布）
  - 投稿一覧用のrich indexファイル生成（title, createdAt, updatedAt, thumbnail含む）
- [x] **構成の大幅変更**: コピー処理廃止→直接管理方式への移行
  - `src/posts/` → `public/posts/` への移行完了
  - `copy-posts-to-assets.js` → `generate-posts-index.js` への変更
  - `public/posts/` を直接管理、コピー処理を完全廃止
- [x] **大規模リファクタリング実施**: `src/lib/post.ts`の徹底的な改善
  - 重複コード約100行を削除
  - 共通ユーティリティ関数の抽出（`validatePostData`, `formatPostMeta`, `processMarkdownContent`）
  - ファイル取得処理の抽象化（`fetchPostContent`, `fetchPostsIndex`）
  - メイン関数の大幅簡素化（5-6行に短縮）
  - 型安全性の向上（`any`型を排除、`PostFrontmatter`型追加）

## フェーズ1: 環境移行準備 ✅ **完了**

### Task1-1: 依存関係の変更 ✅
- [x] `@opennextjs/cloudflare@latest`をインストール
- [x] `wrangler@latest`をdevDependencyとしてインストール
- [x] `@cloudflare/next-on-pages`を削除（不要になるため）

### Task1-2: 設定ファイルの更新 ✅
- [x] `wrangler.jsonc`をWorkers用に書き換え
  - `main: ".open-next/worker.js"`を追加
  - `compatibility_date: "2025-03-25"`以降に更新
  - `compatibility_flags: ["nodejs_compat"]`を追加
  - `assets`セクションを追加（`.open-next/assets`を指定）
- [x] `open-next.config.ts`を新規作成（defineCloudflareConfig）

### Task1-3: package.jsonスクリプト更新 ✅
- [x] 既存のPages用スクリプトを削除
  - `pages:build`
  - 既存の`preview`
  - 既存の`deploy`
- [x] Workers用スクリプトを追加
  - `preview: "opennextjs-cloudflare build && opennextjs-cloudflare preview"`
  - `deploy: "opennextjs-cloudflare build && opennextjs-cloudflare deploy"`
  - `cf-typegen: "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"`

## フェーズ2: Basic認証実装 ✅ **完了**

### Task2-1: middleware.ts作成 ✅
- [x] `src/middleware.ts`を新規作成
- [x] `/resume`パスのみをターゲットとするマッチャー設定
- [x] Basic認証ヘッダーの検証ロジック実装
- [x] 認証失敗時の401レスポンス実装

### Task2-2: 環境変数設定 ✅
- [x] `.env`に認証情報追加

## フェーズ3: Resume機能実装 ✅ **完了**

### Task3-1: ディレクトリ・ファイル構造 ✅
- [x] `resume/`ディレクトリを作成
- [x] `.gitignore`に`resume/`を追加
- [x] `src/app/(small_header)/resume/page.tsx`を作成
- [x] resume用のmdファイルを作成（履歴書・職務経歴書）

### Task3-2: データパース機能 ✅
- [x] `src/lib/resume.ts`を作成（resumeデータ処理用）
- [x] resume mdファイルの読み取り・パース機能実装
- [x] 一部データを他ページ・コンポーネントでも利用可能にする仕組み

### Task3-3: UI実装 ✅
- [x] `/resume`ページのUI実装
- [x] 認証後のみアクセス可能な状態確認
- [x] レスポンシブ対応

## フェーズ4: SEO・セキュリティ対策 ✅ **完了**

### Task4-1: インデックス防止 ✅
- [x] `/resume`ページに`noindex`メタタグ追加
- [x] `X-Robots-Tag`ヘッダーをmiddlewareで追加
- [x] `public/robots.txt`にresume配下のDisallow追記

### Task4-2: セキュリティ強化 ✅
- [x] 強力なパスワード設定
- [x] HTTPS環境での動作確認
- [x] 認証情報の環境変数管理確認

## フェーズ5: 動作確認・デプロイ

### Task5-1: ローカル動作確認
- [x] `npm run dev`でNext.js開発サーバー動作確認
- [x] `npm run preview`でCloudflare Workers環境動作確認
- [x] `/resume`への認証機能動作確認

### Task5-2: 本番デプロイ
- [x] `npm run deploy`で本番環境デプロイ
- [x] 本番環境での認証動作確認
- [x] SEO設定（noindex等）の動作確認

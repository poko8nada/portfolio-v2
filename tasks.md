# 実装タスク一覧

## フェーズ0: SSG→SSR変更（Static Assets活用）

### Task0-1: Static Assets設定
- [ ] `wrangler.jsonc`にassets設定を追加
  - `assets.directory`を`.open-next/assets`に設定
  - `assets.binding`を`ASSETS`に設定
- [ ] mdファイルをassets配置用ディレクトリに配布する仕組み作成
  - `.open-next/assets/posts/`にmdファイルをコピーするスクリプト作成

### Task0-2: SSR+Static Assets対応実装
- [ ] `src/lib/post.ts`をStatic Assets対応に書き換え
  - `getAllPosts()`関数：`env.ASSETS.fetch()`でmdファイル一覧取得
  - `getPostsBySlug()`関数：`env.ASSETS.fetch('/posts/xxx.md')` + gray-matterでパース
  - File System API（fs）を完全に削除
- [ ] `scripts/process-markdown.js`を削除（不要になるため）
- [ ] `src/data/posts.json`を削除（不要になるため）
- [ ] `package.json`の`preprocess`スクリプトを削除
- [ ] `dev`スクリプトから`preprocess`を削除
- [ ] 各ページコンポーネントでのStatic Assets対応確認

## フェーズ1: 環境移行準備

### Task1-1: 依存関係の変更
- [x] `@opennextjs/cloudflare@latest`をインストール
- [x] `wrangler@latest`をdevDependencyとしてインストール
- [x] `@cloudflare/next-on-pages`を削除（不要になるため）

### Task1-2: 設定ファイルの更新
- [x] `wrangler.jsonc`をWorkers用に書き換え
  - `main: ".open-next/worker.js"`を追加
  - `compatibility_date: "2025-03-25"`以降に更新
  - `compatibility_flags: ["nodejs_compat"]`を追加
  - `assets`セクションを追加（`.open-next/assets`を指定）
- [x] `open-next.config.ts`を新規作成（defineCloudflareConfig）

### Task1-3: package.jsonスクリプト更新
- [x] 既存のPages用スクリプトを削除
  - `pages:build`
  - 既存の`preview`
  - 既存の`deploy`
- [x] Workers用スクリプトを追加
  - `preview: "opennextjs-cloudflare build && opennextjs-cloudflare preview"`
  - `deploy: "opennextjs-cloudflare build && opennextjs-cloudflare deploy"`
  - `cf-typegen: "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"`

## フェーズ2: Basic認証実装

### Task2-1: middleware.ts作成
- [ ] `src/middleware.ts`を新規作成
- [ ] `/resume`パスのみをターゲットとするマッチャー設定
- [ ] Basic認証ヘッダーの検証ロジック実装
- [ ] 認証失敗時の401レスポンス実装

### Task2-2: 環境変数設定
- [ ] ローカル開発用: `.env.local`に認証情報追加
- [ ] 本番環境用: `wrangler secret put`でCloudflare Workersに認証情報設定

## フェーズ3: Resume機能実装

### Task3-1: ディレクトリ・ファイル構造
- [ ] `resume/`ディレクトリを作成
- [ ] `.gitignore`に`resume/`を追加
- [ ] `src/app/(small_header)/resume/page.tsx`を作成
- [ ] resume用のmdファイルを作成（履歴書・職務経歴書）

### Task3-2: データパース機能
- [ ] `src/lib/resume.ts`を作成（resumeデータ処理用）
- [ ] resume mdファイルの読み取り・パース機能実装
- [ ] 一部データを他ページ・コンポーネントでも利用可能にする仕組み

### Task3-3: UI実装
- [ ] `/resume`ページのUI実装
- [ ] 認証後のみアクセス可能な状態確認
- [ ] レスポンシブ対応

## フェーズ4: SEO・セキュリティ対策

### Task4-1: インデックス防止
- [ ] `/resume`ページに`noindex`メタタグ追加
- [ ] `X-Robots-Tag`ヘッダーをmiddlewareで追加
- [ ] `public/robots.txt`にresume配下のDisallow追記

### Task4-2: セキュリティ強化
- [ ] 強力なパスワード設定
- [ ] HTTPS環境での動作確認
- [ ] 認証情報の環境変数管理確認

## フェーズ5: 動作確認・デプロイ

### Task5-1: ローカル動作確認
- [ ] `npm run dev`でNext.js開発サーバー動作確認
- [ ] `npm run preview`でCloudflare Workers環境動作確認
- [ ] `/resume`への認証機能動作確認

### Task5-2: 本番デプロイ
- [ ] `npm run deploy`で本番環境デプロイ
- [ ] 本番環境での認証動作確認
- [ ] SEO設定（noindex等）の動作確認

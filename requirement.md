# Cloudflare Workers × Next.js：特定ページのBasic認証・非公開化 要件まとめ

## 目的
- Cloudflare Workers上で動作するNext.jsプロジェクトの特定ページにBasic認証をかける
- 対象ページは検索エンジンにインデックスさせず、URLを知っているユーザーのみアクセス可能にする（完全非公開）

## 前提条件
- 現在：Cloudflare Pages上でNext.jsプロジェクトが動作中（@cloudflare/next-on-pages使用）
- 移行先：Cloudflare Workers（@opennextjs/cloudflare使用）

## 実装方針

### 0. レンダリング方式の変更
- **現在の方式**: SSG（Static Site Generation）
  - ビルド時に`scripts/process-markdown.js`でmd→JSON変換
  - `src/data/posts.json`からデータを読み込み
- **変更後の方式**: SSR（Server-Side Rendering）+ Static Assets活用
  - **制約**: Cloudflare WorkersではFile System APIが未サポート（⚪ coming soon）
  - **解決策**: Cloudflare Workers Static Assetsを活用
  - **Static Assets仕組み**:
    - `wrangler.jsonc`の`assets.directory`にmdファイルを配置
    - デプロイ時にCloudflareが自動的にassets配信ネットワークに配布
    - Worker内で`env.ASSETS.fetch()`を使用してassetsにアクセス
    - グローバルキャッシュとtiered cachingによる高速配信
  - **データフロー**: 
    - 現在：md → JSON保存 → 静的読み込み
    - 変更後：md（assets） → env.ASSETS.fetch() → gray-matter → 直接データオブジェクト
    - メリット：中間ファイル不要、CDN配信、リアルタイム処理、キャッシュ最適化
    - 実装：Server Components内で`env.ASSETS.fetch('/posts/xxx.md')`でmdファイル取得・パース

### 1. Cloudflare Pages → Workers移行
- **現在の構成**: `@cloudflare/next-on-pages` + Pages
- **移行後の構成**: `@opennextjs/cloudflare` + Workers
- **移行手順**:
  1. `@opennextjs/cloudflare`をインストール
  2. `wrangler.jsonc`を Workers用に更新（assets配置、worker.js指定）
  3. `open-next.config.ts`を作成
  4. `package.json`のスクリプトを更新（preview/deploy）
  5. middlewareの互換性確認

### 2. Cloudflare Workers対応
- Workersの環境変数（secret）を利用して認証情報を安全に管理
- `wrangler secret put`コマンドでsecretを設定
- `compatibility_date`を2024-09-23以降に設定

### 3. Basic認証の導入
- `middleware.ts`で`/resume`配下にBasic認証を実装（resume配下のみ認証必須）
- 認証情報は環境変数で管理し、コードにハードコーディングしない
- Workersの`nodejs_compat`フラグが必要

### 4. resumeデータ管理
- `resume/`ディレクトリを作成し、個人情報を含むmdファイル（履歴書・職務経歴書等）を配置
- `.gitignore`に`resume/`を追加し、Git管理対象外とする
- resume配下のmdは認証後のみアクセス可能
- resume以外の一部ページ・コンポーネントでも、resume内mdの一部データをパースして利用可能にする

### 5. インデックス防止
- 保護ページに`noindex`メタタグと`X-Robots-Tag`ヘッダーを追加
- ルート直下の`public/robots.txt`で追加のクロール防止設定

## 移行時の注意点
- middlewareはWorkersでサポート済み
- 現在のPages用スクリプト（`pages:build`, `preview`, `deploy`）をWorkers用に置き換え
- assetsの配置方法が変更（`.open-next/assets`ディレクトリ）
- `nodejs_compat`互換性フラグが必須
- SSG→SSR変更により、`scripts/process-markdown.js`と`src/data/posts.json`は不要となる
- 既存の`getAllPosts()`、`getPostsBySlug()`関数をfetch()ベースに書き換え

## セキュリティ上の注意
- 強力なパスワードを使用し、定期的に変更
- 認証情報は必ず環境変数で管理
- Basic認証はHTTPS環境でのみ利用
- 個人情報を含むファイルはGit管理対象外とする


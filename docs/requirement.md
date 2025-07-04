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
- **変更後の方式**: SSR（Server-Side Rendering）+ Static Assets活用（postsのみ）
  - **Posts管理**: Cloudflare Workers Static Assetsを活用
    - `wrangler.jsonc`の`assets.directory`にmdファイルを配置
    - デプロイ時にCloudflareが自動的にassets配信ネットワークに配布
    - Worker内で`env.ASSETS.fetch()`を使用してassetsにアクセス
    - **データフロー**: md（assets） → env.ASSETS.fetch() → gray-matter → 直接データオブジェクト
    - **開発環境対応**: 開発時はNode.js fs、本番時はCloudflare ASSETS
  - **Resume管理**: webpack asset/source方式
    - Markdownファイルをビルド時にJSバンドルに文字列として埋め込み
    - import文で直接アクセス、実行時はメモリから取得
    - Cloudflare Workersの制約（File System API未対応）を完全回避
    - **データフロー**: md → webpack asset/source → バンドル埋め込み → import文 → 直接アクセス
    - **セキュリティ**: public配下に配置せず、認証レイヤー通過後のみアクセス可能
  - **高度な配布機能**: `isPublished`フィルタ、version差分更新、rich indexファイル生成

### 1. Cloudflare Pages → Workers移行
- **現在の構成**: `@cloudflare/next-on-pages` + Pages
- **移行後の構成**: `@opennextjs/cloudflare` + Workers
- **移行手順**:
  1. `@opennextjs/cloudflare`をインストール
  2. `wrangler.jsonc`を Workers用に更新（assets配置、worker.js指定）
  3. `open-next.config.ts`を作成
  4. `package.json`のスクリプトを更新（preview/deploy）
  5. middlewareの互換性確認 ⏳

### 2. Cloudflare Workers対応
- Workersの環境変数（secret）を利用して認証情報を安全に管理
- `wrangler secret put`コマンドでsecretを設定
- `compatibility_date`を2024-09-23以降に設定

### 3. Basic認証の導入
- `middleware.ts`で`/resume`配下にBasic認証を実装（resume配下のみ認証必須）
- 認証情報は環境変数で管理し、コードにハードコーディングしない
- Workersの`nodejs_compat`フラグが必要

### 4. resumeデータ管理
- **webpack asset/source方式採用**: Markdownファイルをビルド時に文字列としてバンドル
- `src/content/resume/`ディレクトリに個人情報を含むmdファイル（履歴書・職務経歴書等）を配置
- `.gitignore`に`src/content/resume/`を追加し、Git管理対象外とする
- **技術実装**:
  - `next.config.ts`でwebpack asset/sourceルールを設定
  - TypeScript型定義（`src/types/markdown.d.ts`）でmdファイルimportを対応
  - `src/lib/resume.ts`でimport文による直接アクセス（非同期処理不要）
- resume配下のmdは認証後のみアクセス可能（middlewareで保護）
- resume以外のページ・コンポーネントでも、resume内mdの一部データをパースして利用可能
- **セキュリティ**: public配下に配置せず、バンドル内蔵でStatic Assets経由の直接アクセス不可

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
- **Resume管理の技術選択**:
  - webpack asset/source方式を採用（モダン、シンプル、セキュア）
  - next.config.tsでMarkdownファイルの文字列化設定が必要
  - TypeScript型定義（`*.md`ファイルのimport対応）が必要

## セキュリティ上の注意
- 強力なパスワードを使用し、定期的に変更
- 認証情報は必ず環境変数で管理
- Basic認証はHTTPS環境でのみ利用
- 個人情報を含むファイルはGit管理対象外とする（`src/content/resume/`をgitignore）
- **Resume データの保護**:
  - webpack asset/source方式により、バンドル内蔵でファイルシステム・Static Assets経由の直接アクセス不可
  - middlewareによる認証レイヤーを通過したリクエストのみアクセス可能
  - public配下に配置しないため、静的ファイル配信での意図しない露出を防止


# Cloudflare Workers × Next.js：特定ページのBasic認証・非公開化 要件まとめ

## 目的
- Cloudflare Workers上で動作するNext.jsプロジェクトの特定ページにBasic認証をかける
- 対象ページは検索エンジンにインデックスさせず、URLを知っているユーザーのみアクセス可能にする（完全非公開）

## 前提条件
- 現在：Cloudflare Pages上でNext.jsプロジェクトが動作中（@cloudflare/next-on-pages使用）
- 移行先：Cloudflare Workers（@opennextjs/cloudflare使用）

## 実装方針

### 1. Cloudflare Pages → Workers移行
- **現在の構成**: `@cloudflare/next-on-pages` + Pages
- **移行後の構成**: `@opennextjs/cloudflare` + Workers
- **移行手順**:
  1. `@opennextjs/cloudflare`をインストール
  2. `wrangler.jsonc`を Workers用に更新（assets配置、worker.js指定）
  3. `open-next.config.ts`を作成
  4. `package.json`のスクリプトを更新（preview/deploy）
  5. middlewareの互換性確認

### 2. Basic認証の導入
- `middleware.ts`で特定パスにBasic認証を実装
- 認証情報は環境変数で管理し、コードにハードコーディングしない
- Workersの`nodejs_compat`フラグが必要

### 3. インデックス防止
- 保護ページに`noindex`メタタグと`X-Robots-Tag`ヘッダーを追加
- ルート直下の`public/robots.txt`で追加のクロール防止設定

### 4. Cloudflare Workers対応
- Workersの環境変数（secret）を利用して認証情報を安全に管理
- `wrangler secret put`コマンドでsecretを設定
- `compatibility_date`を2024-09-23以降に設定

## 移行時の注意点
- middlewareはWorkersでサポート済み
- 現在のPages用スクリプト（`pages:build`, `preview`, `deploy`）をWorkers用に置き換え
- assetsの配置方法が変更（`.open-next/assets`ディレクトリ）
- `nodejs_compat`互換性フラグが必須

## セキュリティ上の注意
- 強力なパスワードを使用し、定期的に変更
- 認証情報は必ず環境変数で管理
- Basic認証はHTTPS環境でのみ利用


# 非公開コンテンツ共有用構成メモ

## はじめに

このドキュメントは、ポートフォリオサイトで関係者向けに非公開コンテンツ（レジュメなど）を安全に共有するための**理想的なアーキテクチャ**を記述したものです。現状の実装とは一部異なる点があり、今後の改修タスクも兼ねています。

## 背景と目的

- 一部の関係者にだけMarkdown形式の資料と画像を共有したい
- 現状はローカルにGit管理下のmdと画像を置き、ビルド時にバンドルしてBasic認証ページで公開している
- コンテンツの更新のたびにデプロイが必要であり、コンテンツとコードの分離ができていない
- 画像の直リンクや保存もできれば防ぎたい

## 現状の構成 (2025/01/26時点)

- **対象ページ**: `/resume`
- **認証**: Next.js Middleware (`src/middleware.ts`) によるBasic認証
- **デプロイ環境**: Cloudflare Workers + OpenNext構成
- **コンテンツ**:
  - ローカルのMarkdownファイル (`src/content/resume/**/*.md`) を直接import
  - ビルドスクリプト (`scripts/prepare-resume.js`) で結合・処理
  - アプリケーションにバンドルして配信
- **画像**:
  - ローカルの画像ファイル (`src/content/resume/images/*`) をbase64形式でJSONに変換
  - `profile.json` として処理済み
  - `draggable="false"` のみ実装済み

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

**実装内容：**
- [ ] `wrangler r2 bucket create portfolio-resume-assets` でプライベートなR2バケットを作成
- [ ] `wrangler.jsonc` にR2バケットのバインディング設定を追加
- [ ] バインディング名: `PORTFOLIO_ASSETS`、バケット名: `portfolio-resume-assets`

### 2. コンテンツ取得APIの実装

**実装ファイル:** `src/app/api/resume/[slug]/route.ts`

**実装内容：**
- [ ] Cloudflare Workers環境でR2バケットにアクセスするAPI Route作成
- [ ] `getCloudflareContext()` を使ってR2バインディングを取得
- [ ] スラグに対応するMarkdownファイルを `resume/${slug}.md` から取得
- [ ] エラーハンドリングとレスポンス形式の統一
- [ ] Basic認証ミドルウェアの対象に含める（matcher更新）

### 3. 画像プロキシAPIの実装

**実装ファイル:** `src/app/api/proxy-image/route.ts`

**実装内容：**
- [ ] `path` クエリパラメータで指定された画像をR2から取得
- [ ] Refererヘッダによるアクセス制限（自サイトからのみ許可）
- [ ] 適切なContent-Typeヘッダーとキャッシュ設定
- [ ] 画像が存在しない場合の404ハンドリング
- [ ] Basic認証ミドルウェアの対象に含める

### 4. フロントエンドのリファクタリング

#### 4.1 `src/lib/resume.ts` の修正
- [ ] ローカルimportを削除し、内部API (`/api/resume/[slug]`) 経由でコンテンツ取得
- [ ] Server-to-server通信でBasic認証ヘッダーを付与
- [ ] 環境に応じたbaseURL設定（開発環境 vs 本番環境）
- [ ] エラーハンドリングとフォールバック処理

#### 4.2 `src/app/resume/page.tsx` の修正
- [ ] プロフィール画像を `/api/proxy-image?path=profile.jpg` に変更
- [ ] 画像タグに `onContextMenu` イベントハンドラーを追加
- [ ] ローカルJSONファイルへの依存を削除

#### 4.3 `src/components/markdown-for-resume.tsx` の修正
- [ ] Markdown内の画像URLを自動的にプロキシAPI経由に変換
- [ ] 画像タグのセキュリティ設定（draggable=false, onContextMenu）
- [ ] 外部URL（http/https）は直接表示、相対パスはプロキシ経由

### 5. コンテンツのR2への移行

**実装手順：**
- [ ] 現在の `src/content/resume/` 以下のMarkdownファイルをR2にアップロード
- [ ] 画像ファイルの準備（JSONから元画像への復元 or 新規画像準備）
- [ ] アップロード用スクリプトの作成（`scripts/upload-to-r2.js`）
- [ ] バッチアップロードのテストと手順書作成

### 6. 旧コンテンツの削除とGit管理からの除外

- [ ] `src/content/` ディレクトリを削除
- [ ] `.gitignore` に `src/content/` を追加
- [ ] `src/lib/resume.ts` から古いimport文を削除
- [ ] `scripts/prepare-resume.js` を削除（不要になる）

### 7. middlewareの更新

**実装内容：**
- [ ] Basic認証の対象パスを拡張: `/resume/*`, `/api/resume/*`, `/api/proxy-image`
- [ ] 新しいAPI Routeが適切に保護されていることを確認

### 8. デプロイと動作確認

**確認項目：**
- [ ] `/resume` ページへのアクセス時にBasic認証が要求されるか
- [ ] 認証後、R2から取得したコンテンツが正しく表示されるか
- [ ] 画像がプロキシ経由で表示され、直接保存が困難になっているか
- [ ] API Routeへの直接アクセスでも認証が要求されるか
- [ ] Refererチェックが正常に動作するか

## 今後の改善案

### セキュリティ強化
- [ ] トークンベース認証の導入検討
- [ ] IP制限の追加
- [ ] アクセスログの記録と分析

### パフォーマンス向上
- [ ] R2からのコンテンツキャッシュ戦略
- [ ] 画像の最適化・圧縮
- [ ] CDN経由での配信最適化

### 運用性向上
- [ ] コンテンツ更新用の管理画面開発
- [ ] 自動バックアップ機能
- [ ] コンテンツのバージョン管理システム

## 技術的な考慮事項

### Cloudflare Workers特有の制約
- Node.js APIの一部が使用不可（ファイルシステムアクセスなど）
- R2バインディングを通じたオブジェクトストレージアクセス
- エッジ環境での実行時間制限

### セキュリティ設計
- Basic認証 + Refererチェックの多層防御
- プライベートR2バケットによるコンテンツ保護
- 画像の直接ダウンロード防止策

### 運用とメンテナンス
- コンテンツとコードの完全分離
- Wrangler CLIを使った効率的なコンテンツ管理
- 環境変数による設定の外部化

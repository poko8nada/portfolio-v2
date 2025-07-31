# 非公開コンテンツ共有用構成メモ

## はじめに

このドキュメントは、ポートフォリオサイトで関係者向けに非公開コンテンツ（レジュメなど）を安全に共有するためのアーキテクチャを記述したものです。

## 背景と目的

- 一部の関係者にだけMarkdown形式の資料と画像を共有したい
- 従来の構成では、コンテンツの更新のたびにデプロイが必要であり、コンテンツとコードの分離ができていなかった
- 画像の直リンクや保存もできれば防ぎたい

## 構成案

### 保存・バージョン管理

- **保存先**: Markdown・画像はすべてCloudflare R2に保存する。
- **バージョン管理**: ファイル名にタイムスタンプを付与することで、簡易的なバージョン管理を実現する。
  - 命名規則: `[元のファイル名]_[YYYYMMDDHHMMSS].[拡張子]` (例: `resume_20250726103000.md`)
  - アップロードは常に新しいタイムスタンプでの「追加」とし、既存ファイルの上書きは行わない。
- **ロールバック**: 誤ったファイルをアップロードした場合、そのファイルをR2から削除するだけで、APIは自動的に一つ前のバージョンを最新として配信する。

### 公開方法

- **動的取得**: Next.jsのAPI Routeが、R2から最新バージョンのコンテンツを動的に取得して配信する。
  - APIはR2のS3互換APIを介してファイルをプレフィックスで検索し、タイムスタンプが最も新しいものを「最新」と判断する。
- **認証**: ページ (`/resume`) とAPI (`/api/resume/*`, `/api/proxy-image`) の両方を、Next.js MiddlewareによるBasic認証で保護する。

### コンテンツ表示とインタラクション制御

- **コンポーネント構成**:
  - `src/app/resume/page.tsx` (Server Component): データ取得とページの骨格レイアウトを担当。
  - `src/feature/display-resume/index.tsx` (Client Component): 取得したデータを元にコンテンツ全体を描画し、インタラクションを制御する。
  - `src/components/profile-image.tsx` (Client Component): プロフィール画像をプロキシ経由で表示し、インタラクションを制御する。
- **プロキシ経由の画像表示**: 画像は `/api/proxy-image` というAPI経由で配信する。
  - プロキシAPIはRefererヘッダをチェックし、自サイトからのリクエストのみを許可することで、画像の直リンクを防ぐ。
- **ダウンロード・選択抑止**: `display-resume/index.tsx` コンポーネント全体で、以下の操作を無効化し、簡易的なコンテンツ保護を行う。
  - 右クリックによるコンテキストメニュー表示
  - ドラッグ＆ドロップ操作
  - テキスト選択

---

## R2移行に向けた実装タスク

### 1. R2バケットの準備と設定

- [x] `wrangler r2 bucket create portfolio-resume-assets` でプライベートなR2バケットを作成済み。
- [x] `wrangler.jsonc` にR2バケットのバインディング (`PORTFOLIO_ASSETS`) を設定済み。

### 2. コンテンツ取得APIの実装 (バージョン管理対応)

**実装ファイル:** `src/app/api/resume/[slug]/route.ts`

- [x] 軽量ライブラリ `aws4fetch` を使用し、R2のS3互換APIエンドポイントに対して署名付きリクエストを送信する。
- [x] `ListObjectsV2` APIを利用して、指定された `slug` のプレフィックスを持つファイルのリストを取得する。
- [x] ファイルリストをタイムスタンプ部分で降順ソートし、最新バージョンのファイルキーを特定する。
- [x] 最新のファイルキーを使って `GetObject` APIを呼び出し、その内容をレスポンスとして返す。

### 3. 画像プロキシAPIの実装 (バージョン管理対応)

**実装ファイル:** `src/app/api/proxy-image/route.ts`

- [x] コンテンツ取得APIと同様に、`aws4fetch` を使って最新バージョンの画像を取得するロジックを実装する。
- [x] Refererヘッダによるアクセス制限を実装し、ローカル環境、Cloudflareプレビュー環境、本番環境からのアクセスを許可する。

### 4. フロントエンドのリファクタリング

- [x] `src/lib/resume.ts`: ローカルimportを削除し、内部API (`/api/resume/[slug]`) 経でコンテンツを取得するように変更する。
- [x] `src/components/profile-image.tsx` を新規作成する。
  - [x] プロキシAPI経由でプロフィール画像を表示し、右クリック等を無効化する。
- [x] `src/feature/display-resume/index.tsx` を新規作成する。
  - [x] propsとしてデータを受け取り、レジュメコンテンツ全体を描画する。
  - [x] `profile-image.tsx` コンポーネントをインポートして使用する。
  - [x] コンポーネント全体で右クリック、ドラッグ、テキスト選択を無効化する。
- [x] `src/app/resume/page.tsx` をリファクタリングする。
  - [x] データ取得処理は残し、描画部分を `display-resume/index.tsx` に移譲する。
- [x] `src/components/markdown-for-resume.tsx` を更新する。
  - [x] Markdown内の相対パス画像をプロキシAPI経由で表示するよう修正する。

### 5. コンテンツ移行とアップロードスクリプトの作成

- [x] `scripts/upload-resume.js` を新規作成する。このスクリプトは、`src/content/resume` 内のファイルを、タイムスタンプを付与してR2にアップロードする。
- [x] 作成したスクリプトを実行し、初期コンテンツをR2にアップロードする。

### 6. 旧コンテンツと不要コードの削除

- [x] 不要になった以下のファイル・関数・型定義を削除する。
  - `scripts/prepare-resume.js`
  - `src/lib/resume.ts` 内の `getBasicProfileInfo` 関数
  - `src/content/resume/images/profile.json`
  - `src/types/profile.d.ts`
  - `src/types/markdown.d.ts` 内の `ImageData` 型
- [x] `package.json` の `scripts` から、不要になったコマンドを削除・整理する。

### 7. middlewareの更新

- [x] Basic認証の対象パスに `/api/resume/*` と `/api/proxy-image` を追加済み。

### 8. デプロイと動作確認

- [x] `/resume` ページで、R2から取得した最新のコンテンツが表示されるか。
- [x] ページ全体で右クリック、ドラッグ、テキスト選択ができないようになっているか。
- [x] R2に新しいバージョンのファイルをアップロード後、ページをリロードすると内容が更新されるか。
- [x] R2から最新ファイルを削除後、ページをリロードすると一つ前のバージョンが表示されるか（ロールバックの確認）。

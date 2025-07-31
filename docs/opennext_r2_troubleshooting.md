# OpenNext + Cloudflare R2 接続問題の解決記録

## 問題の概要

OpenNextを使用してCloudflare R2に接続する際に発生した問題とその解決過程の記録。

### 初期問題

- `wrangler`単体ではリモートのR2に接続可能
- OpenNext経由（`pnpm preview --remote`）で`getCloudflareContext()`を呼び出すとハングアップ

## 問題の詳細分析

### 環境別の動作状況

#### `pnpm preview --remote`付き

- ログが出力されずにハングアップ
- OpenNextのリモートプレビュー機能と外部ネットワークリクエスト（S3 API）の相性問題

#### `pnpm preview --remote`なし

- `[unenv] fs.readFile is not implemented yet!` エラーが発生
- unenvライブラリがCloudflare Workers環境をエミュレートする際のNode.js API制限

## 根本原因の特定

### getCloudflareContext()の問題

- OpenNextとCloudflare Workersランタイムの互換性問題
- 非同期処理が適切に処理されない
- 環境変数やバインディング設定の不備
- 開発環境とプロダクション環境の違い

### fs.readFileエラーの原因

- **環境変数の読み取り問題ではない** - `process.env`はCloudflare Workersでも利用可能
- **ファイルシステムアクセスの問題** - Node.jsの`fs`モジュールがWorkers環境で利用不可
- AWS SDKが内部的にファイルシステムにアクセスしようとしている

## 解決策の検討

### 1. S3互換APIの採用理由

環境の一貫性を保つため、`getCloudflareContext()`を使わずS3互換APIを使用することを決定。

**メリット:**

- 開発環境（`pnpm preview`）でも本番環境でも同じコードで動作
- `getCloudflareContext()`のような環境依存関数が不要
- デバッグが容易
- ポータビリティが高い（将来的な移行が簡単）

### 2. 実装方式の選択

#### 検討した方式

**A. AWS SDK + S3Client**

```javascript
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
```

**問題点:**

- ファイルシステムアクセスでunenvエラー
- OpenNextとの互換性問題

**B. 直接fetch API（最終採用案）**

```javascript
import { AwsClient } from "aws4fetch";

const r2Client = new AwsClient({
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  region: "auto",
});

const uploadFile = async (key, file) => {
  const url = `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET_NAME}/${key}`;

  return r2Client.fetch(url, {
    method: "PUT",
    body: file,
  });
};
```

## 最終解決策の詳細

### aws4fetchを使用した実装

#### メリット

- `fs`モジュールを使用しないためunenvエラーを回避
- OpenNextの制約に影響されない
- Workers環境でもローカル環境でも同じコードパス
- 軽量（SDKのバンドルサイズなし）
- S3互換APIとして標準的なHTTP REST APIを使用

#### 実装例

```javascript
import { AwsClient } from "aws4fetch";

const r2Client = new AwsClient({
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  region: "auto",
});

// ファイルアップロード
const uploadToR2 = async (key, file) => {
  const url = `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET_NAME}/${key}`;

  const response = await r2Client.fetch(url, {
    method: "PUT",
    body: file,
  });

  if (!response.ok) {
    throw new Error(`R2 Upload Error: ${response.status}`);
  }

  return response;
};

// ファイルダウンロード
const getFromR2 = async (key) => {
  const url = `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET_NAME}/${key}`;

  const response = await r2Client.fetch(url, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`R2 Get Error: ${response.status}`);
  }

  return response;
};
```

## リスク評価

### セキュリティ関連

- **脆弱性管理:** aws4fetchパッケージ自体の脆弱性リスク（公式SDKより情報が少ない）
- **署名実装:** AWS署名v4の実装バグによる認証回避リスク

### 運用・保守

- **サポート不足:** 公式AWS SDKと比べて情報・ドキュメントが少ない
- **機能制限:** 自動リトライ、ページネーション等の便利機能を自分で実装する必要
- **型安全性:** TypeScriptの型定義が公式SDKより貧弱な可能性

### パフォーマンス

- **最適化不足:** 接続プール、キャッシュ機能が手動実装

### リスク軽減策

```javascript
// エラーハンドリングの強化
try {
  const response = await r2Client.fetch(url, options);
  if (!response.ok) {
    throw new Error(
      `R2 API Error: ${response.status} - ${response.statusText}`,
    );
  }
  return response;
} catch (error) {
  console.error("R2 Operation Failed:", error);
  // リトライ処理やフォールバック処理
  throw error;
}
```

## 結論

### 採用理由

シンプルなCRUD操作に限定される用途において、aws4fetchを使用したfetch APIによる実装は：

1. **OpenNextとの互換性問題を根本解決**
2. **開発・本番環境での一貫性を確保**
3. **軽量で依存関係が少ない**
4. **Cloudflare Workers環境での安定動作**

### 推奨事項

- 複雑なS3機能が不要な場合は積極的に採用可能
- エラーハンドリングとロギングを適切に実装
- 定期的な依存関係の脆弱性チェック
- 将来的に機能拡張が必要になった場合は公式SDKへの移行を検討

---

**解決日時:** 2025年7月31日
**解決方法:** aws4fetchを使用したS3互換API直接アクセス
**結果:** 開発・本番環境両方で安定動作を確認

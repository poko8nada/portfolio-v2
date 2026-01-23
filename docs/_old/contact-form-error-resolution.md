# お問い合わせフォーム実装時のエラー解決記録

## 概要
Next.js 15 + OpenNext + Cloudflare Workersでお問い合わせフォーム実装時に発生したエラーとその解決方法を記録。

## 発生したエラー一覧

### 1. Zodバージョン互換性エラー

#### エラー内容
```
Module not found: Package path ./v4/core is not exported from package zod
```

#### 原因
- `@hookform/resolvers`の新しいバージョン（5.1.1）がZod v4のパスを参照
- しかし実際のZodはv3系で、v4のパスが存在しない
- 複数のZodバージョンが混在（直接インストール版とwrangler経由版）

#### 解決方法
1. **バージョン統一**:
   ```json
   {
     "dependencies": {
       "zod": "3.22.3",
       "@hookform/resolvers": "3.9.0",
       "react-hook-form": "7.53.0"
     },
     "pnpm": {
       "overrides": {
         "zod": "3.22.3"
       }
     }
   }
   ```

2. **キャッシュクリア**:
   ```bash
   rm -rf node_modules/.pnpm && pnpm install
   ```

#### 学んだこと
- パッケージの相互依存関係を考慮したバージョン選択の重要性
- pnpm overridesによる強制的なバージョン統一の有効性

### 2. Turnstileインポートエラー

#### エラー内容
```
Module has no default export. Did you mean to use 'import { Turnstile }' instead?
```

#### 原因
- `@marsidev/react-turnstile`はnamed exportのみ提供
- default importを使用していた

#### 解決方法
```typescript
// ❌ 間違い
import Turnstile from '@marsidev/react-turnstile'

// ✅ 正しい
import { Turnstile } from '@marsidev/react-turnstile'
```

#### 学んだこと
- パッケージのexport形式の事前確認の重要性

### 3. TypeScript型競合エラー

#### エラー内容
```
Type 'ZodObject<...>' is not assignable to parameter of type 'ZodType<any, any, any>'
Types of property '_parse' are incompatible
```

#### 原因
- 複数のZodバージョンが存在し、TypeScript型定義が競合
- `zod 3.23.8`（直接）と`zod 3.22.3`（wrangler経由）の混在

#### 解決方法
1. **依存関係の確認**:
   ```bash
   pnpm why zod
   ```

2. **バージョン統一**:
   - package.jsonでのバージョン指定
   - pnpm overridesでの強制統一

#### 学んだこと
- 間接依存関係も含めた依存関係の把握が必要
- TypeScript型競合はビルド時だけでなく開発時にも影響

### 4. Next.js 15 Client Component警告

#### エラー内容
```
Props must be serializable for components in the "use client" entry file.
"onSubmit" is a function that's not a Server Action.
```

#### 原因
- Next.js 15のClient Component厳格化
- `onSubmit`という名前がServer Actionと誤認される

#### 解決方法
```typescript
// ❌ 問題のあるprops名
type Props = {
  onSubmit: (data: ContactFormData) => void
}

// ✅ 修正後
type Props = {
  onSubmitAction: (data: ContactFormData) => void
}
```

#### 学んだこと
- Next.js 15の新しい命名規則への対応が必要
- Client ComponentとServer Actionの明確な区別

### 5. Props名不整合エラー

#### エラー内容
```
Property 'onSubmit' does not exist on type 'IntrinsicAttributes & Props'
```

#### 原因
- ContactFormコンポーネントのprops名変更後、使用側の更新漏れ

#### 解決方法
```typescript
// ContactFormコンポーネント側で変更
<ContactForm
  onSubmitAction={handleSubmit}  // onSubmit → onSubmitAction
  isSubmitting={status === 'submitting'}
  siteKey={siteKey}
/>
```

#### 学んだこと
- インターフェース変更時の影響範囲の確認が重要
- TypeScriptの型チェックの有効性

## 解決プロセスの反省点

### 良かった点
1. **段階的な問題解決**: 一つずつエラーを解決
2. **根本原因の追求**: 表面的な修正ではなく原因を特定
3. **ツールの活用**: `pnpm why`、診断ツールの効果的利用

### 改善点
1. **事前調査不足**: パッケージの互換性事前確認
2. **性急な解決**: 最初に慌てて複数の変更を同時実行
3. **依存関係の理解不足**: 間接依存の影響を軽視

## 今後の対策

### パッケージ管理
1. **バージョン互換性の事前確認**
2. **依存関係ツリーの定期的な確認**
3. **pnpm overridesの積極活用**

### 開発プロセス
1. **段階的な実装とテスト**
2. **エラーログの詳細な分析**
3. **型定義の事前確認**

### Next.js 15対応
1. **新機能・制約の事前学習**
2. **Client/Server Component区別の明確化**
3. **命名規則の遵守**

## 参考情報

### 有用なコマンド
```bash
# 依存関係の確認
pnpm why <package-name>

# キャッシュクリア
rm -rf node_modules/.pnpm && pnpm install

# 診断実行
pnpm build  # エラーの詳細確認
```

### 設定ファイル
```json
// package.json - バージョン統一例
{
  "pnpm": {
    "overrides": {
      "zod": "3.22.3"
    }
  }
}
```

## 最終的な動作環境

### パッケージバージョン
- `zod: 3.22.3`
- `@hookform/resolvers: 3.9.0`
- `react-hook-form: 7.53.0`
- `@marsidev/react-turnstile: 1.1.0`
- `resend: 4.6.0`

### 構成
- Next.js 15.3.4 (App Router)
- OpenNext Cloudflare 1.3.1
- TypeScript 5.8.3

この記録が同様の問題に直面した際の参考となることを期待する。

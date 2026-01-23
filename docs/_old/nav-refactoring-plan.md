# Navigation Refactoring Implementation Task

## 実装指示

**目的**: navからresumeリンクを削除し、aboutページ内にレジュメへのリンクを追加する

## 実装タスク

### Task 1: Navigation設定の修正
**ファイル**: `src/lib/navigation.ts`

以下のresumeアイテムを両方の配列から削除する：
```typescript
{
  label: 'Resume',
  href: '/resume',
  isAnchor: false,
  icon: 'Lock',
  showIcon: true,
  requiresConfirmation: true,
}
```

**削除対象**:
- `homeLayoutNavItems` からresumeアイテムを削除
- `allNavItems` からresumeアイテムを削除

### Task 2: About Page へのレジュメリンク追加
**ファイル**: `src/app/about/page.tsx`

実装要件：
1. スキル一覧の下部（`<MarkdownForAbout content={resumeData.content} />` の後）にレジュメリンクボタンを追加
2. `ConfirmationDialog`コンポーネントを使用して確認ダイアログを実装
3. ボタンデザインは既存のUIテーマに合わせる
4. レスポンシブデザインに対応

**必要なimport**:
```typescript
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
```

**実装イメージ**:
```tsx
<ConfirmationDialog
  href="/resume"
  icon="Lock"
  title="Resume - Private Area"
  description="このページは非公開情報を含んでいます。続行しますか？"
  className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pr hover:bg-pr-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pr transition-colors duration-200"
>
  Resume を見る
</ConfirmationDialog>
```

**配置位置**: `</div>` タグの直前（`<MarkdownForAbout>`コンポーネントの下）

## 実装制約

- Resume page (`src/app/resume/page.tsx`) は削除しない
- 既存の確認ダイアログ機能を再利用する
- 既存のUIテーマとの整合性を保つ
- レスポンシブデザインに対応する
- TypeScriptの型安全性を維持する

## 完了確認項目

1. [x] ナビゲーションからresumeリンクが削除されている
2. [x] aboutページにresumeリンクボタンが追加されている
3. [x] 確認ダイアログが正常に動作する
4. [x] レスポンシブデザインが適切に動作する
5. [x] TypeScriptコンパイルエラーがない

## 動作確認方法

1. ホームページでナビゲーションにresumeが表示されないことを確認
2. 他のページでもナビゲーションにresumeが表示されないことを確認
3. aboutページでresumeリンクボタンが表示されることを確認
4. aboutページのresumeリンクをクリックして確認ダイアログが表示されることを確認
5. 確認ダイアログで「OK」を選択するとresumeページに遷移することを確認

## 注意事項

- 最大5ファイル制限内で実装完了する（今回は2ファイルのみ）
- 既存のコンポーネントとスタイリングを最大限活用する
- 段階的にテストしながら実装する

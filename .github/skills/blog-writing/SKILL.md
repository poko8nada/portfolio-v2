---
name: blog-writing
description: "Generate and proofread Markdown blog posts for the PokoHanada portfolio. Use when asked to craft new entries or polish drafts so they follow the site frontmatter rules, tone, and publishing workflow."
---

# blog-writing

新しい記事の生成や既存ドラフトの校正をこのスキルで扱います。ポートフォリオのブログは Markdown＋frontmatter で管理されており、Cloudflare + OpenNext 環境に適した構成を保つことが最優先です。

## When to Use This Skill

- 企画・構成・本文の自動生成を求められたとき
- 既存 Markdown ドラフトの文体、構成、整合性をチェック・改善するよう指示されたとき
- `public/posts/` に追加する予定の記事の frontmatter を整えてほしいとき

## Prerequisites

- frontmatter に含まれる共通フィールド（`title`, `createdAt`, `updatedAt`, `version`, `thumbnail`, `isPublished`）を理解しておく
- 戦略的なトピック（例：Cloudflare R2 移行、Next.js/Workers 運用、技術ディレクション）に沿った語彙や事例を用意する
- 公開可否は `isPublished: false` から始め、レビュー後に true へ切り替えるのが基本

## Template Integration

- `.github/skills/blog-writing/template/post-template.md` を参照し、全体構成、見出し、Emphasis/Lists/Code/Links/Images などの実例を学ぶ。
- スキル利用時にはテンプレートを基に必要セクションを取捨選択し、実際の投稿では導入→課題→解決→まとめの構成となるよう微調整する。

## Workflows

### 1. Draft Generation

1. 必要情報を確認する：主題、ターゲット読者、トーン（例：丁寧な技術解説）、想定文字数、キーメッセージ、挿絵/スクリーンショットの候補などを質問する。
2. frontmatter を含む Markdown 出力を作成する。例:

```markdown
---
title: ここに記事タイトル
createdAt: MMMM-YY-DD
updatedAt: MMMM-YY-DD
version: 1
thumbnail: /images/posts/pencil01.svg
isPublished: false
---

## 見出し

本文...
```

3. 見出し構造は `##` + `###` を使い、導入・課題・解決・まとめの流れを守る。箇条書きや強調を適宜使い、読みやすい段落で構成する。

### 2. Proofreading

1. `public/posts/` にある既存投稿の語調・構成を参照しつつ、文法、句読点、接続表現をチェックする。
2. 表現が曖昧な箇所には改善案と理由（例：曖昧な主語、冗長な説明、用語統一の欠如）を添える。
3. Markdown 構造を崩さず、必要ならコードブロック/箇条書きを再整形して可読性を上げる。
4. メタ情報（バージョン、更新日、thumbnail）に不整合があれば指摘し、正しい値の候補を提示する。

## Delivery Expectations

- 生成タスクでは `public/posts/` に設置する形式の Markdown をそのまま返す。`isPublished` は false、`version` は 1 から開始する。
- 校正タスクでは「指摘一覧」「修正案」「推奨 frontmatter」などを含む Markdown またはプレーンテキストを返し、説明的かつ行動可能な提案とする。
- どちらのケースも、Next.js + Cloudflare Workers の静的構成と Cloudflare R2 事例を織り交ぜた内容にすることでポートフォリオ全体のストーリー性を保つ。

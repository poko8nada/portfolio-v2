// ナビゲーション設定
export interface NavItem {
  label: string
  href: string
  isAnchor?: boolean
  icon?: string // アイコン名
  showIcon?: boolean // ラベルにアイコンを表示するか
  requiresConfirmation?: boolean // クリック前に確認が必要か
}

// ホームページ用ナビゲーション
export const homeLayoutNavItems: NavItem[] = [
  { label: 'Home', href: '/', isAnchor: false, icon: 'Home' },
  { label: 'About', href: '#about', isAnchor: true, icon: 'User' },
  { label: 'Posts', href: '#posts', isAnchor: true, icon: 'FileText' },
  { label: 'Works', href: '#works', isAnchor: true, icon: 'Wrench' },
  { label: 'Contact', href: '/contact', isAnchor: false, icon: 'Mail' },
]

// 全ページメニュー
export const allNavItems: NavItem[] = [
  { label: 'Home', href: '/', isAnchor: false, icon: 'Home' },
  { label: 'About', href: '/about', isAnchor: false, icon: 'User' },
  { label: 'Posts', href: '/posts', isAnchor: false, icon: 'FileText' },
  { label: 'Works', href: '/#works', isAnchor: false, icon: 'Wrench' },
  { label: 'Contact', href: '/contact', isAnchor: false, icon: 'Mail' },
]

/**
 * 現在のページかどうかを判定するユーティリティ
 */
export function isCurrentPage(href: string, currentPath: string): boolean {
  // 完全一致の場合
  if (href === currentPath) return true

  // アンカーリンクの場合は非アクティブ
  if (href.startsWith('#')) return false

  // 通常のパスの場合（例: /posts が /posts/123 にマッチ）
  if (href !== '/' && currentPath.startsWith(href)) return true

  return false
}

// ナビゲーション設定
export interface NavItem {
  label: string
  href: string
  isAnchor?: boolean
  icon?: string // モバイル用アイコン
  showIcon?: boolean // ラベルにアイコンを表示するか
  requiresConfirmation?: boolean // クリック前に確認が必要か
  isDialog?: boolean // ダイアログトリガーかどうか
}

// ホームページ用ナビゲーション（すべてアンカーリンク）
export const homeLayoutNavItems: NavItem[] = [
  { label: 'About', href: '#about', isAnchor: true, icon: 'User' },
  { label: 'Posts', href: '#posts', isAnchor: true, icon: 'FileText' },
  { label: 'Works', href: '#works', isAnchor: true, icon: 'Wrench' },
  {
    label: 'Resume',
    href: '/resume',
    isAnchor: false,
    icon: 'Lock',
    showIcon: true,
    requiresConfirmation: true,
  },
  { label: 'Contact', href: '/contact', isAnchor: false, icon: 'Mail', isDialog: true },
]

// 全ページメニュー（現在のページを除外するベース）
export const allNavItems: NavItem[] = [
  { label: 'Home', href: '/', isAnchor: false, icon: 'Home' },
  { label: 'Posts', href: '/posts', isAnchor: false, icon: 'FileText' },
  { label: 'Works', href: '/#works', isAnchor: false, icon: 'Wrench' },
  { label: 'About', href: '/about', isAnchor: false, icon: 'User' },
  {
    label: 'Resume',
    href: '/resume',
    isAnchor: false,
    icon: 'Lock',
    showIcon: true,
    requiresConfirmation: true,
  },
  { label: 'Contact', href: '/contact', isAnchor: false, icon: 'Mail', isDialog: true },
]

// 現在のページパスに基づいて適切なナビアイテムを返す
export function getNavItemsForPage(currentPath: string): NavItem[] {
  return allNavItems.filter(item => {
    // 現在のページのリンクを除外
    if (currentPath === '/' && item.href === '/') return false
    if (currentPath.startsWith('/posts') && item.href === '/posts') return false
    if (currentPath.startsWith('/about') && item.href === '/about') return false
    if (currentPath.startsWith('/resume') && item.href === '/resume')
      return false

    return true
  })
}

// 後方互換性のため
export const pagesLayoutNavItems = allNavItems

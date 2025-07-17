import Link from 'next/link'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { type IconName, NavIcon } from '@/components/ui/nav-icons'
import type { NavItem as NavItemType } from '@/lib/navigation'

export interface NavItemProps {
  item: NavItemType
  isActive: boolean
  isMobile: boolean
  onClick?: () => void
}

export function NavItem({ item, isActive, isMobile, onClick }: NavItemProps) {
  const iconStyles = isActive ? 'text-white' : 'text-fg group-hover:text-pr'
  const labelStyles = isActive
    ? 'text-xs text-white font-semibold'
    : 'text-xs text-fg group-hover:text-pr'

  // デスクトップ: アイコン+文字縦配置, モバイル: アイコンのみ
  const content = isMobile ? (
    <div className={iconStyles}>
      <NavIcon iconName={item.icon as IconName} filled={isActive} />
    </div>
  ) : (
    <div className='flex flex-col items-center space-y-1'>
      <div className={iconStyles}>
        <NavIcon iconName={item.icon as IconName} filled={isActive} />
      </div>
      <span className={labelStyles}>{item.label}</span>
    </div>
  )

  if (item.requiresConfirmation) {
    return (
      <ConfirmationDialog
        href={item.href}
        icon={item.icon as IconName}
        showIcon={item.showIcon}
        className={isMobile ? 'cursor-pointer' : ''}
      >
        {content}
      </ConfirmationDialog>
    )
  }

  if (item.isAnchor) {
    return (
      <button
        type='button'
        onClick={onClick}
        className={`group ${isMobile ? 'cursor-pointer' : ''} focus:outline-none transition-colors duration-200`}
        aria-current={isActive ? 'page' : undefined}
      >
        {content}
      </button>
    )
  }

  return (
    <Link
      href={item.href}
      className={`group ${isMobile ? 'cursor-pointer' : ''} transition-colors duration-200`}
      aria-current={isActive ? 'page' : undefined}
    >
      {content}
    </Link>
  )
}

'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, MenuItem } from '@/components/ui/navbar-menu'
import { NavIcon, type IconName } from '@/components/ui/nav-icons'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { homeLayoutNavItems, getNavItemsForPage } from '@/lib/navigation'
import { Nunito } from 'next/font/google'

interface HeaderProps {
  /** ホームページ用レイアウトの場合true */
  isHomePage?: boolean
}
const nunito = Nunito({ subsets: ['latin'] })

export default function Header({ isHomePage = false }: HeaderProps) {
  const pathname = usePathname()

  // ホームページかどうかでナビアイテムを切り替え
  const navItems = isHomePage
    ? homeLayoutNavItems
    : getNavItemsForPage(pathname)

  const handleAnchorClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      element?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <Menu>
      {/* プロフィール部分 */}
      <div className='flex items-center space-x-2 sm:space-x-3'>
        <Image
          src='/images/profile01.png'
          width={50}
          height={50}
          alt=''
          className='rounded-full'
        />
        <span
          className={`${nunito.className} text-fg font-bold text-md sm:text-xl`}
        >
          PokoHanadaCom
        </span>
      </div>

      {/* デスクトップナビゲーション */}
      <div className='hidden md:flex items-center space-x-4 '>
        {navItems.map(item => (
          <MenuItem key={item.label}>
            {item.requiresConfirmation ? (
              <ConfirmationDialog
                href={item.href}
                icon={item.icon as IconName}
                showIcon={item.showIcon}
              >
                {item.label}
              </ConfirmationDialog>
            ) : item.isAnchor ? (
              <button
                type='button'
                onClick={() => handleAnchorClick(item.href)}
                className='text-fg hover:text-pr transition-colors duration-200 cursor-pointer'
              >
                {item.label}
              </button>
            ) : (
              <Link
                href={item.href}
                className='text-fg hover:text-pr transition-colors duration-200'
              >
                {item.label}
              </Link>
            )}
          </MenuItem>
        ))}
      </div>

      {/* モバイルナビゲーション */}
      <div className='md:hidden flex items-center space-x-3'>
        {navItems.map(item => (
          <MenuItem key={item.label}>
            {item.requiresConfirmation ? (
              <ConfirmationDialog
                href={item.href}
                icon={item.icon as IconName}
                className='text-fg hover:text-pr cursor-pointer'
              >
                <NavIcon iconName={item.icon as IconName} />
              </ConfirmationDialog>
            ) : item.isAnchor ? (
              <button
                type='button'
                onClick={() => handleAnchorClick(item.href)}
                className='text-fg hover:text-pr cursor-pointer'
              >
                <NavIcon iconName={item.icon as IconName} />
              </button>
            ) : (
              <Link
                href={item.href}
                className='text-fg hover:text-pr cursor-pointer transition-colors duration-200'
              >
                <NavIcon iconName={item.icon as IconName} />
              </Link>
            )}
          </MenuItem>
        ))}
      </div>
    </Menu>
  )
}

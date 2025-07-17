'use client'
import { Nunito } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { type IconName, NavIcon } from '@/components/ui/nav-icons'
import { Menu, MenuItem } from '@/components/ui/navbar-menu'
import { getNavItemsForPage, homeLayoutNavItems } from '@/lib/navigation'
import { ContactDialog } from '@/components/contact-dialog'

interface HeaderProps {
  /** ホームページ用レイアウトの場合true */
  isHomePage?: boolean
  /** Turnstile site key */
  siteKey?: string
}
const nunito = Nunito({ subsets: ['latin'] })

export default function Header({ isHomePage = false, siteKey }: HeaderProps) {
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
          width={60}
          height={60}
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
            ) : item.label === 'Contact' && item.isDialog && siteKey ? (
              <ContactDialog className='text-fg hover:text-pr transition-colors duration-200' siteKey={siteKey}>
                {item.label}
              </ContactDialog>
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
            ) : item.label === 'Contact' && item.isDialog && siteKey ? (
              <ContactDialog className='text-fg hover:text-pr cursor-pointer' siteKey={siteKey}>
                <NavIcon iconName={item.icon as IconName} />
              </ContactDialog>
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

'use client'
import { Nunito } from 'next/font/google'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { NavItem } from '@/components/ui/nav-item'
import { Menu, MenuItem } from '@/components/ui/navbar-menu'
import {
  allNavItems,
  homeLayoutNavItems,
  isCurrentPage,
} from '@/lib/navigation'

const nunito = Nunito({ subsets: ['latin'] })

export default function Header() {
  const pathname = usePathname()

  // パス判定でナビアイテムを切り替え
  const isHomePage = pathname === '/'
  const navItems = isHomePage ? homeLayoutNavItems : allNavItems

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
      <div className='hidden md:flex items-center space-x-6'>
        {navItems.map(item => {
          const isActive = isCurrentPage(item.href, pathname)
          return (
            <MenuItem key={item.label}>
              <NavItem
                item={item}
                isActive={isActive}
                isMobile={false}
                onClick={
                  item.isAnchor ? () => handleAnchorClick(item.href) : undefined
                }
              />
            </MenuItem>
          )
        })}
      </div>

      {/* モバイルナビゲーション */}
      <div className='md:hidden flex items-center space-x-3'>
        {navItems.map(item => {
          const isActive = isCurrentPage(item.href, pathname)
          return (
            <MenuItem key={item.label}>
              <NavItem
                item={item}
                isActive={isActive}
                isMobile={true}
                onClick={
                  item.isAnchor ? () => handleAnchorClick(item.href) : undefined
                }
              />
            </MenuItem>
          )
        })}
      </div>
    </Menu>
  )
}

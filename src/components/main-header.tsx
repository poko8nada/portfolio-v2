'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, MenuItem } from '@/components/ui/navbar-menu'
import { NavIcon, type IconName } from '@/components/ui/nav-icons'
import { ConfirmationMenuItem } from '@/components/ui/confirmation-menu-item'
import { ConfirmationMobileMenuItem } from '@/components/ui/confirmation-mobile-menu-item'
import { homeLayoutNavItems } from '@/lib/navigation'

export default function MainHeader() {
  const handleAnchorClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      element?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <Menu>
      {/* プロフィール部分 */}
      <div className='flex items-center space-x-3'>
        <Image
          src='/images/profile01.png'
          width={32}
          height={32}
          alt=''
          className='rounded-full'
        />
        <span className='text-[--color-fg] font-medium hidden sm:block'>
          PokoHanadaCom
        </span>
      </div>

      {/* デスクトップナビゲーション */}
      <div className='hidden md:flex items-center space-x-6'>
        {homeLayoutNavItems.map(item => (
          <MenuItem key={item.label}>
            {item.requiresConfirmation ? (
              <ConfirmationMenuItem
                href={item.href}
                icon={item.icon as IconName}
                showIcon={item.showIcon}
              >
                {item.label}
              </ConfirmationMenuItem>
            ) : item.isAnchor ? (
              <button
                type='button'
                onClick={() => handleAnchorClick(item.href)}
                className='text-[--color-fg] hover:text-[--color-pr] transition-colors duration-200 cursor-pointer'
              >
                {item.label}
              </button>
            ) : (
              <Link
                href={item.href}
                className='text-[--color-fg] hover:text-[--color-pr] transition-colors duration-200'
              >
                {item.label}
              </Link>
            )}
          </MenuItem>
        ))}
      </div>

      {/* モバイルナビゲーション */}
      <div className='md:hidden flex items-center space-x-4'>
        {homeLayoutNavItems.map(item => (
          <MenuItem key={item.label}>
            {item.requiresConfirmation ? (
              <ConfirmationMobileMenuItem
                href={item.href}
                icon={item.icon as IconName}
              />
            ) : item.isAnchor ? (
              <button
                type='button'
                onClick={() => handleAnchorClick(item.href)}
                className='text-[--color-fg] hover:text-[--color-pr]'
              >
                <NavIcon iconName={item.icon as IconName} />
              </button>
            ) : (
              <Link
                href={item.href}
                className='text-[--color-fg] hover:text-[--color-pr]'
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

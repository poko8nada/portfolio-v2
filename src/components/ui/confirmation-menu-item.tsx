'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { NavIcon, type IconName } from '@/components/ui/nav-icons'

interface ConfirmationMenuItemProps {
  href: string
  icon?: IconName
  showIcon?: boolean
  children: React.ReactNode
  className?: string
}

export const ConfirmationMenuItem = ({
  href,
  icon,
  showIcon,
  children,
  className = 'text-[--color-fg] hover:text-[--color-pr] transition-colors duration-200',
}: ConfirmationMenuItemProps) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!showConfirm) {
      setShowConfirm(true)
      // 3秒後に自動的に非表示にする
      setTimeout(() => setShowConfirm(false), 3000)
    } else {
      router.push(href)
    }
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowConfirm(false)
  }

  if (showConfirm) {
    return (
      <div className='relative'>
        <button
          type='button'
          onClick={handleClick}
          className='text-green-500 hover:text-green-400 transition-colors duration-200 text-sm font-medium'
        >
          確認しますか？
        </button>
        <button
          type='button'
          onClick={handleCancel}
          className='ml-2 text-gray-400 hover:text-gray-300 text-xs'
        >
          ×
        </button>
      </div>
    )
  }

  return (
    <button type='button' onClick={handleClick} className={className}>
      <span className='flex items-center space-x-1'>
        {showIcon && icon && <NavIcon iconName={icon} className='w-4 h-4' />}
        <span>{children}</span>
      </span>
    </button>
  )
}

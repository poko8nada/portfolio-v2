'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { NavIcon, type IconName } from '@/components/ui/nav-icons'

interface ConfirmationMobileMenuItemProps {
  href: string
  icon: IconName
  className?: string
}

export const ConfirmationMobileMenuItem = ({
  href,
  icon,
  className = 'text-[--color-fg] hover:text-[--color-pr]',
}: ConfirmationMobileMenuItemProps) => {
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

  return (
    <button type='button' onClick={handleClick} className={className}>
      <NavIcon
        iconName={showConfirm ? 'Lock' : icon}
        className={showConfirm ? 'w-5 h-5 text-green-500' : 'w-5 h-5'}
      />
    </button>
  )
}

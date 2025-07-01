'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { NavIcon, type IconName } from '@/components/ui/nav-icons'

interface ConfirmationDialogProps {
  href: string
  icon?: IconName
  showIcon?: boolean
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
}

export const ConfirmationDialog = ({
  href,
  icon,
  showIcon,
  children,
  className = 'text-[--color-fg] hover:text-[--color-pr] transition-colors duration-200 cursor-pointer',
  title = '認証が必要です',
  description = 'このページにアクセスするには認証が必要です。続行しますか？',
}: ConfirmationDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsOpen(true)
  }

  const handleConfirm = () => {
    setIsOpen(false)
    router.push(href)
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  return (
    <>
      <button type='button' onClick={handleClick} className={className}>
        <span className='flex items-center space-x-1'>
          {showIcon && icon && <NavIcon iconName={icon} className='w-4 h-4' />}
          <span>{children}</span>
        </span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='sm:max-w-[425px] bg-bg border-bg-2 border-opacity-30'>
          <DialogHeader>
            <DialogTitle className='text-fg'>{title}</DialogTitle>
            <DialogDescription className='text-fg'>
              {description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={handleCancel}
              className='border-fg text-fg bg-transparent hover:bg-fg hover:text-bg transition-all'
            >
              キャンセル
            </Button>
            <Button
              onClick={handleConfirm}
              className='bg-pr text-white hover:bg-white hover:text-pr border-pr hover:border-pr transition-all'
            >
              続行
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

'use client'
import type React from 'react'
import { motion } from 'motion/react'

export const MenuItem = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className='cursor-pointer'
    >
      {children}
    </motion.div>
  )
}

export const Menu = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className='fixed top-4 left-1/2 transform -translate-x-1/2 z-50 
                 bg-bg/90 border border-bg-2
                 rounded-full px-3 py-3 shadow-lg flex items-center space-x-6'
    >
      {children}
    </motion.nav>
  )
}

export const HoveredLink = ({
  children,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: React.ReactNode
}) => {
  return (
    <a
      {...rest}
      className='text-[--color-fg] hover:text-[--color-pr] transition-colors duration-200'
    >
      {children}
    </a>
  )
}

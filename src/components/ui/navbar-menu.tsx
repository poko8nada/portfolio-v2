'use client'
import { motion } from 'motion/react'
import type React from 'react'

export const MenuItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className='cursor-pointer flex items-center justify-center w-fit h-fit'
    >
      {children}
    </motion.div>
  )
}

export const Menu = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className='fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[max-content]
                 bg-bg/90 border border-bg-2
                 rounded-full pl-3 pr-4 py-3 shadow-lg flex items-center gap-4 sm:gap-8 justify-between'
    >
      {children}
    </motion.nav>
  )
}

'use client'

import type React from 'react'

export function ProfileImage() {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  return (
    <div
      className='
        sm:absolute sm:top-38 sm:right-8
        sm:w-32 sm:h-40
        w-24 h-32
        mx-auto sm:mx-0
        mt-4 sm:mt-0
        border border-gray-300 bg-white
        flex items-center justify-center
        shadow-sm
        z-10
      '
    >
      <img
        src='/api/proxy-image?path=images/profile.png'
        alt='プロフィール写真'
        className='object-cover w-full h-full'
        draggable={false}
        onContextMenu={handleContextMenu}
      />
    </div>
  )
}

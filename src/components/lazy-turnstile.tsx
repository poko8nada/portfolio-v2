'use client'

import { ShieldCheckIcon } from '@heroicons/react/24/solid'
import { Turnstile } from '@marsidev/react-turnstile'
import { useState } from 'react'

type Props = {
  siteKey: string
  onSuccessAction: (token: string) => void
  onErrorAction?: () => void
}

export function LazyTurnstile({
  siteKey,
  onSuccessAction,
  onErrorAction,
}: Props) {
  const [shouldRender, setShouldRender] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadTurnstile = () => {
    setIsLoading(true)
    setShouldRender(true)
  }

  if (!shouldRender) {
    return (
      <div className='flex justify-center h-16'>
        <button
          type='button'
          onClick={handleLoadTurnstile}
          className='w-full max-w-xs flex items-center justify-center gap-2 rounded-md bg-green-700 px-4 py-2 text-white font-semibold shadow-lg border-1 border-white/80 outline-none focus-visible:ring-1 focus-visible:ring-white-300 hover:bg-green-800 transition-all disabled:cursor-not-allowed disabled:opacity-50'
          disabled={isLoading}
        >
          <ShieldCheckIcon className='w-5 h-5 text-white' />
          {isLoading ? '認証を読み込み中...' : 'セキュリティ認証を開始する'}
        </button>
      </div>
    )
  }

  return (
    <div className='flex justify-center h-16'>
      <Turnstile
        siteKey={siteKey}
        onSuccess={onSuccessAction}
        onError={onErrorAction}
        options={{ theme: 'dark' }}
      />
    </div>
  )
}

'use client'

import { Turnstile } from '@marsidev/react-turnstile'
import { useState } from 'react'

type Props = {
  siteKey: string
  onSuccessAction: (token: string) => void
  onErrorAction?: () => void
}

export function LazyTurnstile({ siteKey, onSuccessAction, onErrorAction }: Props) {
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
          className='px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors'
          disabled={isLoading}
        >
          {isLoading ? 'セキュリティ認証読み込み中...' : 'セキュリティ認証を開始'}
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

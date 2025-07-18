'use client'

import { useCallback, useEffect, useState } from 'react'

/**
 * sessionStorageを使用して状態を管理するカスタムフック
 * リロード時や画面遷移時にも値が保持される
 *
 * @param key sessionStorageのキー
 * @param initialValue 初期値
 * @returns [storedValue, setValue, removeValue]
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // SSR対応: 初期状態ではinitialValueを使用
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isInitialized, setIsInitialized] = useState(false)

  // クライアントサイドでsessionStorageから値を読み込み（初回のみ）
  useEffect(() => {
    if (isInitialized) return

    try {
      const item = window.sessionStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error(`sessionStorage read error for key "${key}":`, error)
    } finally {
      setIsInitialized(true)
    }
  }, [key, isInitialized])

  // 値を設定する関数
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        setStoredValue(currentValue => {
          // 関数の場合は現在の値を渡して実行
          const valueToStore =
            value instanceof Function ? value(currentValue) : value

          // sessionStorageに保存
          if (typeof window !== 'undefined') {
            window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
          }

          return valueToStore
        })
      } catch (error) {
        console.error(`sessionStorage write error for key "${key}":`, error)
      }
    },
    [key],
  )

  // 値を削除する関数
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(key)
      }
    } catch (error) {
      console.error(`sessionStorage remove error for key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

import { useEffect } from 'react'
import type { RefObject } from 'react'

export default function useResizeObserver<T extends HTMLElement>(
  ref: RefObject<T | null>,   
  callback: () => void
) {
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(callback)
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [ref, callback])
}

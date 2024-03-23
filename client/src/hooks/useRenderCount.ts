import { useRef } from 'react'

export default function useRenderCount(name?: string) {
  const ref = useRef(1)
  // console.log(`${name || ''}: ${ref.current++}`)
}

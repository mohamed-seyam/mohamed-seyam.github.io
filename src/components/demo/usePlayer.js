import { useCallback, useEffect, useState } from 'react'

// Scene player for the walkthrough demos: starts when the demo scrolls into
// view, and `go` jumps to a scene (bumping `run` so the same scene can replay).
export function usePlayer(ref, count) {
  const [playing, setPlaying] = useState(false)
  const [scene, setScene] = useState(0)
  const [run, setRun] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) { setPlaying(true); return undefined }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setPlaying(true), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [ref])

  const go = useCallback((i) => {
    setScene(((i % count) + count) % count)
    setRun((r) => r + 1)
  }, [count])

  return { playing, scene, run, go }
}

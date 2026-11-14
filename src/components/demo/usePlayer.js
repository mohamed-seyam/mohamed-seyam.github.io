import { useCallback, useEffect, useRef, useState } from 'react'

// Scene player for the walkthrough demos. It plays only while the demo is on
// screen: scrolling away pauses the running script, scrolling back resumes it.
// `go` jumps to a scene (bumping `run` so the same scene can replay).
export function usePlayer(ref, count) {
  const [visible, setVisible] = useState(false)
  const [started, setStarted] = useState(false)
  const [scene, setScene] = useState(0)
  const [run, setRun] = useState(0)
  const visibleRef = useRef(false)
  const waiters = useRef([])

  useEffect(() => {
    const show = (on) => {
      visibleRef.current = on
      setVisible(on)
      if (!on) return
      setStarted(true)
      waiters.current.splice(0).forEach((resolve) => resolve())
    }
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) { show(true); return undefined }
    const io = new IntersectionObserver(([e]) => show(e.isIntersecting), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [ref])

  const go = useCallback((i) => {
    setScene(((i % count) + count) % count)
    setRun((r) => r + 1)
  }, [count])

  // Runs one scene script and returns its cleanup. The script gets `wait(ms)`,
  // which also holds while the demo is off screen, and `live()`, false once
  // the scene has been left.
  const start = useCallback((script, onDone) => {
    let alive = true
    let timer
    const whenVisible = () => new Promise((resolve) => {
      if (visibleRef.current) resolve()
      else waiters.current.push(resolve)
    })
    const wait = (ms) => new Promise((resolve) => {
      timer = setTimeout(() => whenVisible().then(() => alive && resolve()), ms)
    })
    script({ wait, live: () => alive }).then(() => alive && onDone())
    return () => { alive = false; clearTimeout(timer) }
  }, [])

  return { started, paused: !visible, scene, run, go, start }
}

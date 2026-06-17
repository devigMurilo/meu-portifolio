import { useEffect } from 'react'
import Lenis from 'lenis'

export default function LenisScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.7,
      smoothTouch: false,
      touchMultiplier: 1.2,
    })

    function onFrame(time) {
      lenis.raf(time)
      requestAnimationFrame(onFrame)
    }
    requestAnimationFrame(onFrame)

    return () => {
      lenis.destroy()
    }
  }, [])

  return children
}

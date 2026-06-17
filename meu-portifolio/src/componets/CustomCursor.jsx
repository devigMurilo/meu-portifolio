import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)

  const springX = useSpring(cursorX, { stiffness: 200, damping: 30 })
  const springY = useSpring(cursorY, { stiffness: 200, damping: 30 })
  const dotSpringX = useSpring(dotX, { stiffness: 500, damping: 50 })
  const dotSpringY = useSpring(dotY, { stiffness: 500, damping: 50 })

  const isHovering = useRef(false)
  const scale = useMotionValue(1)

  useEffect(() => {
    const onMove = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      dotX.set(e.clientX)
      dotY.set(e.clientY)
    }

    const onHoverStart = (e) => {
      if (e.target.closest('a, button, [data-cursor]')) {
        isHovering.current = true
        scale.set(2.5)
      }
    }

    const onHoverEnd = () => {
      isHovering.current = false
      scale.set(1)
    }

    window.addEventListener('mousemove', onMove, { passive: true })

    document.addEventListener('mouseover', onHoverStart, { passive: true })
    document.addEventListener('mouseout', onHoverEnd, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onHoverStart)
      document.removeEventListener('mouseout', onHoverEnd)
    }
  }, [cursorX, cursorY, dotX, dotY, scale])

  return (
    <>
      <motion.div
        style={{
          position: 'fixed',
          left: springX,
          top: springY,
          x: '-50%',
          y: '-50%',
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: '1px solid rgba(229, 216, 192, 0.3)',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference',
          scale,
        }}
      />
      <motion.div
        style={{
          position: 'fixed',
          left: dotSpringX,
          top: dotSpringY,
          x: '-50%',
          y: '-50%',
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: '#E5D8C0',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference',
        }}
      />
    </>
  )
}

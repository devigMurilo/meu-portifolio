import { useEffect, useRef, useCallback } from 'react'
import { motion, useMotionValue, useTransform, useAnimationFrame } from 'framer-motion'

const LINE_COUNT = 12
const POINTS = 100

function TopographicLines() {
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const pathRefs = useRef([])
  const time = useRef(0)

  useEffect(() => {
    const onMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [mouseX, mouseY])

  const parallaxX = useTransform(mouseX, [0, 1], [-3, 3])
  const parallaxY = useTransform(mouseY, [0, 1], [-2, 2])

  const updatePaths = useCallback((t) => {
    time.current = t * 0.0008
    pathRefs.current.forEach((path, i) => {
      if (!path) return
      const parts = []
      const spreadY = 100 / (LINE_COUNT + 1)
      const baseY = spreadY * (i + 1)
      const freq1 = 0.04 + (i % 3) * 0.015
      const freq2 = 0.018 + (i % 4) * 0.008
      const amp = 1.5 + (i % 3) * 1.2
      const phaseOffset = i * 0.7
      const speed = 0.25 + (i % 5) * 0.06

      for (let j = 0; j <= POINTS; j++) {
        const x = (j / POINTS) * 100
        const wave1 = Math.sin(x * freq1 + time.current * speed + phaseOffset) * amp
        const wave2 = Math.sin(x * freq2 + time.current * speed * 0.5 + phaseOffset * 1.3) * amp * 0.5
        const wave3 = Math.sin(x * 0.01 + time.current * 0.1) * amp * 0.3
        const y = baseY + wave1 + wave2 + wave3
        parts.push(`${j === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
      }
      path.setAttribute('d', parts.join(' '))
    })
  }, [])

  useAnimationFrame(updatePaths)

  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        x: parallaxX,
        y: parallaxY,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', opacity: 0.08 }}
      >
        <defs>
          <linearGradient id="topoGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E5D8C0" stopOpacity="0" />
            <stop offset="20%" stopColor="#E5D8C0" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#E5D8C0" stopOpacity="0.5" />
            <stop offset="80%" stopColor="#E5D8C0" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#E5D8C0" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: LINE_COUNT }, (_, i) => (
          <path
            key={i}
            ref={(el) => { pathRefs.current[i] = el }}
            fill="none"
            stroke="url(#topoGrad)"
            strokeWidth={0.2}
            vectorEffect="non-scaling-stroke"
            style={{ opacity: 0.6 + (i / LINE_COUNT) * 0.4 }}
          />
        ))}
      </svg>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, transparent 20%, var(--bg-color) 100%)`,
          zIndex: 1,
        }}
      />
    </motion.div>
  )
}

export default TopographicLines

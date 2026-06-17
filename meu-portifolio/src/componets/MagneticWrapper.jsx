import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function MagneticWrapper({ children, strength = 0.3, as = 'div', ...props }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 250, damping: 18 })
  const springY = useSpring(y, { stiffness: 250, damping: 18 })

  const handleMouseMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    const maxDist = 100
    if (dist < maxDist) {
      const factor = (1 - dist / maxDist) * strength
      x.set(dx * factor)
      y.set(dy * factor)
    } else {
      x.set(0)
      y.set(0)
    }
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const Component = motion[as]

  return (
    <Component
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </Component>
  )
}

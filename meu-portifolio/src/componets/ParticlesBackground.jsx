import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function createCircleTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const ctx = canvas.getContext('2d')
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.6)')
  grad.addColorStop(0.3, 'rgba(229, 216, 192, 0.3)')
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 32, 32)
  return new THREE.CanvasTexture(canvas)
}

function getParticleCount() {
  const w = window.innerWidth
  if (w < 768) return 800
  if (w < 1024) return 1500
  return 2500
}

export default function ParticlesBackground() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const isMobile = window.innerWidth < 768
    const count = getParticleCount()
    const mouse = { x: 0, y: 0, z: 0 }
    const targetMouse = { x: 0, y: 0, z: 0 }

    const onMouseMove = (e) => {
      targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1
      targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    }

    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        targetMouse.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1
        targetMouse.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    const width = window.innerWidth
    const height = window.innerHeight
    const aspect = width / height

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100)
    camera.position.set(0, 0, 12)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

    const positions = new Float32Array(count * 3)
    const originalPositions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const phases = new Float32Array(count)
    const speedFactors = new Float32Array(count)
    const depths = new Float32Array(count)

    const color = new THREE.Color()

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const theta = Math.random() * Math.PI * 2
      const radius = 4 + Math.random() * 12
      const x = Math.cos(theta) * radius * 1.3
      const y = Math.sin(theta) * radius
      const z = (Math.random() - 0.5) * 6

      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z

      originalPositions[i3] = x
      originalPositions[i3 + 1] = y
      originalPositions[i3 + 2] = z

      velocities[i3] = 0
      velocities[i3 + 1] = 0
      velocities[i3 + 2] = 0

      sizes[i] = 0.04 + Math.random() * 0.08
      phases[i] = Math.random() * Math.PI * 2
      speedFactors[i] = 0.3 + Math.random() * 0.7
      depths[i] = 0.3 + Math.random() * 0.7
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.08 : 0.06,
      map: createCircleTexture(),
      color: '#E5D8C0',
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const clock = new THREE.Clock()
    let animationFrameId

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.03)
      const elapsed = clock.getElapsedTime()

      mouse.x += (targetMouse.x - mouse.x) * 0.06
      mouse.y += (targetMouse.y - mouse.y) * 0.06

      camera.position.x += (mouse.x * 0.4 - camera.position.x) * 0.03
      camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.03
      camera.lookAt(0, 0, 0)

      const camDist = camera.position.z
      const fovScale = Math.tan((camera.fov * Math.PI) / 360)
      const mouseWX = mouse.x * aspect * fovScale * camDist
      const mouseWY = mouse.y * fovScale * camDist

      const posAttr = geometry.attributes.position.array
      const attractRadius = 5
      const attractStrength = 0.015

      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const px = posAttr[i3]
        const py = posAttr[i3 + 1]
        const pz = posAttr[i3 + 2]
        const ox = originalPositions[i3]
        const oy = originalPositions[i3 + 1]
        const oz = originalPositions[i3 + 2]
        const depth = depths[i]
        const phase = phases[i]
        const speed = speedFactors[i]
        const dt = delta * 60

        const dx = px - mouseWX
        const dy = py - mouseWY
        const dz = pz - 0
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < attractRadius && dist > 0.01) {
          const force = (1 - dist / attractRadius) * attractStrength * depth * dt
          velocities[i3] -= (dx / dist) * force * 0.3
          velocities[i3 + 1] -= (dy / dist) * force * 0.3
          velocities[i3 + 2] -= (dz / dist) * force * 0.3
        }

        const driftX = Math.sin(elapsed * 0.3 * speed + phase) * 0.0015 * depth
        const driftY = Math.cos(elapsed * 0.25 * speed + phase * 1.3) * 0.0015 * depth
        const driftZ = Math.sin(elapsed * 0.2 * speed + phase * 0.7) * 0.001 * depth

        const ret = 0.015 * depth
        const damp = 0.92

        velocities[i3] += (ox - px) * ret + driftX
        velocities[i3 + 1] += (oy - py) * ret + driftY
        velocities[i3 + 2] += (oz - pz) * ret + driftZ

        velocities[i3] *= damp
        velocities[i3 + 1] *= damp
        velocities[i3 + 2] *= damp

        posAttr[i3] += velocities[i3]
        posAttr[i3 + 1] += velocities[i3 + 1]
        posAttr[i3 + 2] += velocities[i3 + 2]
      }

      geometry.attributes.position.needsUpdate = true
      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(tick)
    }

    tick()

    const onResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    }

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animationFrameId)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: '#0D0D0D',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(229, 216, 192, 0.008) 1px, transparent 1px),
            linear-gradient(90deg, rgba(229, 216, 192, 0.008) 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px',
          backgroundPosition: 'center',
          pointerEvents: 'none',
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
          zIndex: 1,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />
    </div>
  )
}

import { motion } from "framer-motion"
import { useState } from "react"

function TiltGlowCard({ icon, title, description }) {

  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [glow, setGlow] = useState({ x: 0, y: 0, visible: false })

  const handleMove = (e) => {

    const rect = e.currentTarget.getBoundingClientRect()

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = -(y - centerY) / 12
    const rotateY = (x - centerX) / 12

    setTilt({ rotateX, rotateY })
    setGlow({ x, y, visible: true })
  }

  const handleLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 })
    setGlow({ x: 0, y: 0, visible: false })
  }

  return (

    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}

      animate={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        scale: 1.05
      }}

      transition={{ type: "spring", stiffness: 200, damping: 15 }}

      style={{ transformStyle: "preserve-3d" }}

      className="relative bg-white p-8 rounded-xl shadow-md hover:shadow-2xl transition cursor-pointer overflow-hidden will-change-transform text-center"
    >

      {/* Cursor Glow */}

      {glow.visible && (

        <div
          className="pointer-events-none absolute w-52 h-52 bg-blue-400/20 rounded-full blur-3xl transition"
          style={{
            left: glow.x - 100,
            top: glow.y - 100
          }}
        />

      )}

      <div className="relative z-10">

        <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>

        <h3 className="font-semibold mb-2">
          {title}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>

      </div>

    </motion.div>

  )
}

export default TiltGlowCard
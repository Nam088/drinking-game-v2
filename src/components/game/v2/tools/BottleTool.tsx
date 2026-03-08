import { useState, useRef, useEffect } from "react"

export const BottleTool = () => {
  const [isAnimating, setIsAnimating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const [currentRotation, setCurrentRotation] = useState(0)

  const drawBottle = (ctx: CanvasRenderingContext2D, cx: number, cy: number, rotation: number) => {
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(rotation)

    // Bottle coordinates (approximate from SVG)
    ctx.fillStyle = "#10b981" // emerald-500
    ctx.shadowColor = "rgba(16, 185, 129, 0.4)"
    ctx.shadowBlur = 15

    // Bottle body (shifted up by ~25px to center the rotation axis)
    ctx.beginPath()
    ctx.moveTo(-10, -75) // neck top
    ctx.lineTo(10, -75)
    ctx.lineTo(10, -45) // neck bottom
    ctx.bezierCurveTo(20, -35, 25, -15, 25, 5) // shoulder
    ctx.lineTo(25, 55) // straight right
    ctx.bezierCurveTo(25, 65, 15, 70, 0, 70) // bottom right
    ctx.bezierCurveTo(-15, 70, -25, 65, -25, 55) // bottom left
    ctx.lineTo(-25, 5) // straight left
    ctx.bezierCurveTo(-25, -15, -20, -35, -10, -45) // shoulder left
    ctx.closePath()
    ctx.fill()

    // Add some reflections / details
    ctx.shadowBlur = 0
    ctx.strokeStyle = "rgba(255,255,255,0.4)"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(-15, 5)
    ctx.lineTo(-15, 55)
    ctx.stroke()
    
    // Neck line
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(-10, -60)
    ctx.lineTo(10, -60)
    ctx.stroke()

    ctx.restore()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    if (!isAnimating) {
      // Draw static
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawBottle(ctx, canvas.width / 2, canvas.height / 2, currentRotation)
      return
    }

    // Animation variables
    let startTime: number | null = null
    const duration = 4000 // 4 seconds to spin
    
    // Target rotation is current + X full spins + random offset
    const randomOffset = Math.random() * Math.PI * 2
    const totalSpins = Math.PI * 2 * 10 // 10 spins
    const targetRotation = currentRotation + totalSpins + randomOffset

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Cubic ease out for smooth slowing down
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const rotation = currentRotation + (targetRotation - currentRotation) * easeOut

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawBottle(ctx, canvas.width / 2, canvas.height / 2, rotation)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
        setCurrentRotation(targetRotation % (Math.PI * 2)) // Normalize mapping
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isAnimating, currentRotation])

  const handleBottleSpin = () => {
    if (isAnimating) return
    setIsAnimating(true)
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4 overflow-hidden">
      <h3 className="text-xl font-black text-emerald-400 uppercase tracking-widest">Xoay Chai</h3>
      
      <div className="relative w-64 h-64 rounded-full border border-slate-700/50 flex items-center justify-center bg-slate-800/20 shadow-inner">
         <div className="absolute inset-2 rounded-full border-4 border-dashed border-slate-700/30 animate-[spin_10s_linear_infinite]" />
         
         <canvas 
          ref={canvasRef} 
          width={250} 
          height={250} 
          className="absolute inset-0 m-auto"
        />
      </div>

      <button 
        onClick={handleBottleSpin}
        disabled={isAnimating}
        className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-full transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100 tracking-wider shadow-lg shadow-emerald-500/30"
      >
        XOAY CHAI
      </button>
    </div>
  )
}

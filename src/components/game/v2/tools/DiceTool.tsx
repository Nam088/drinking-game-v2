import { useState, useRef, useEffect } from "react"

export const DiceTool = () => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [diceResult, setDiceResult] = useState<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  const drawDice = (ctx: CanvasRenderingContext2D, value: number, x: number, y: number, size: number, rotation: number, scale: number) => {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rotation)
    ctx.scale(scale, scale)

    // Draw background
    ctx.fillStyle = "white"
    ctx.shadowColor = "rgba(99, 102, 241, 0.4)"
    ctx.shadowBlur = 20
    ctx.shadowOffsetY = 10
    ctx.beginPath()
    ctx.roundRect(-size / 2, -size / 2, size, size, 20)
    ctx.fill()
    ctx.shadowColor = "transparent"

    // Draw outline
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 4
    ctx.stroke()

    // Draw dots
    ctx.fillStyle = "#1e293b"
    const dotSize = size * 0.1
    const offset = size * 0.25

    const drawDot = (dx: number, dy: number) => {
      ctx.beginPath()
      ctx.arc(dx, dy, dotSize, 0, Math.PI * 2)
      ctx.fill()
    }

    if ([1, 3, 5].includes(value)) drawDot(0, 0)
    if ([2, 3, 4, 5, 6].includes(value)) {
      drawDot(-offset, -offset)
      drawDot(offset, offset)
    }
    if ([4, 5, 6].includes(value)) {
      drawDot(offset, -offset)
      drawDot(-offset, offset)
    }
    if (value === 6) {
      drawDot(-offset, 0)
      drawDot(offset, 0)
    }

    ctx.restore()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    if (!isAnimating && diceResult === null) {
      // Idle state
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawDice(ctx, 6, canvas.width / 2, canvas.height / 2, 120, 0, 1)
      return
    }

    if (!isAnimating && diceResult) {
      // Final result
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawDice(ctx, diceResult, canvas.width / 2, canvas.height / 2, 120, 0, 1)
      return
    }

    // Animation state
    let startTime: number | null = null
    const duration = 1500

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Random value during roll
      const randomValue = Math.floor(Math.random() * 6) + 1
      
      // Calculate rotation and bounce
      const rotation = progress * Math.PI * 10 // Rotate multiple times
      const bounce = Math.abs(Math.sin(progress * Math.PI * 5)) * 30 // Bouncing effect
      const scale = 1 - Math.abs(Math.sin(progress * Math.PI * 5)) * 0.2 // Slight scale down on bounce

      drawDice(ctx, randomValue, canvas.width / 2, canvas.height / 2 - bounce, 120, rotation, scale)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        const finalResult = Math.floor(Math.random() * 6) + 1
        setDiceResult(finalResult)
        setIsAnimating(false)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawDice(ctx, finalResult, canvas.width / 2, canvas.height / 2, 120, 0, 1)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isAnimating, diceResult])

  const handleDiceRoll = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setDiceResult(null)
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <h3 className="text-xl font-black text-indigo-400 uppercase tracking-widest">Đổ Xúc Xắc</h3>
      
      <div className="relative w-48 h-48 flex items-center justify-center">
        <canvas 
          ref={canvasRef} 
          width={200} 
          height={200} 
          className="max-w-full"
        />
      </div>

      <button 
        onClick={handleDiceRoll}
        disabled={isAnimating}
        className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-full transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100 tracking-wider shadow-lg shadow-indigo-500/30"
      >
        LẮC XÚC XẮC
      </button>
    </div>
  )
}

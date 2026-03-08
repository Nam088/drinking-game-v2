import { useState, useRef, useEffect } from "react"

export const RngTool = () => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [rngMax, setRngMax] = useState<number>(10)
  const [rngDisplay, setRngDisplay] = useState<number | string>("?")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  const drawSlot = (ctx: CanvasRenderingContext2D, text: string, yOffset: number, blur: number) => {
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    
    ctx.clearRect(0, 0, width, height)
    
    // Background glow
    ctx.shadowColor = "rgba(59, 130, 246, 0.5)"
    ctx.shadowBlur = blur
    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.font = "900 64px sans-serif"
    
    // Draw text with vertical offset for scrolling effect
    // We draw multiple copies to loop
    ctx.fillText(text, width / 2, height / 2 + yOffset)
    if (yOffset > 0) ctx.fillText(text, width / 2, height / 2 + yOffset - height)
    if (yOffset < 0) ctx.fillText(text, width / 2, height / 2 + yOffset + height)
    
    ctx.shadowColor = "transparent"
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    if (!isAnimating) {
      drawSlot(ctx, rngDisplay.toString(), 0, 30)
      return
    }

    let startTime: number | null = null
    const duration = 2000
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Fast scrolling offset
      const speed = (1 - progress) * 100
      const yOffset = (elapsed * speed * 0.1) % canvas.height
      
      // Random number while spinning
      const randomNum = Math.floor(Math.random() * rngMax) + 1
      
      drawSlot(ctx, randomNum.toString(), yOffset, speed)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        const finalNum = Math.floor(Math.random() * rngMax) + 1
        setRngDisplay(finalNum)
        setIsAnimating(false)
        drawSlot(ctx, finalNum.toString(), 0, 30)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isAnimating, rngDisplay, rngMax])

  const handleRng = () => {
    if (isAnimating || rngMax < 2) return
    setIsAnimating(true)
    setRngDisplay("?")
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <h3 className="text-xl font-black text-blue-400 uppercase tracking-widest text-center">Random<br/>Number</h3>
      
      <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-xl border border-slate-700">
        <span className="text-slate-400 font-bold ml-2">Từ 1 đến</span>
        <input 
          type="number" 
          min="2" 
          max="999" 
          value={rngMax} 
          onChange={(e) => setRngMax(Number(e.target.value) || 2)}
          className="bg-slate-900 text-white font-black text-xl w-20 text-center py-2 rounded-lg border-2 border-slate-600 outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <div className="w-32 h-32 rounded-full border-4 border-blue-500 bg-slate-900 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] overflow-hidden">
        <canvas 
          ref={canvasRef} 
          width={120} 
          height={120} 
        />
      </div>

      <button 
        onClick={handleRng}
        disabled={isAnimating || rngMax < 2}
        className="mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100 tracking-wider shadow-lg shadow-blue-500/30"
      >
        QUAY SỐ
      </button>
    </div>
  )
}

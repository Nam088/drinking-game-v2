import { useState, useRef, useEffect } from "react"

export const CoinTool = () => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [coinResult, setCoinResult] = useState<"SẤP" | "NGỬA" | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  const drawCoin = (ctx: CanvasRenderingContext2D, isHeads: boolean, x: number, y: number, size: number, scaleY: number) => {
    ctx.save()
    ctx.translate(x, y)
    
    // The scaleY gives the 3D flipping effect
    // We limit it slightly so it never has 0 height completely (looks better)
    const effectiveScaleY = Math.abs(scaleY) < 0.05 ? 0.05 : scaleY
    
    // Scale vertically
    ctx.scale(1, effectiveScaleY)

    // Determine current face based on the sign of scaleY
    const isFrontVisible = scaleY > 0
    const currentFaceHeads = isFrontVisible ? isHeads : !isHeads

    // Draw coin body
    ctx.beginPath()
    ctx.arc(0, 0, size / 2, 0, Math.PI * 2)
    
    if (currentFaceHeads) {
      // Ngửa face
      const grad = ctx.createLinearGradient(-size/2, -size/2, size/2, size/2)
      grad.addColorStop(0, "#fcd34d") // amber-300
      grad.addColorStop(1, "#f97316") // orange-500
      ctx.fillStyle = grad
      ctx.fill()
      ctx.lineWidth = 6
      ctx.strokeStyle = "#fde68a" // amber-200
      ctx.stroke()

      // Text
      ctx.scale(1, Math.sign(scaleY)) // Ensure text is not upside down
      ctx.fillStyle = "white"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.font = "900 24px sans-serif"
      ctx.shadowColor = "rgba(0,0,0,0.3)"
      ctx.shadowBlur = 4
      ctx.shadowOffsetY = 2
      ctx.fillText("NGỬA", 0, 0)
      ctx.font = "900 10px sans-serif"
      ctx.fillStyle = "rgba(255,255,255,0.7)"
      ctx.fillText("V2", 0, -30)

    } else {
      // Sấp face
      const grad = ctx.createLinearGradient(-size/2, -size/2, size/2, size/2)
      grad.addColorStop(0, "#cbd5e1") // slate-300
      grad.addColorStop(1, "#64748b") // slate-500
      ctx.fillStyle = grad
      ctx.fill()
      ctx.lineWidth = 6
      ctx.strokeStyle = "#e2e8f0" // slate-200
      ctx.stroke()

      // Text
      ctx.scale(1, Math.sign(scaleY)) // Ensure text is not upside down
      ctx.fillStyle = "white"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.font = "900 24px sans-serif"
      ctx.shadowColor = "rgba(0,0,0,0.5)"
      ctx.shadowBlur = 4
      ctx.shadowOffsetY = 2
      ctx.fillText("SẤP", 0, 0)
      ctx.font = "900 10px sans-serif"
      ctx.fillStyle = "rgba(255,255,255,0.7)"
      ctx.fillText("V2", 0, -30)
    }

    ctx.restore()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    if (!isAnimating && coinResult === null) {
      // Idle state - shows NGỬA
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawCoin(ctx, true, canvas.width / 2, canvas.height / 2, 120, 1)
      return
    }

    if (!isAnimating && coinResult) {
      // Final result
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawCoin(ctx, coinResult === "NGỬA", canvas.width / 2, canvas.height / 2, 120, 1)
      return
    }

    // Animation state
    let startTime: number | null = null
    const duration = 2000
    
    // Decide final result before starting
    const targetIsHeads = Math.random() > 0.5
    // Calculate total flips (odd for change, even for same if starting Ngửa)
    // Actually, scaleY goes from 1 to -1 to 1 
    // cos(theta) gives us the scaleY
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // easeOut function
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      // Total rotations: e.g. 5.5 = 11 half-flips
      // the exact ending angle determines the face. 
      // If we want it to end on targetIsHeads: 
      // Target angle = N * 2PI (if target is Ngửa) or N * 2PI + PI (if Sấp)
      const targetAngle = (10 * Math.PI * 2) + (targetIsHeads ? 0 : Math.PI)
      
      const currentAngle = easeOut * targetAngle
      const scaleY = Math.cos(currentAngle)
      
      // Bounce effect on throw
      const bounceY = Math.sin(progress * Math.PI) * 50

      // We pass true as base to mean "base is Heads"
      drawCoin(ctx, true, canvas.width / 2, canvas.height / 2 - bounceY, 120, scaleY)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setCoinResult(targetIsHeads ? "NGỬA" : "SẤP")
        setIsAnimating(false)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawCoin(ctx, targetIsHeads, canvas.width / 2, canvas.height / 2, 120, 1)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isAnimating, coinResult])

  const handleCoinFlip = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCoinResult(null)
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <h3 className="text-xl font-black text-amber-400 uppercase tracking-widest">Lật Đồng Xu</h3>
      
      <div className="relative w-48 h-48 flex items-center justify-center">
        <canvas 
          ref={canvasRef} 
          width={200} 
          height={200} 
          className="max-w-full drop-shadow-[0_10px_30px_rgba(251,191,36,0.2)]"
        />
      </div>

      <div className="h-8">
        {!isAnimating && coinResult && (
          <p className="text-2xl font-black text-white px-4 py-1 bg-slate-800 rounded-lg border border-slate-700 shadow-md animate-in fade-in slide-in-from-bottom-2">
            KẾT QUẢ: <span className={coinResult === "NGỬA" ? "text-amber-400" : "text-slate-300"}>{coinResult}</span>
          </p>
        )}
      </div>

      <button 
        onClick={handleCoinFlip}
        disabled={isAnimating}
        className="mt-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold py-3 px-8 rounded-full transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100 tracking-wider shadow-lg shadow-orange-500/30"
      >
        TUNG ĐỒNG XU
      </button>
    </div>
  )
}

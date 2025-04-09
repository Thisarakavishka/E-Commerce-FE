import { useEffect, useState, useRef } from "react"

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
}

const AnimatedCounter = ({ value, duration = 300, className = "" }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0)
  const previousValueRef = useRef(0)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    // Don't animate on initial render if value is 0
    if (value === 0 && previousValueRef.current === 0) {
      setCount(0)
      return
    }

    // Store the previous value for comparison
    const previousValue = previousValueRef.current
    previousValueRef.current = value

    // Cancel any existing animation
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current)
    }

    // Animation function
    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smoother animation
      const easeOutQuad = (t: number) => t * (2 - t)
      const easedProgress = easeOutQuad(progress)

      // Calculate the current count value
      const currentCount = Math.floor(previousValue + (value - previousValue) * easedProgress)
      setCount(currentCount)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Ensure we end with the exact target value
        setCount(value)
        startTimeRef.current = null
        animationRef.current = null
      }
    }

    // Start the animation
    animationRef.current = requestAnimationFrame(animate)

    // Cleanup function
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [value, duration])

  return <span className={className}>{count}</span>
}

export default AnimatedCounter

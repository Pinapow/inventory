import { useEffect, useRef } from 'react'
import { useMotionValue, useTransform, animate, useInView, motion } from 'motion/react'

interface NumberTickerProps {
  value: number
  direction?: 'up' | 'down'
  delay?: number
  duration?: number
  className?: string
}

export function NumberTicker({
  value,
  direction = 'up',
  delay = 0,
  duration = 1,
  className,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === 'down' ? value : 0)
  const rounded = useTransform(motionValue, (latest) => Math.round(latest))
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (isInView) {
      animate(motionValue, direction === 'down' ? 0 : value, {
        duration,
        delay,
        ease: 'easeOut',
      })
    }
  }, [motionValue, isInView, delay, value, direction, duration])

  useEffect(() => {
    const unsubscribe = rounded.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat('fr-FR').format(latest)
      }
    })
    return () => unsubscribe()
  }, [rounded])

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={isInView ? { opacity: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.5, delay }}
    >
      {Intl.NumberFormat('fr-FR').format(direction === 'down' ? value : 0)}
    </motion.span>
  )
}

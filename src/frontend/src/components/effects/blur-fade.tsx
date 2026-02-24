import { useRef } from 'react'
import { motion, useInView, type Variant } from 'motion/react'

interface BlurFadeProps {
  children: React.ReactNode
  className?: string
  variant?: {
    hidden: Variant
    visible: Variant
  }
  duration?: number
  delay?: number
  yOffset?: number
  blur?: string
  inView?: boolean
}

export function BlurFade({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  blur = '6px',
  inView = false,
}: BlurFadeProps) {
  const ref = useRef(null)
  const inViewResult = useInView(ref, { once: true, margin: '-50px' })
  const isInView = !inView || inViewResult

  const defaultVariants = {
    hidden: {
      y: yOffset,
      opacity: 0,
      filter: `blur(${blur})`,
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
    },
  }

  const combinedVariants = variant || defaultVariants

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      exit="hidden"
      variants={combinedVariants}
      transition={{
        delay: 0.04 + delay,
        duration,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

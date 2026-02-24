import { motion, type Variants } from 'motion/react'
import { cn } from '@/lib/utils'

interface StaggeredListProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (custom: { staggerDelay: number }) => ({
    opacity: 1,
    transition: {
      staggerChildren: custom.staggerDelay,
    },
  }),
}

const itemVariants: Variants = {
  hidden: (custom: { yOffset: number }) => ({
    opacity: 0,
    y: custom.yOffset,
    filter: 'blur(4px)',
  }),
  visible: (custom: { duration: number }) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: custom.duration,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
}

export function StaggeredList({
  children,
  className,
  staggerDelay = 0.06,
}: StaggeredListProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      custom={{ staggerDelay }}
    >
      {children}
    </motion.div>
  )
}

export function StaggeredItem({
  children,
  className,
  duration = 0.4,
  yOffset = 20,
}: {
  children: React.ReactNode
  className?: string
  duration?: number
  yOffset?: number
}) {
  return (
    <motion.div
      className={cn(className)}
      variants={itemVariants}
      custom={{ duration, yOffset }}
    >
      {children}
    </motion.div>
  )
}

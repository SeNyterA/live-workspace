import { motion, useMotionValue, useTransform } from 'framer-motion'

export default function AboutMe() {
  return (
    <div className='absolute inset-0 flex items-center justify-center text-7xl text-slate-800'>
      <motion.div className='flex gap-4 font-bold'
      wh>
        <motion.span>Hi,I'm </motion.span>
        <motion.p className='text-blue-500'>Khang</motion.p>
      </motion.div>
    </div>
  )
}

import { ScrollArea } from '@mantine/core'
import { motion } from 'framer-motion'
import React from 'react'

export default function Exprience() {
  return (
    <div className='absolute inset-0 flex overflow-y-scroll'>
      <motion.div className='flex-1 space-y-2'>
        {Array.from({ length: 1000 }).map((_, i) => (
          <div className='h-20 bg-slate-300 flex items-center justify-center'>{i}</div>
        ))}
      </motion.div>
      <motion.div className='flex-1 space-y-2'>
        {Array.from({ length: 1000 }).map((_, i) => (
          <div className='h-20 bg-blue-300 flex items-center justify-center'>{i}</div>
        ))}
      </motion.div>
    </div>
  )
}

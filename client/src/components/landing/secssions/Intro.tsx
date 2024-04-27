import { motion } from 'framer-motion'

export default function Intro() {
  return (
    <motion.div
      className='intro left-10 top-1/2 h-[125px]'
      style={{
        translateY: '-50%'
      }}
      initial={{ opacity: 0, translateX: -100 }}
      whileInView={{
        scale: [1, 1.05, 1],
        transition: { duration: 0.5 },
        opacity: 1,
        translateX: 0
      }}
    >
      <div className='intro-text'>
        &nbsp;
        <span className='text-9xl'>S</span>
        <span>eNyter'A</span>
        <sup className='text-3xl'>.online</sup>
        &nbsp;
      </div>
      <motion.div
        className='intro-text-overlay'
        // initial={{ width: 0 }}
        // whileInView={{ width: '100%' }}
      >
        &nbsp;
        <span className='text-9xl'>S</span>
        <span>eNyter'A</span>
        <sup className='text-3xl'>.online</sup>
        &nbsp;
      </motion.div>
    </motion.div>
  )
}

import { motion } from 'framer-motion'

export default function Intro() {
  return (
    <div className='absolute inset-10 flex items-center justify-end'>
      <video
        autoPlay
        loop
        muted
        playsInline
        // src='https://cdn.dribbble.com/userupload/12527312/file/original-d62ced1c569e1807f46bf766de030300.mp4'
        src='https://cdn.dribbble.com/userupload/9207058/file/original-f14c5106e44e357cc94b0b0be2cff04a.mp4'
        className='absolute inset-0 h-full rounded-3xl object-cover blur-[4px]'
      />
      <motion.div
        className='intro absolute left-1/2 h-[125px]'
        initial={{ opacity: 0, translateX: '-80%' }}
        whileInView={{
          scale: [1, 1.05, 1],
          transition: { duration: 0.5 },
          opacity: 1,
          translateX: '-50%'
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
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
        >
          &nbsp;
          <span className='text-9xl'>S</span>
          <span>eNyter'A</span>
          <sup className='text-3xl'>.online</sup>
          &nbsp;
        </motion.div>
      </motion.div>
    </div>
  )
}

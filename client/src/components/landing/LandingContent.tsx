import { motion } from 'framer-motion'
import './landing.scss'

const Intro = () => {
  return (
    <>
      <div className='content relative flex h-screen flex-col bg-black/80 text-black'>
        <div />
        <div className='absolute left-20'>
          <div className='intro relative'>
            <motion.div
              data-text="&nbsp;SeNyter'A&nbsp;"
              className='h-36 text-7xl font-bold text-transparent relative'
              animate={{
                // WebkitTextStrokeColor: ['#000', '#fff', '#000'],
                // WebkitTextStrokeWidth: '1px',
                // transition: {
                //   duration: 5,
                //   repeat: Infinity,
                //   repeatType: 'loop'
                // }
              }}
            >
              &nbsp;
              <span className='text-9xl'>S</span>
              <span>eNyter'A</span>
              <sup className='text-xl'>.online</sup>
              &nbsp;
            </motion.div>

            <div
              data-text="&nbsp;SeNyter'A&nbsp;"
              className='intro-overlay absolute top-0 h-36 bg-gradient-to-r from-blue-400 via-yellow-500 to-indigo-900 bg-clip-text text-7xl font-bold text-transparent'
            >
              &nbsp;
              <span className='text-9xl'>S</span>
              <span>eNyter'A</span>
              <sup className='text-xl'>.online</sup>
              &nbsp;
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const Features = () => {
  return (
    <motion.div
      data-none
      className='content relative'
      // initial={{ opacity: 0, backgroundColor: '#fff' }}
      // whileInView={{ opacity: 1, backgroundColor: '#000000' }}
    >
      <div data-none />
      <div className='absolute bottom-10 left-10 max-w-[600px] rounded-[20px] bg-red-500  p-10 text-5xl leading-[110%]'>
        <p className='text-6xl font-semibold'>Live Workspace</p>
        <mark className='rounded-lg p-2'>
          The simple workspace for everyone easy to use
        </mark>
      </div>
    </motion.div>
  )
}

export default function LandingContent() {
  return (
    <>
      <Intro />
      <Features />
    </>
  )
}

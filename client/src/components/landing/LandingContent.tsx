import { motion } from 'framer-motion'
import './landing.scss'

const Intro = () => {
  return (
    <>
      <div className='fixed inset-0 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-blue-500 to-90% bg-cover bg-center bg-no-repeat blur' />

      <div className='fixed inset-0 bg-[url(/auth-bg.jpg)] bg-cover bg-center bg-no-repeat blur' />
      <div className='section relative flex h-screen flex-col bg-black/80 text-black'>
        <div className='absolute left-20'>
          <div className='intro relative'>
            <p
              data-text="&nbsp;SeNyter'A&nbsp;"
              className='intro-text z-10 text-7xl font-bold text-transparent'
            >
              &nbsp;
              <span className='text-9xl'>S</span>
              <span>eNyter'A</span>
              <sup className='text-xl'>.online</sup>
              &nbsp;
            </p>

            <p
              data-text="&nbsp;SeNyter'A&nbsp;"
              className='intro-overlay absolute top-0 z-10 bg-gradient-to-r from-blue-400 via-yellow-500 to-indigo-900 bg-clip-text text-7xl font-bold text-transparent'
            >
              &nbsp;
              <span className='text-9xl'>S</span>
              <span>eNyter'A</span>
              <sup className='text-xl'>.online</sup>
              &nbsp;
            </p>
          </div>

          <p className='welcome ml-8 max-w-[600px] bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 bg-clip-text text-2xl text-gray-400 hover:text-transparent'>
            A realtime comprehensive workspace for efficient task, channel,
            group, and board management.
          </p>
        </div>

        {/* <video
        autoPlay
        loop
        muted
        playsInline
        src='intro.webm'
        className='ml-auto h-full w-[500px] object-cover'
      /> */}
      </div>
    </>
  )
}

const Features = () => {
  return (
    <motion.div
      className='section relative h-screen  text-black'
      initial={{ opacity: 0, backgroundColor: '#fff' }}
      whileInView={{ opacity: 1, backgroundColor: '#000000' }}
    />
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

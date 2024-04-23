import { motion } from 'framer-motion'
import './landing.scss'
import { IconBrandGithub } from '@tabler/icons-react'

const Intro = () => {
  return (
    <div className='content flex h-screen flex-col bg-black/80 p-10 text-black'>
      <div className='relative h-full w-full overflow-hidden rounded-[20px]'>
        <div className='flex items-center justify-between gap-3 p-4 font-semibold'>
          <motion.a className='flex flex-1 items-center rounded-xl border-none px-3 py-1.5 font-semibold text-slate-900 outline-0 no-underline' href='https://github.com/SeNyterA' >
            <IconBrandGithub size={24} /> @SeNyterA
          </motion.a>

          <p>Login</p>
          <motion.button
            className='h-8 rounded-lg border-none bg-black px-3 text-gray-50 outline-0 ring-offset-2 hover:backdrop-blur-2xl hover:ring-1'
            whileInView={{
              scale: [1, 1.1, 1],
              translateY: [-3, 0],
              transition: { duration: 0.4 }
            }}
          >
            Register
          </motion.button>
        </div>
        <motion.div
          data-text="&nbsp;SeNyter'A&nbsp;"
          className='absolute left-20 top-[50%] h-36 bg-gradient-to-r from-blue-900 via-yellow-900 to-indigo-900 bg-clip-text text-7xl font-bold text-transparent hover:drop-shadow-[1000px]'
          initial={{ translateY: '-50%' }}
          whileInView={{
            scale: [1, 1.1, 1],
            transition: { duration: 0.4 }
          }}
        >
          &nbsp;
          <span className='text-9xl'>S</span>
          <span>eNyter'A</span>
          <sup className='text-xl'>.online</sup>
          &nbsp;
        </motion.div>
      </div>
    </div>
  )
}

const Features = () => {
  return (
    <div className='content relative flex h-screen flex-col bg-black/80 text-black'>
      <div />
      <div className='text-5xl font-semibold mix-blend-luminosity'>
        <p>Live workspace</p>
      </div>
    </div>
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

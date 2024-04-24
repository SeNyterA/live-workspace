import { motion, useMotionValue, useTransform } from 'framer-motion'
import './landing.scss'
import { IconBrandGithub, IconX } from '@tabler/icons-react'

const Intro = () => {
  const x = useMotionValue(0)
  const background = useTransform(
    x,
    [-100, 0, 100],
    ['#ff008c', '#03141e', 'rgb(230, 255, 0)']
  )

  const rotate = useTransform(x, [-100, 0, 100], ['-45deg', '0deg', '45deg'])

  return (
    <div className='content flex h-screen flex-col bg-black/80 p-10 text-black'>
      <div className='relative h-full w-full overflow-hidden rounded-[20px]'>
        <div className='flex items-center justify-between gap-3 p-4 font-semibold'>
          <motion.a
            className='flex flex-1 items-center rounded-xl border-none px-3 py-1.5 font-semibold text-slate-900 no-underline outline-0'
            href='https://github.com/SeNyterA'
          >
            <IconBrandGithub size={24} /> <span className='ml-2'>SeNyterA</span>
          </motion.a>

          <p>Login</p>
          <motion.button
            className='h-8 rounded-lg border-none bg-black px-3 text-gray-50 outline-0 ring-offset-2 hover:ring-1 hover:backdrop-blur-2xl'
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
          style={{ background, translateX: '-50%' }}
          className='absolute bottom-10 left-1/2 z-10 gap-10 rounded-2xl bg-blend-screen backdrop-brightness-105'
        >
          <motion.div
            className='flex h-12 w-12 items-center justify-center rounded-2xl text-white'
            drag='x'
            dragConstraints={{ left: 0, right: 0 }}
            style={{ x, rotate, color: background }}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 15 }}
          >
            <IconX size={40} />
          </motion.div>
        </motion.div>

        <motion.div
          className='intro left-10 top-1/2'
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
          <div className='intro-text-overlay'>
            &nbsp;
            <span className='text-9xl'>S</span>
            <span>eNyter'A</span>
            <sup className='text-3xl'>.online</sup>
            &nbsp;
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const Features = () => {
  return (
    <div className='content absolute inset-0 bg-clip-padding'>
      <div
        data-none
        className='absolute inset-10 rounded-[20px] bg-black/90'
      ></div>
    </div>
  )
}

export default function LandingContent() {
  return (
    <>
      <Intro />
      {/* <Features /> */}
    </>
  )
}

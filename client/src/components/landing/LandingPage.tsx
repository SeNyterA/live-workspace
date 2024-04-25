import { IconPlus } from '@tabler/icons-react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { SwipeCarousel } from './Silde'
import './landing.scss'

const Intro = () => {
  const x = useMotionValue(0)

  const rotate = useTransform(
    x,
    [-120, -100, 100, 120],
    ['-1125deg', '0deg', '0deg', '1125deg']
  )

  return (
    <div className='backgroudConic fixed inset-0 p-10 text-slate-950'>
      {/* <AnimatePresence initial={false}>
        <motion.div
          className='bgConicContainer relative h-full w-full overflow-hidden rounded-[20px]'
          style={{
            translateX: x
          }}
          drag='x'
          variants={{
            enter: (direction: number) => {
              console.log(direction)
              return {
                x: direction > 0 ? 100 : -100,
                opacity: 0
              }
            },
            center: {
              zIndex: 1,
              x: 0,
              opacity: 1
            },
            exit: (direction: number) => {
              console.log(direction)
              return {
                zIndex: 0,
                x: direction < 0 ? 100 : -100,
                opacity: 0
              }
            }
          }}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity, delta, point }) => {
            console.log({ e, offset, velocity, delta, point })
            // const swipe = swipePower(offset.x, velocity.x)
            // if (swipe < -swipeConfidenceThreshold) {
            //   paginate(1)
            // } else if (swipe > swipeConfidenceThreshold) {
            //   paginate(-1)
            // }
          }}
        >
          <motion.div
            className='intro left-10 top-1/2 h-[140px]'
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
        </motion.div>
      </AnimatePresence> */}

      <SwipeCarousel />

      {/* <div className='fixed left-10 right-10 top-10 flex items-center justify-between gap-3 p-4 font-semibold'>
        <motion.a
          className='flex flex-1 items-center rounded-xl border-none px-3 py-1.5 font-semibold text-slate-950 no-underline outline-0'
          href='https://github.com/SeNyterA'
        >
          <IconBrandGithub size={24} /> <span className='ml-2'>SeNyterA</span>
        </motion.a>

        <p>Login</p>
        <motion.button
          className='h-8 rounded-lg border-none bg-slate-950 px-3 text-gray-50 outline-0 ring-offset-2 hover:ring-1'
          whileInView={{
            scale: [1, 1.1, 1],
            translateY: [-3, 0],
            transition: { duration: 0.4 }
          }}
        >
          Register
        </motion.button>
      </div> */}

      <div className='fixed bottom-20 left-1/2 z-50 flex translate-x-[-50%] gap-28'>
        <motion.div className='flex h-12 w-12 items-center justify-center rounded-2xl text-gray-600'>
          <IconPlus size={40} />
        </motion.div>

        <motion.div className='relative h-12 w-12 rounded-2xl bg-blend-screen ring-offset-2 hover:ring-2'>
          <motion.div
            className='absolute inset-0 flex items-center justify-center text-slate-950'
            style={{ rotate }}
          >
            <IconPlus size={40} />
          </motion.div>

          <motion.div
            className='flex h-12 w-12 cursor-grab items-center justify-center rounded-2xl bg-slate-950 text-gray-600'
            drag='x'
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            style={{
              x,
              filter: 'drop-shadow(0 0 4px #000000aa)'
            }}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 15 }}
          />
        </motion.div>

        <motion.div className='flex h-12 w-12 items-center justify-center rounded-2xl text-gray-600'>
          <IconPlus size={40} />
        </motion.div>
      </div>
    </div>
  )
}

export default function LandingContent() {
  return <Intro />
}

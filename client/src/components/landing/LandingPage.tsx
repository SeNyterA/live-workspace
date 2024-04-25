import { IconBrandGithub, IconPlus } from '@tabler/icons-react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useState } from 'react'
import './landing.scss'
import { Chip } from './Chip'
import { TextParallaxContentExample } from './ScrollContent'

const DRAG_BUFFER = 100
const SPRING_OPTIONS = {
  type: 'spring',
  mass: 3,
  stiffness: 400,
  damping: 50
}

export const tabs = ['Intro', 'About me', 'Exprience', 'Projects', 'Contact']

const Intro = () => {
  const [imgIndex, setImgIndex] = useState(0)
  const dragX = useMotionValue(0)

  const onDragEnd = () => {
    const x = dragX.get()
    if (x <= -DRAG_BUFFER && imgIndex < tabs.length - 1) {
      setImgIndex(pv => pv + 1)
    } else if (x >= DRAG_BUFFER && imgIndex > 0) {
      setImgIndex(pv => pv - 1)
    }
  }

  const rotate = useTransform(
    dragX,
    [-120, -DRAG_BUFFER, DRAG_BUFFER, 120],
    ['-1125deg', '0deg', '0deg', '1125deg']
  )

  return (
    <motion.div
      className='backgroudConic fixed inset-0 p-10 text-slate-950'
      animate={{
        paddingTop: imgIndex == 0 ? 40 : 48,
        paddingBottom: imgIndex == 0 ? 40 : 80
      }}
    >
      <div className='relative h-full overflow-hidden rounded-3xl'>
        <motion.div
          drag='x'
          dragConstraints={{
            left: 0,
            right: 0
          }}
          style={{
            x: dragX
          }}
          animate={{
            translateX: `calc(-${imgIndex * 100}% - ${imgIndex * 16}px)`
          }}
          transition={SPRING_OPTIONS}
          onDragEnd={onDragEnd}
          // onDrag={onDrag}
          className='flex h-full cursor-grab items-center space-x-4 active:cursor-grabbing'
        >
          {tabs.map((_, idx) => {
            return (
              <motion.div
                key={idx}
                animate={{
                  scale: imgIndex === idx ? 1 : 0.97
                }}
                transition={SPRING_OPTIONS}
                className={`relative h-full w-full shrink-0 rounded-xl object-cover ${imgIndex === idx && 'bgConicContainer'}`}
              >
                {idx == 0 && (
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
                )}
                {idx == 2 && <TextParallaxContentExample />}
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      <motion.div
        className='fixed flex h-12 items-center justify-between gap-3 font-semibold bg-blend-lighten'
        initial={{ translateY: -10, opacity: 0 }}
        animate={{
          top: imgIndex == 0 ? 44 : 0,
          left: imgIndex == 0 ? 52 : 40,
          right: imgIndex == 0 ? 52 : 40
        }}
        whileInView={{
          translateY: 0,
          opacity: 1
        }}
      >
        <motion.a
          className='flex items-center rounded-xl border-none px-3 py-1.5 font-semibold text-slate-950 no-underline outline-0'
          href='https://github.com/SeNyterA'
          animate={{
            scale: imgIndex == 0 ? 1.2 : 1.4,
            fontWeight: imgIndex == 0 ? 'bold' : 'semibold',
            opacity: imgIndex == 0 ? 0 : 1
          }}
        >
          <span className='ml-2'>SeNyterA</span>
        </motion.a>

        <div className='flex flex-wrap items-center gap-2'>
          {tabs.map((tab, index) => (
            <Chip
              text={tab}
              selected={imgIndex === index}
              setSelected={() => setImgIndex(index)}
              key={tab}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        className='fixed left-1/2 z-50 flex translate-x-[-50%] gap-28'
        animate={{
          bottom: imgIndex == 0 ? 80 : 16
        }}
      >
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
            onDragEnd={onDragEnd}
            // onDrag={onDrag}
            onChange={e => console.log(e)}
            className='flex h-12 w-12 cursor-grab items-center justify-center rounded-2xl bg-slate-950 text-gray-600'
            drag='x'
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            style={{
              x: dragX,
              filter: 'drop-shadow(0 0 4px #000000aa)'
            }}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 15 }}
          />
        </motion.div>

        <motion.div
          className='flex h-12 w-12 items-center justify-center rounded-2xl text-gray-600'
          onClick={() =>
            setImgIndex(index => (index + 1 > tabs.length - 1 ? 0 : index + 1))
          }
        >
          <IconPlus size={40} />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default function LandingContent() {
  return <Intro />
}

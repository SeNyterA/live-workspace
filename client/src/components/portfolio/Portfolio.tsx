import {
  IconChevronLeft,
  IconChevronRight,
  IconPlus
} from '@tabler/icons-react'
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform
} from 'framer-motion'
import { useState } from 'react'
import { Chip } from './common/Chip'
import MouseIcon from './common/MouseIcon'
import './portfolio.scss'
import AboutMe from './secssions/AboutMe'
import Contact from './secssions/Contact'
import Intro from './secssions/Intro'

const DRAG_BUFFER = 100
const SPRING_OPTIONS = {
  type: 'spring',
  mass: 3,
  stiffness: 400,
  damping: 50
}

export const tabs = ['Intro', 'Skills & Exprience', 'Contact']

export default function Portfolio() {
  const [imgIndex, setImgIndex] = useState(0)
  const dragX = useMotionValue(0)
  const dragButton = useMotionValue(0)

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

  useMotionValueEvent(dragButton, 'change', e => dragX.set(-e))

  return (
    <motion.div
      className='backgroudConic fixed inset-0 text-slate-950'
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
          className='flex h-full cursor-grab items-center space-x-4 active:cursor-grabbing'
        >
          {tabs.map((_, idx) => {
            return (
              <motion.div
                key={idx}
                animate={{
                  scale: imgIndex === idx ? 1 : 1
                }}
                transition={SPRING_OPTIONS}
                className={`relative h-full w-full shrink-0 overflow-hidden rounded-3xl !bg-white/60 object-cover ${idx == 0 ? ' from-blue-500/20 via-white/100 to-yellow-500/40' : 'bg-white/60'}`}
              >
                {idx == 0 && <Intro />}
                {idx == 1 && <AboutMe />}
                {idx == 2 && <Contact />}
                {/* {idx == 2 && <Project />} */}
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      <motion.div
        className='absolute flex h-12 items-center justify-between gap-3 bg-blend-lighten'
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
          <motion.span className='ml-2 bg-gradient-to-r from-blue-900 via-yellow-900 to-indigo-900 bg-clip-text text-transparent mix-blend-lighten'>
            <span className='text-xl'>S</span>eNyterA
          </motion.span>
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
        className='absolute left-1/2 z-50 flex gap-28'
        initial={{ bottom: 80, translateY: 20, translateX: '-50%', opacity: 0 }}
        animate={{
          bottom: imgIndex == 0 ? 80 : 16
        }}
        whileInView={{
          translateY: 0,
          opacity: 1,
          translateX: '-50%'
        }}
      >
        <motion.div
          className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl opacity-70 ${imgIndex == 0 && 'pointer-events-none opacity-40'}`}
          onClick={() =>
            setImgIndex(index => (index - 1 < 0 ? tabs.length - 1 : index - 1))
          }
        >
          <IconChevronLeft size={40} />
        </motion.div>

        <motion.div className='relative h-12 w-12 rounded-2xl bg-blend-screen'>
          <motion.div
            className='absolute inset-0 flex items-center justify-center text-slate-950'
            style={{ rotate }}
          >
            <IconPlus size={40} />
          </motion.div>

          <motion.div
            onDragEnd={onDragEnd}
            onChange={e => console.log(e)}
            className='flex h-12 w-12 cursor-grab items-center justify-center rounded-2xl bg-slate-950'
            drag='x'
            dragConstraints={{ left: 0, right: 0 }}
            // dragElastic={0.2}
            style={{
              x: dragButton,
              filter: 'drop-shadow(0 0 4px #000000aa)'
            }}
            onDragLeave={e => console.log(e)}
            whileDrag={{
              scale: 1.05
            }}
            whileHover={{
              scale: 1.05
            }}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 15 }}
          />
        </motion.div>

        <motion.div
          className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl opacity-70 ${imgIndex == tabs.length - 1 && 'pointer-events-none opacity-40'}`}
          onClick={() =>
            setImgIndex(index => (index + 1 > tabs.length - 1 ? 0 : index + 1))
          }
        >
          <IconChevronRight size={40} />
        </motion.div>
      </motion.div>

      {imgIndex > 0 && <MouseIcon />}
    </motion.div>
  )
}

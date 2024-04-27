import { IconDownload } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import Exprience from './Exprience'
import Skills from './Skills'

export default function AboutMe() {
  return (
    <div className='absolute inset-0 flex items-center justify-center gap-10 p-10 text-slate-800 text-justify'>
      <div className='relative flex-1'>
        <motion.p className='text-5xl font-bold'>N.D.Khang</motion.p>
        <div className='animated-text relative'
        style={{
          WebkitTextStroke: '1px #000000',
        }}
        >
          I'm a <span></span>
        </div>
        <p className='max-w-2xl cursor-text'>
          I am a <span className='text-lime-600'>Fullstack Developer</span> with{' '}
          <span className='text-blue-600'>over 2 years</span> of experience in
          creating robust and user-friendly web applications. I have a proven
          track record of using{' '}
          <span className='text-lime-600'>NodeJS (NestJS)</span> for developing
          scalable backends and{' '}
          <span className='text-lime-600'>ReactJS (NextJS)</span> for building
          engaging frontends. I possess expertise in{' '}
          <span className='text-blue-400'>TypeScript</span>,{' '}
          <span className='text-blue-400'>RESTful APIs</span>,
          <span className='text-blue-400'>GraphQL</span>, and database
          technologies. My passion lies in developing high-quality, maintainable
          software that delivers exceptional user experiences.
        </p>
        <motion.button
          className='mt-2 flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border-none bg-slate-700 px-4 text-white outline-none hover:bg-slate-950'
          initial={{ opacity: 0, translateX: -1000 }}
          animate={{ opacity: 1, translateX: 0 }}
          whileHover={{
            filter: 'drop-shadow(0 0 4px #000000aa)',
            scale: 1.05
          }}
          onClick={() => {
            window.open(
              '/NguyenDucKhang.pdf'
            )
          }}
        >
          <IconDownload size={16} />
          CV
        </motion.button>
      </div>

      <div className='relative h-full flex-[2] 2xl:flex-[2] overflow-hidden rounded-2xl bg-red-50'>
        <Skills />
      </div>
    </div>
  )
}

import { IconDownload } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import Skills from './Skills'

export default function AboutMe() {
  return (
    <div className='absolute inset-0 overflow-scroll p-10 text-justify text-slate-800'>
      <div className='flex h-full w-full items-center gap-10'>
        <div className='relative flex-1'>
          <motion.p className='text-5xl font-bold'>N.D.Khang</motion.p>
          <div
            className='animated-text relative'
            style={
              {
                // WebkitTextStroke: '1px #000000'
              }
            }
          >
            I'm a <span></span>
          </div>
          <p className='max-w-2xl cursor-text'>
            I'm a{' '}
            <span className='font-semibold text-blue-600'>
              Full-Stack Developer
            </span>{' '}
            with <span className='font-semibold text-blue-600'>2+ years</span>{' '}
            of experience in creating scalable web applications. My skills
            include <span className='font-semibold text-blue-600'>NodeJS</span>{' '}
            (<span className='font-semibold text-blue-600'>NestJS</span>),{' '}
            <span className='font-semibold text-blue-600'>ReactJS</span>(
            <span className='font-semibold text-blue-600'>NextJS</span>),{' '}
            <span className='font-semibold text-blue-600'>TypeScript</span>,{' '}
            <span className='font-semibold text-blue-600'>RESTful APIs</span>,{' '}
            <span className='font-semibold text-blue-600'>GraphQL</span>, and{' '}
            <span className='font-semibold text-blue-600'>
              database technologies
            </span>
            . I'm passionate about building user-centric software with
            exceptional user experiences. My workflow is optimized through{' '}
            <span className='font-semibold text-blue-600'>Git</span>,{' '}
            <span className='font-semibold text-blue-600'>Docker</span>,{' '}
            <span className='font-semibold text-blue-600'>AWS</span> and{' '}
            <span className='font-semibold text-blue-600'>
              Agile/Scrum methodologies
            </span>
            . I'm seeking a challenging opportunity to contribute my skills to a
            fast-paced and innovative team.
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
              window.open('/NguyenDucKhang.pdf')
            }}
          >
            <IconDownload size={16} />
            CV
          </motion.button>
        </div>

        <video
          autoPlay
          loop
          muted
          playsInline
          src='/develop.mp4'
          className='ml-auto aspect-square max-h-[100%] overflow-hidden rounded-2xl object-cover'
        />
      </div>

      <div className='relative h-full overflow-hidden rounded-2xl bg-red-50 2xl:flex-[2]'>
        <Skills />
      </div>
    </div>
  )
}

import { useEventListener } from '@mantine/hooks'
import { IconDownload } from '@tabler/icons-react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform
} from 'framer-motion'
import { useLayoutEffect, useRef, useState } from 'react'

export default function AboutMe() {
  const skillsRef = useRef<HTMLDivElement>(null)
  const projectsRef = useRef<HTMLDivElement>(null)
  const viewPortRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)

  const { scrollYProgress: scrollSkillsYProgress, scrollY } = useScroll({
    target: skillsRef,
    axis: 'y',
    container: viewPortRef,
    layoutEffect: true,
    offset: ['start start', 'end end']
  })

  useMotionValueEvent(scrollY, 'change', () => {
    const height = viewPortRef?.current?.clientHeight
    if (!height) return
    setPage(Math.round(scrollY.get() / height))
  })

  useLayoutEffect(() => {
    const scrollTrigger = viewPortRef?.current?.addEventListener(
      'scrollend',
      e => {
        const height = viewPortRef?.current?.clientHeight
        if (!height) return
        if (Math.round(scrollY.get() / height) > 2) return
        // viewPortRef.current?.scrollTo({
        //   top: Math.round(scrollY.get() / height) * height,
        //   behavior: 'smooth'
        // })
      }
    )
    if (!scrollTrigger) return
    return () => {
      viewPortRef?.current?.removeEventListener('scrollend', scrollTrigger)
    }
  }, [])

  return (
    <>
      <div className='absolute bottom-2 left-1/2 z-50 flex translate-x-[-50%] items-center gap-2 text-sm font-semibold uppercase'>
        <div className='h-0.5 w-10 bg-black' />
        {page == 0 ? 'About Me' : page <= 2 ? 'Skills' : 'Experience'}
        <div className='h-0.5 w-10 bg-black' />
      </div>

      <div
        className='absolute inset-0 overflow-x-hidden overflow-y-scroll scroll-smooth text-justify text-slate-800'
        ref={viewPortRef}
      >
        <div className='flex h-full items-center gap-10 p-10'>
          <div className='flex-1'>
            <motion.p className='text-5xl font-bold'>N.D.Khang</motion.p>
            <div className='animated-text relative'>
              I'm a <span></span>
            </div>
            <p className='max-w-2xl cursor-text'>
              I'm a{' '}
              <span className='font-semibold text-blue-600'>
                Full-Stack Developer
              </span>{' '}
              with <span className='font-semibold text-blue-600'>2+ years</span>{' '}
              of experience in creating scalable web applications. My skills
              include{' '}
              <span className='font-semibold text-blue-600'>NodeJS</span> (
              <span className='font-semibold text-blue-600'>NestJS</span>),{' '}
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
              . I'm seeking a challenging opportunity to contribute my skills to
              a fast-paced and innovative team.
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
            src='https://cdn.dribbble.com/userupload/10476878/file/original-6f168c2501cd23f5344e2a847122ac26.mp4'
            className='aspect-square h-full overflow-hidden rounded-2xl object-cover'
          />
        </div>

        <div className='flex h-full items-center gap-10 p-10'>
          <video
            autoPlay
            loop
            muted
            playsInline
            src='https://cdn.dribbble.com/userupload/12695681/file/original-fa27c05d79d2f61e77453c02398f1859.mp4'
            className='aspect-square h-full overflow-hidden rounded-2xl object-cover'
          />
          <motion.div className='flex-1 flex-col items-center justify-center rounded-xl text-sm xl:text-base'>
            <p className='text-2xl font-semibold'>Frontend</p>
            <p>
              I am a skilled creator committed to designing engaging web and
              mobile experiences that prioritize user satisfaction. I possess
              expertise in advanced technologies like{' '}
              <span className='text-lime-600'>ReactJS</span> ,{' '}
              <span className='text-lime-600'>NextJS</span> and{' '}
              <span className='text-lime-600'>React Native</span> which I
              utilize to build complex, high-performance applications. With a
              strong foundation and the necessary skills, I adeptly tackle the
              challenges of frontend development, leveraging my expertise and
              supplementary libraries to execute projects swiftly and
              efficiently.
            </p>

            <ul>
              <li>
                Deep understanding of{' '}
                <span className='text-lime-600'>React Hook</span> and system
                optimization techniques to ensure optimal performance and user
                experience.
              </li>
              <li>
                For building basic and advanced web structures, a strong command
                of <span className='text-lime-600'>HTML</span>,{' '}
                <span className='text-lime-600'>CSS</span>,{' '}
                <span className='text-lime-600'>SCSS</span>,{' '}
                <span className='text-lime-600'>Responsive</span> and{' '}
                <span className='text-lime-600'>TailwindCSS</span> is essential.
              </li>
              <li>
                Utilize popular UI libraries such as{' '}
                <span className='text-lime-600'>Ant Design</span>,{' '}
                <span className='text-lime-600'>MaterialUI</span>, and{' '}
                <span className='text-lime-600'>Mantine</span> to create
                visually appealing and intuitive user interfaces.
              </li>
              <li>
                Specialized in handling and managing state management,
                particularly <span className='text-lime-600'>Redux</span>, for
                complex systems.
              </li>
              <li>
                Mastered <span className='text-lime-600'>Axios</span>,{' '}
                <span className='text-lime-600'>RESTful API</span> (
                <span className='text-lime-600'>SWR</span>,{' '}
                <span className='text-lime-600'>ReactQuery</span>) and
                <span className='text-lime-600'>Graphql</span> (
                <span className='text-lime-600'>ApolloClient</span>) for
                efficient data access.
              </li>
            </ul>
          </motion.div>
        </div>

        <div className='flex h-full items-center gap-10 p-10'>
          <motion.div className='flex-1 flex-col items-center justify-center rounded-xl text-sm xl:text-base'>
            <p className='text-2xl font-semibold'>Backend</p>
            <p>
              I have a specialization in developing robust and real-time
              systems. Building high-performance server-side solutions is my
              passion and I use <span className='text-lime-600'>NodeJS</span>{' '}
              and <span className='text-lime-600'>NestJS</span> to create APIs
              and backend services that meet the highest standards of
              performance and scalability. My expertise also includes designing
              and implementing
              <span className='text-lime-600'>RESTful APIs</span> and{' '}
              <span className='text-lime-600'>GraphQL</span> to facilitate
              flexible and efficient data access. With my extensive experience,
              I have a proven track record of optimizing application speed and
              building real-time functionalities to provide exceptional user
              experiences.
            </p>

            <ul>
              <li>
                Adept at using ORM frameworks such as{' '}
                <span className='text-lime-600'>TypeORM</span>,{' '}
                <span className='text-lime-600'>Prisma</span> for efficient data
                modeling and seamless database interaction with{' '}
                <span className='text-lime-600'>MySQL</span>,{' '}
                <span className='text-lime-600'>PostgreSQL</span>, and{' '}
                <span className='text-lime-600'>MongoDB</span>.
              </li>
              <li>
                Implement real-time features using{' '}
                <span className='text-lime-600'>SocketIO</span> and leverage{' '}
                <span className='text-lime-600'>Redis</span> for caching and
                data storage optimization.
              </li>
              <li>
                Proficient in both Object-Oriented Programming (OOP), Functional
                Programming, and Design Patterns.
              </li>
              <li>
                Using tools like <span className='text-lime-600'>Docker</span>,{' '}
                <span className='text-lime-600'>AWS</span>, and{' '}
                <span className='text-lime-600'>Nginx</span> for development and
                deployment processes, management, and automation.
              </li>
              <li>
                Having a comprehensive knowledge of information security
                practices is crucial.
              </li>
            </ul>
          </motion.div>

          <video
            autoPlay
            loop
            muted
            playsInline
            src='/develop.mp4'
            className='aspect-square h-full overflow-hidden rounded-2xl object-cover'
          />
        </div>

        <div className='projects flex relative h-full gap-10 p-10'>
        <video
            autoPlay
            loop
            muted
            playsInline
            src='https://cdn.dribbble.com/userupload/7610900/file/original-e95e0b10875ec267692fa079cb3c1122.mp4'
            className='aspect-square h-full overflow-hidden rounded-2xl object-cover'
          />
          <motion.div className='flex-1 z-50 flex-col rounded-xl text-sm xl:text-base'>
            <p className='text-2xl font-semibold'>TGL Solutions</p>
            <p>
              I have been working as a Full-Stack Developer intern since May
              2022, and I transitioned to full-time in August 2022. I work for a
              company that specializes in outsourcing services for the Japanese
              market. My primary responsibilities include participating in
              product development projects and outsourcing services for the
              Japanese market.
              {/* I work on both front-end and back-end tasks to
              ensure the quality and performance of the products, and I
              collaborate closely with cross-functional teams to deliver
              high-quality solutions that meet our clients' requirements. */}
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}

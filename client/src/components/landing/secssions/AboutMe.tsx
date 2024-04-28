import { IconDownload } from '@tabler/icons-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLayoutEffect, useRef } from 'react'

export default function AboutMe() {
  const skillsRef = useRef<HTMLDivElement>(null)
  const projectsRef = useRef<HTMLDivElement>(null)
  const viewPortRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress: scrollSkillsYProgress, scrollY } = useScroll({
    target: skillsRef,
    axis: 'y',
    container: viewPortRef,
    layoutEffect: true,
    offset: ['start start', 'end end']
  })

  const skillsX = useTransform(
    scrollSkillsYProgress,
    [0.25, 0.75],
    ['0%', '-100%']
  )

  useLayoutEffect(() => {
    const scrollTrigger = viewPortRef?.current?.addEventListener(
      'scrollend',
      e => {
        const height = viewPortRef?.current?.clientHeight

        if (!height) return
        if (Math.round(scrollY.get() / height) > 2) return
        viewPortRef.current?.scrollTo({
          top: Math.round(scrollY.get() / height) * height,
          behavior: 'smooth'
        })
      }
    )
    if (!scrollTrigger) return
    return () => {
      viewPortRef?.current?.removeEventListener('scrollend', scrollTrigger)
    }
  }, [])

  return (
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
            <span className='text-lime-600'>ReactJS</span> and{' '}
            <span className='text-lime-600'>NextJS</span>, which I utilize to
            build complex, high-performance applications. With a strong
            foundation and the necessary skills, I adeptly tackle the challenges
            of frontend development, leveraging my expertise and supplementary
            libraries to execute projects swiftly and efficiently.
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
              <span className='text-lime-600'>Mantine</span> to create visually
              appealing and intuitive user interfaces.
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
              <span className='text-lime-600'>ApolloClient</span>) for efficient
              data access.
            </li>
          </ul>
        </motion.div>
      </div>

      <div className='flex h-full items-center gap-10 p-10'>
        <motion.div className='flex-1 flex-col items-center justify-center rounded-xl text-sm xl:text-base'>
          <p className='text-2xl font-semibold'>Backend</p>
          <p>
            I have a specialization in developing robust and real-time systems.
            Building high-performance server-side solutions is my passion and I
            use <span className='text-lime-600'>NodeJS</span> and{' '}
            <span className='text-lime-600'>NestJS</span> to create APIs and
            backend services that meet the highest standards of performance and
            scalability. My expertise also includes designing and implementing
            <span className='text-lime-600'>RESTful APIs</span> and{' '}
            <span className='text-lime-600'>GraphQL</span> to facilitate
            flexible and efficient data access. With my extensive experience, I
            have a proven track record of optimizing application speed and
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
              <span className='text-lime-600'>Redis</span> for caching and data
              storage optimization.
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
              Having a comprehensive knowledge of information security practices
              is crucial.
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

      <div className='relative h-[400%] text-sm' ref={projectsRef}>
        <motion.div className='gap-4 p-10'>
          <div className='w-full flex-col items-center justify-center rounded-xl bg-blue-100 p-2'>
            <p className='text-xl'>Realtime workspace</p>
            <p>
              The development of a comprehensive real-time workspace system
              focused on integrating chat functionality, notifications, and task
              management features. Crafted using a cutting-edge tech stack
              including NestJS and ReactJS. With a strong emphasis on speed and
              efficiency, the system ensured optimal performance and
              responsiveness, enabling swift and seamless interactions within
              the workspace environment.
            </p>

            <ul>
              <li>
                Frontend: for effective state management, Redux was employed,
                guaranteeing smooth and predictable handling of the application
                state. Additionally, React Query, fully supported with
                TypeScript, was integrated to enhance data fetching and caching.
                A modern, responsive user interface prioritizing usability and
                aesthetics was developed using MantineUI and Tailwind CSS.
              </li>
              <li>
                Backend: Real-time communication functionalities were seamlessly
                incorporated using socketIO, enabling instantaneous messaging
                and collaboration among users. The database schema was optimized
                using MySQL and Prisma, ensuring efficient data storage and
                retrieval. Integration of Redis for caching purposes enhanced
                overall system performance and responsiveness.
              </li>
              <li>
                My contributions: included developing frontend codebase and
                features, integrating React Query and Redux, writing backend
                APIs, and managing socket operations.
              </li>
            </ul>
          </div>

          <div className='bg w-full flex-col items-center justify-center rounded-xl bg-white/50 p-2'>
            <p className='text-xl'>Finaccel module</p>
            <p>
              A booking system built with Next.js caters to businesses needing a
              web-based platform optimized for mobile devices. Its responsive
              design ensures accessibility across all devices with web browsers,
              providing an efficient solution for integration within clients'
              webviews. This approach minimizes costs while enhancing
              convenience and user experience
            </p>

            <ul>
              <li>
                Frontend: utilizes Ant Design and Tailwind CSS for a visually
                appealing and responsive user interface. With SWR for efficient
                data fetching, Firebase for real-time synchronization, and
                socket.io for instant communication, we ensure a seamless and
                dynamic user experience.
              </li>
              <li>
                Backend: PHP and Laravel, integrating Laravel Echo for real-time
                communication and Firebase for messaging functionality.
              </li>
              <li>
                My contributions: involved frontend development and business
                logic implementation, seamlessly integrating Firebase
                authentication with webview and ensuring compatibility across
                various platforms for optimal user experience.
              </li>
            </ul>
          </div>

          <div className='bg w-full flex-col items-center justify-center rounded-xl bg-white/50 p-2'>
            <p className='text-xl'>Travel booking system</p>
            <p>
              A booking system built with Next.js caters to businesses needing a
              web-based platform optimized for mobile devices. Its responsive
              design ensures accessibility across all devices with web browsers,
              providing an efficient solution for integration within clients'
              webviews. This approach minimizes costs while enhancing
              convenience and user experience
            </p>

            <ul>
              <li>
                Frontend: utilizes Ant Design and Tailwind CSS for a visually
                appealing and responsive user interface. With SWR for efficient
                data fetching, Firebase for real-time synchronization, and
                socket.io for instant communication, we ensure a seamless and
                dynamic user experience.
              </li>
              <li>
                Backend: PHP and Laravel, integrating Laravel Echo for real-time
                communication and Firebase for messaging functionality.
              </li>
              <li>
                My contributions: involved frontend development and business
                logic implementation, seamlessly integrating Firebase
                authentication with webview and ensuring compatibility across
                various platforms for optimal user experience.
              </li>
            </ul>
          </div>

          <div className='bg w-full flex-col items-center justify-center rounded-xl bg-white/50 p-2'>
            <p className='text-xl'>Renew the logistics system </p>
            <p>
              This project aims to renew an outdated logistics system using new
              technologies based on customer requirements. The process will
              involve generating ideas for improvements, implementing necessary
              upgrades and integrations, and overhauling the entire system to
              make it more efficient and functional.
            </p>

            <ul>
              <li>Renew the logistics system</li>
              <li>
                Frontend: Leveraging technologies such as ReactJS, React Query,
                Ant Design (antd), Tailwind CSS, React Hook Form, TypeScript,
                and Styled Components, I enhance efficiency and functionality
                across projects.
              </li>
              <li>
                My contributions: involved developing frontend and business
                logic implementation.
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

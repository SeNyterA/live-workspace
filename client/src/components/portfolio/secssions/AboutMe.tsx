import { IconDownload } from '@tabler/icons-react'
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform
} from 'framer-motion'
import { useLayoutEffect, useRef, useState } from 'react'

export default function AboutMe() {
  const projectsRef = useRef<HTMLDivElement>(null)
  const workspaceRef = useRef<HTMLDivElement>(null)
  const viewPortRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const { scrollYProgress: projectsYProgress, scrollY } = useScroll({
    target: projectsRef,
    axis: 'y',
    container: viewPortRef,
    layoutEffect: true,
    offset: ['start start', 'end end']
  })

  useMotionValueEvent(scrollY, 'change', value => {
    const height = viewPortRef?.current?.clientHeight
    if (!height) return
    setPage(Math.round(value / height))
  })

  useMotionValueEvent(projectsYProgress, 'change', value => {
    console.log(value)
  })

  const projectsX = useTransform(projectsYProgress, [0, 1], ['0%', '-266%'])

  useLayoutEffect(() => {
    const scrollTrigger = viewPortRef?.current?.addEventListener(
      'scrollend',
      e => {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
          const height = viewPortRef?.current?.clientHeight
          if (!height) return
          if (Math.round(scrollY.get() / height) <= 10)
            viewPortRef.current?.scrollTo({
              top: Math.round(scrollY.get() / height) * height,
              behavior: 'smooth'
            })
        }, 500)
      }
    )
    if (!scrollTrigger) return
    return () => {
      clearTimeout(timeoutRef.current)
      viewPortRef?.current?.removeEventListener('scrollend', scrollTrigger)
    }
  }, [])

  const getPageTitle = () => {
    switch (page) {
      case 0:
        return 'About Me'
      case 1:
        return 'Skills'
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        return 'Experience'
      default:
        return 'Pesonal projects'
    }
  }

  return (
    <>
      <div className='absolute bottom-2 left-1/2 z-50 flex translate-x-[-50%] items-center gap-2 text-sm font-semibold uppercase'>
        <div className='h-0.5 w-10 bg-black' />
        {getPageTitle()}
        <div className='h-0.5 w-10 bg-black' />
      </div>

      <div
        className='absolute inset-0 overflow-x-hidden overflow-y-scroll scroll-smooth text-justify text-slate-800'
        ref={viewPortRef}
        onScroll={() => {
          clearTimeout(timeoutRef.current)
        }}
      >
        <div className='flex h-full items-center gap-10 p-10'>
          <div className='relative flex-1'>
            <motion.p className='text-5xl font-bold'>N.D.Khang</motion.p>
            <div className='animated-text relative'>
              I'm a <span></span>
            </div>
            <p className='cursor-text'>
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

            <div className='absolute inset-x-0 mt-2 overflow-x-hidden'>
              <div className='flex gap-2'>
                <div className='icons-inner-1 flex w-fit space-x-2'>
                  <img
                    src='/techs/react.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                  <img
                    src='/techs/nextjs.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                  <img
                    src='/techs/nestjs.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                  <img
                    src='/techs/firebase.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />

                  <img
                    src='/techs/redis.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                  <img
                    src='/techs/redux.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />

                  <img
                    src='/techs/react-query.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                  <img
                    src='/techs/tailwind.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />

                  <img
                    src='/techs/socket-io.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                  <img
                    src='/techs/mysql.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />

                  <img
                    src='/techs/mongo.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />

                  <img
                    src='/techs/typeorm.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                  <img
                    src='/techs/prisma.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                  <img
                    src='/techs/graphql.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />

                  <img
                    src='/techs/apollographql.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />

                  <img
                    src='/techs/vite.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                  <img
                    src='/techs/mantine.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                  <img
                    src='/techs/antd.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                  <img
                    src='/techs/material.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />

                  <img
                    src='/techs/docker.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                  <img
                    src='/techs/ec2.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                  <img
                    src='/techs/ngnix.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                </div>
                <div className='icons-inner-2 flex w-fit space-x-2'>
                  <img
                    src='/techs/react.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                  <img
                    src='/techs/nextjs.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                  <img
                    src='/techs/nestjs.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                  <img
                    src='/techs/firebase.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />

                  <img
                    src='/techs/redis.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                  <img
                    src='/techs/redux.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />

                  <img
                    src='/techs/react-query.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                  <img
                    src='/techs/tailwind.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />

                  <img
                    src='/techs/socket-io.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                  <img
                    src='/techs/mysql.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />

                  <img
                    src='/techs/mongo.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />

                  <img
                    src='/techs/typeorm.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                  <img
                    src='/techs/prisma.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                  <img
                    src='/techs/graphql.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />

                  <img
                    src='/techs/apollographql.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />

                  <img
                    src='/techs/vite.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                  <img
                    src='/techs/mantine.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                  <img
                    src='/techs/antd.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                  <img
                    src='/techs/material.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />

                  <img
                    src='/techs/docker.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                  <img
                    src='/techs/ec2.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                  <img
                    src='/techs/ngnix.png'
                    className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                  />
                </div>
              </div>

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
          <motion.div className='flex-1 flex-col items-center justify-center rounded-xl text-base'>
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
          <motion.div className='flex-1 flex-col items-center justify-center rounded-xl text-base'>
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

        <div className='projects relative h-[400%]' ref={projectsRef}>
          <div className='sticky top-0 flex h-1/4 gap-10 p-10'>
            <video
              autoPlay
              loop
              muted
              playsInline
              src='https://cdn.dribbble.com/userupload/9232958/file/original-0bb0cc42e6ae84c6e1478cd6522a2af6.mp4'
              // src='https://cdn.dribbble.com/userupload/7610900/file/original-e95e0b10875ec267692fa079cb3c1122.mp4'
              className='aspect-square h-full overflow-hidden rounded-2xl object-cover'
            />
            <motion.div className='z-50 flex flex-1 flex-col justify-center overflow-x-hidden rounded-xl'>
              <p className='text-2xl font-semibold'>TGL Solutions</p>
              <p>
                I have been working as a Full-Stack Developer intern since May
                2022, and I transitioned to full-time in August 2022. I work for
                a company that specializes in outsourcing services for the
                Japanese market. My primary responsibilities include
                participating in product development projects and outsourcing
                services for the Japanese market.
                {/* I work on both front-end and back-end tasks to
              ensure the quality and performance of the products, and I
              collaborate closely with cross-functional teams to deliver
              high-quality solutions that meet our clients' requirements. */}
              </p>
              <motion.div
                className='mt-4 flex gap-[2%] text-sm 2xl:text-base'
                // ref={projectRefContainer}
                style={{
                  x: projectsX
                }}
              >
                <div className='min-w-[90%] flex-col items-center justify-center rounded-xl border border-dashed border-blue-400 p-4'>
                  <p className='text-xl'>Finaccel module</p>
                  <p>
                    A booking system built with Next.js caters to businesses
                    needing a web-based platform optimized for mobile devices.
                    Its responsive design ensures accessibility across all
                    devices with web browsers, providing an efficient solution
                    for integration within clients' webviews. This approach
                    minimizes costs while enhancing convenience and user
                    experience.
                  </p>
                  <p>Role: Frontend developer</p>
                  <p>
                    My contributions: I integrated Firebase authentication with
                    webviews and created a visually appealing UI using Ant
                    Design and Tailwind CSS. I used SWR for efficient data
                    fetching and socket.io for instant communication, while
                    NestJS, Laravel Echo and Firebase served as reliable backend
                    services for real-time communication and messaging
                    functionality to support the booking system.
                  </p>
                </div>
                <div className='min-w-[90%] flex-col items-center justify-center rounded-xl border border-dashed border-blue-400 p-4'>
                  <p className='text-xl'>Travel booking system</p>
                  <p>
                    This project aims to renew an outdated logistics system
                    using new technologies based on customer requirements. The
                    process will involve generating ideas for improvements,
                    implementing necessary upgrades and integrations, and
                    overhauling the entire system to make it more efficient and
                    functional.
                  </p>
                  <p>Role: Frontend, Backend developer</p>
                  <p>
                    My contributions: I built easily usable and reusable
                    components, upgraded and maintained them. I organized
                    modules to shorten project development time and enhance
                    efficiency. I utilized NextJS, React Query, Ant Design,
                    Tailwind CSS, React Hook Form, TypeScript, and styled
                    components to create a visually appealing, responsive, and
                    well-structured project.
                  </p>
                </div>
                <div className='min-w-[90%] flex-col items-center justify-center rounded-xl border border-dashed border-blue-400 p-4'>
                  <p className='text-xl'>House Inspection System</p>
                  <p>
                    This project involves a web and mobile application system
                    that is designed to conduct surveys and evaluations of
                    construction works and apartment buildings. The main purpose
                    of this project is to provide a convenient and efficient way
                    to assess the condition and quality of these structures.
                  </p>
                  <p>Role: Frontend, Backend, Mobile developer</p>
                  <p>
                    My contributions: I contributed to a project involving
                    surveys and evaluations of construction works and
                    apartments. I worked on frontend, backend, and mobile app
                    roles. I used ReactJS, Tailwind CSS, Ant Design, Redux,
                    React Hook Form, and React DND Beautiful for the frontend.
                    For the backend, I used NestJS and MongoDB, and for the
                    mobile app, I used React Native. I optimized performance for
                    handling large amounts of data in forms and integrated
                    GraphQL with Apollo Client for efficient data retrieval and
                    manipulation.
                  </p>
                </div>

                <div className='min-w-[90%] flex-col items-center justify-center rounded-xl border border-dashed border-blue-400 p-4'>
                  <p className='text-xl'>Custom open-source</p>
                  <p>
                    The aim of this project is to improve the functionality of
                    Mattermost, an open-source code, to facilitate better
                    communication operations, follow-up communication, task
                    management, and internal company processes. The main goal is
                    to enhance the user interface and incorporate additional
                    features that can seamlessly connect with other company
                    systems, creating a more cohesive ecosystem. This approach
                    aims to increase operational efficiency and streamline the
                    management of internal activities.
                  </p>
                  <p>Role: Frontend</p>
                  <p>
                    I have made significant contributions by customizing and
                    improving the open-source code of Mattermost. My work
                    involved enhancing the user interface to make it more
                    user-friendly and integrating additional features with other
                    systems used by the company. These changes resulted in
                    improved communication efficiency and simplified management
                    of internal processes.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className='projects relative h-[300%]' ref={workspaceRef}>
          <div className='sticky top-0 flex h-1/3 gap-10 p-10'>
            <motion.div className='z-50 flex flex-1 flex-col justify-center rounded-xl'>
              <p className='text-2xl font-semibold'>Live workspace</p>
              <p>
                The development of a comprehensive{' '}
                <span>real-time workspace system</span>
                focused on integrating chat functionality, notifications, and
                task management features. Crafted using a cutting-edge tech
                stack including <span>NestJS</span> and <span>ReactJS</span>.
                With a strong emphasis on speed and efficiency, the system
                ensured optimal performance and responsiveness, enabling swift
                and seamless interactions within the workspace environment.
              </p>
              <motion.div
                className='mt-4 flex gap-[2%] overflow-scroll text-sm 2xl:text-base'
                // ref={projectRefContainer}
              >
                <div className='min-w-[60%] items-start justify-center gap-4 rounded-xl border border-dashed border-blue-400 p-4'>
                  <p
                    className='text-xl'
                    // style={{
                    //   writingMode: 'vertical-lr'
                    // }}
                  >
                    Frontend
                  </p>
                  <div>
                    For effective state management, Redux was employed,
                    guaranteeing smooth and predictable handling of the
                    application state. Additionally, React Query, fully
                    supported with TypeScript, was integrated to enhance data
                    fetching and caching. A modern, responsive user interface
                    prioritizing usability and aesthetics was developed using
                    MantineUI and Tailwind CSS.
                  </div>

                  <div className='mt-2 space-x-2'>
                    <img
                      src='/techs/react.png'
                      className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                    />
                    <img
                      src='/techs/vite.png'
                      className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                    />

                    <img
                      src='/techs/firebase.png'
                      className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                    />
                    <img
                      src='/techs/mantine.png'
                      className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                    />

                    <img
                      src='/techs/react-query.png'
                      className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                    />

                    <img
                      src='/techs/socket-io.png'
                      className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                    />
                    <img
                      src='/techs/tailwind.png'
                      className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                    />
                  </div>
                </div>
                <div className='min-w-[60%] items-start justify-center gap-4 rounded-xl border border-dashed border-blue-400 p-4'>
                  <p
                    className='text-xl'
                    // style={{
                    //   writingMode: 'vertical-lr'
                    // }}
                  >
                    Backend
                  </p>
                  <div>
                    Real-time communication functionalities were seamlessly
                    incorporated using socketIO, enabling instantaneous
                    messaging and collaboration among users. The database schema
                    was optimized using MySQL and Prisma, ensuring efficient
                    data storage and retrieval. Integration of Redis for caching
                    purposes enhanced overall system performance and
                    responsiveness.
                  </div>
                  <div className='mt-2 space-x-2'>
                    <img
                      src='/techs/mysql.png'
                      className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                    />
                    <img
                      src='/techs/nestjs.png'
                      className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                    />
                    <img
                      src='/techs/firebase.png'
                      className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                    />

                    <img
                      src='/techs/prisma.png'
                      className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                    />
                    <img
                      src='/techs/redis.png'
                      className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                    />
                    <img
                      src='/techs/socket-io.png'
                      className='h-10 w-10 rounded p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                    />
                  </div>
                </div>

                <div className='min-w-[60%] items-start justify-center gap-4 rounded-xl border border-dashed border-blue-400 p-4'>
                  <p
                    className='text-xl'
                    // style={{
                    //   writingMode: 'vertical-lr'
                    // }}
                  >
                    Deployment
                  </p>
                  <div>
                    Docker was utilized for containerization, simplifying the
                    deployment process and ensuring consistency across different
                    environments. The application was deployed on AWS, with
                    Nginx serving as a reverse proxy to enhance security and
                    performance.
                  </div>
                  <div className='mt-2 space-x-2'>
                    <img
                      src='/techs/ec2.png'
                      className='h-10 w-10 rounded bg-slate-100 p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                    />
                    <img
                      src='/techs/ngnix.png'
                      className='h-10 w-10 rounded bg-slate-100 p-2 bg-blend-luminosity 2xl:h-16 2xl:w-16'
                    />
                  </div>
                </div>
              </motion.div>

              {/* <motion.button
                className='mt-2 flex h-9 w-fit cursor-pointer items-center justify-center gap-2 rounded-lg border-none bg-slate-700 px-4 text-white outline-none hover:bg-slate-950'
                initial={{ opacity: 0, translateX: -1000 }}
                animate={{ opacity: 1, translateX: 0 }}
                whileHover={{
                  filter: 'drop-shadow(0 0 4px #000000aa)',
                  scale: 1.05
                }}
                onClick={() => {
                  window.open('/workspace.pdf')
                }}
              >
                More details
              </motion.button> */}
            </motion.div>

            <div className='aspect-square h-full space-x-[2%] overflow-hidden rounded-2xl object-cover blur-[2px]'>
              <img
                src='/workspace.png'
                className='h-full overflow-hidden rounded-2xl object-cover'
              />
              <img
                src='/workspace.png'
                className='h-full overflow-hidden rounded-2xl object-cover'
              />
              <img
                src='/workspace.png'
                className='h-full overflow-hidden rounded-2xl object-cover'
              />
              <img
                src='/workspace.png'
                className='h-full overflow-hidden rounded-2xl object-cover'
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

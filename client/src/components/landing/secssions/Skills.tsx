import { useElementSize } from '@mantine/hooks'
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform
} from 'framer-motion'
import { useRef } from 'react'

export default function Skills() {
  const { ref: viewPortRef, width, height } = useElementSize()

  const skillsRef = useRef<HTMLDivElement>(null)
  const projectsRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress: scrollSkillsYProgress } = useScroll({
    target: skillsRef,
    axis: 'y',
    container: viewPortRef
  })

  const x = useTransform(scrollSkillsYProgress, [0, 1], [0, -width + 112])

  const { scrollYProgress: scrollProjectsYProgress } = useScroll({
    target: projectsRef,
    axis: 'y',
    container: viewPortRef
  })
  const projectsX = useTransform(
    scrollProjectsYProgress,
    [0, 1],
    ['0%', '-250%']
  )

  return (
    <div
      className='absolute inset-0 overflow-y-auto overflow-x-hidden text-sm'
      ref={viewPortRef}
    >
      {/* <div className='flex-col items-center justify-center bg-slate-100 p-4 pb-0'>
        <p className='text-xl'>Overall skills</p>
        <p>
          As a <span className='text-lime-600'>Full-Stack Developer</span>, I
          specialize in building user-centric web applications using frameworks
          such as <span className='text-lime-600'>JavaScript/TypeScript</span>.
          My expertise covers both{' '}
          <span className='text-lime-600'>front-end</span> and{' '}
          <span className='text-lime-600'>back-end</span> development, ensuring
          a holistic approach to project delivery. I have a successful track
          record in creating{' '}
          <span className='text-lime-600'>booking systems</span>,{' '}
          <span className='text-lime-600'>real-time applications</span>, and
          contributing to{' '}
          <span className='text-lime-600'>open-source projects</span>. I use
          <span className='text-lime-600'>TypeScript</span> to improve code
          maintainability, while <span className='text-lime-600'>Git</span>,{' '}
          <span className='text-lime-600'>Docker</span>, and{' '}
          <span className='text-lime-600'></span> methodologies help me ensure
          smooth development workflows and efficient collaboration.
        </p>
      </div> */}

      <div
        className='relative'
        style={{
          height: height * 2
        }}
        ref={skillsRef}
      >
        <motion.div
          style={{ x, translateY: '-50%' }}
          className='sticky top-1/2 flex gap-4 p-4'
        >
          <div
            style={{ minWidth: width - 80, maxWidth: width - 80 }}
            className='w-full flex-col items-center justify-center rounded-xl bg-blue-50 p-4 py-2'
          >
            <p className='text-xl'>Frontend</p>
            <p>
              I am a skilled creator committed to designing engaging web and
              mobile experiences that prioritize user satisfaction. I possess
              expertise in advanced technologies like ReactJS and NextJS, which
              I utilize to build complex, high-performance applications. With a
              strong foundation and the necessary skills, I adeptly tackle the
              challenges of front-end development, leveraging my expertise and
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
                <span className='text-lime-600'>MaterialUI</span>, and
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
          </div>

          <div
            style={{ minWidth: width - 80, maxWidth: width - 80 }}
            className='w-full flex-col items-center justify-center rounded-xl bg-emerald-50 p-4 py-2'
          >
            <p className='text-xl'>Backend</p>
            <p>
              I have a specialization in developing robust and real-time
              systems. Building high-performance server-side solutions is my
              passion and I use <span className='text-lime-600'>NodeJS</span>{' '}
              and <span className='text-lime-600'>NestJS</span> to create APIs
              and backend services that meet the highest standards of
              performance and scalability. My expertise also includes designing
              and implementing RESTful APIs and GraphQL to facilitate flexible
              and efficient data access. With my extensive experience, I have a
              proven track record of optimizing application speed and building
              real-time functionalities to provide exceptional user experiences.
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
                <span className='text-lime-600'>Redis</span>
                for caching and data storage optimization.
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
                practices is crucial. This includes understanding
                authentication, authorization, data encryption, and techniques
                to prevent cyber attacks.
              </li>
            </ul>
          </div>
        </motion.div>
      </div>

      <div
        className='relative'
        style={{
          height: height * 4
        }}
        ref={projectsRef}
      >
        <motion.div
          style={{ x: projectsX, translateY: '-50%' }}
          className='sticky top-1/2 flex gap-4 p-4'
        >
          <div
            style={{ minWidth: width - 80, maxWidth: width - 80 }}
            className='w-full flex-col items-center justify-center rounded-xl bg-blue-50 p-4 py-2'
          >
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

          <div
            style={{ minWidth: width - 80, maxWidth: width - 80 }}
            className='w-full flex-col items-center justify-center rounded-xl bg-emerald-50 p-4 py-2'
          >
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

          <div
            style={{ minWidth: width - 80, maxWidth: width - 80 }}
            className='w-full flex-col items-center justify-center rounded-xl bg-emerald-50 p-4 py-2'
          >
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

          <div
            style={{ minWidth: width - 80, maxWidth: width - 80 }}
            className='w-full flex-col items-center justify-center rounded-xl bg-emerald-50 p-4 py-2'
          >
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

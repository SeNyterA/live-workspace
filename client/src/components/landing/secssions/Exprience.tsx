import { ScrollArea } from '@mantine/core'
import { useElementSize } from '@mantine/hooks'
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform
} from 'framer-motion'
import { useRef } from 'react'

export default function Exprience() {
  const targetRef = useRef(null)
  const { ref: viewPortRef, width, height } = useElementSize()
  const { scrollYProgress, scrollY } = useScroll({
    target: targetRef,
    container: viewPortRef,
    offset: ['start end', 'end start'],
    layoutEffect: false
  })

  const y = useTransform(scrollY, y => -y)

  useMotionValueEvent(scrollY, 'change', latest => {
    console.log(latest)
  })

  return (
    <div className='absolute inset-0 flex flex-col'>
      <div className='text-2xl'>Overall skills</div>
      <div className='relative flex-1 overflow-hidden'>
        <div
          className='absolute inset-0 flex snap-y overflow-y-scroll'
          ref={viewPortRef}
        >
          <motion.div className='flex-1 space-y-2' ref={targetRef}>
            <div
              style={{
                height: height
              }}
              className='flex snap-center items-center justify-center bg-slate-100 p-10'
            >
              <p>
                As a <span className='text-lime-600'>Full-Stack Developer</span>
                , I specialize in building user-centric web applications using
                frameworks such as{' '}
                <span className='text-lime-600'>JavaScript/TypeScript</span>. My
                expertise covers both{' '}
                <span className='text-lime-600'>front-end</span> and{' '}
                <span className='text-lime-600'>back-end</span> development,
                ensuring a holistic approach to project delivery. I have a
                successful track record in creating{' '}
                <span className='text-lime-600'>booking systems</span>,{' '}
                <span className='text-lime-600'>real-time applications</span>,
                and contributing to{' '}
                <span className='text-lime-600'>open-source projects</span>. I
                use
                <span className='text-lime-600'>TypeScript</span> to improve
                code maintainability, while{' '}
                <span className='text-lime-600'>Git</span>,{' '}
                <span className='text-lime-600'>Docker</span>, and{' '}
                <span className='text-lime-600'></span> methodologies help me
                ensure smooth development workflows and efficient collaboration.
              </p>
            </div>

            <div
              style={{
                height: height
              }}
              className='flex snap-center items-center justify-center bg-slate-100 p-10'
            >
              <p>
                I am a skilled creator committed to designing engaging web and
                mobile experiences that prioritize user satisfaction. I possess
                expertise in advanced technologies like ReactJS and NextJS,
                which I utilize to build complex, high-performance applications.
                With a strong foundation and the necessary skills, I adeptly
                tackle the challenges of front-end development, leveraging my
                expertise and supplementary libraries to execute projects
                swiftly and efficiently.
              </p>
            </div>

            <div
              style={{
                height: height
              }}
              className='flex snap-center items-center justify-center bg-slate-100 p-10'
            >
              <p>
                I have a specialization in developing robust and real-time
                systems. Building high-performance server-side solutions is my
                passion and I use NodeJS and NestJS to create APIs and backend
                services that meet the highest standards of performance and
                scalability. My expertise also includes designing and
                implementing RESTful APIs and GraphQL to facilitate flexible and
                efficient data access. With my extensive experience, I have a
                proven track record of optimizing application speed and building
                real-time functionalities to provide exceptional user
                experiences.
              </p>
            </div>
          </motion.div>
          <div className='sticky top-0 h-full flex-1 bg-black'>
            <motion.div
              className='absolute inset-x-0 bottom-0 flex-1 space-y-2'
              style={{
                bottom: y
              }}
            >
              <div
                style={{
                  height: height
                }}
                className='flex items-center justify-center bg-blue-100 p-10'
              >
                <ul>
                  <li>
                    Adept at using ORM frameworks such as TypeORM, Prisma for
                    efficient data modeling and seamless database interaction
                    with MySQL, PostgreSQL, and MongoDB.
                  </li>
                  <li>
                    Implement real-time features using SocketIO and leverage
                    Redis for caching and data storage optimization.
                  </li>
                  <li>
                    Proficient in both Object-Oriented Programming (OOP),
                    Functional Programming, and Design Patterns.
                  </li>
                  <li>
                    Using tools like Docker, AWS, and Nginx for development and
                    deployment processes, management, and automation.
                  </li>
                  <li>
                    Having a comprehensive knowledge of information security
                    practices is crucial. This includes understanding
                    authentication, authorization, data encryption, and
                    techniques to prevent cyber attacks.
                  </li>
                </ul>
              </div>

              <div
                style={{
                  height: height
                }}
                className='flex items-center justify-center bg-blue-100 p-10'
              >
                <ul>
                  <li>
                    Deep understanding of React Hook and system optimization
                    techniques to ensure optimal performance and user
                    experience.
                  </li>
                  <li>
                    For building basic and advanced web structures, a strong
                    command of HTML, CSS, SCSS, Responsive and TailwindCSS is
                    essential.
                  </li>
                  <li>
                    Utilize popular UI libraries such as Ant Design, MaterialUI,
                    and Mantine to create visually appealing and intuitive user
                    interfaces.
                  </li>
                  <li>
                    Specialized in handling and managing state management,
                    particularly Redux, for complex systems.
                  </li>
                  <li>
                    Mastered Axios, RESTful API (SWR, ReactQuery) and Graphql
                    (ApolloClient) for efficient data access.
                  </li>
                </ul>
              </div>
              <div
                style={{
                  height: height
                }}
                className='flex items-center justify-center bg-blue-100 p-10'
              ></div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

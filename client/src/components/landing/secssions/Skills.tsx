import { useElementSize } from '@mantine/hooks'
import { useRef } from 'react'
import { Chip } from '../Chip'
import { tabs } from '../LandingPage'

export default function Skills() {
  const targetRef = useRef(null)
  const { ref: viewPortRef, width, height } = useElementSize()

  return (
    <div
      className='absolute inset-0 flex flex-col overflow-scroll text-sm'
      ref={viewPortRef}
    >
      <div className='flex-col items-center justify-center bg-slate-100 p-4 pb-0'>
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
      </div>

      {/* <div className='flex-1 relative'>
        <VerticalAccordion />
      </div> */}

      <div
        className='relative'
        style={{
          height: height * 2
        }}
      >
        <div className='sticky top-0 flex gap-4 overflow-x-auto p-4'>
          <div
            style={{ minWidth: width * 0.9 }}
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
                Deep understanding of <span className='text-lime-600'>React Hook</span> and system
                optimization techniques to ensure optimal performance and user
                experience.
              </li>
              <li>
                For building basic and advanced web structures, a strong command
                of <span className='text-lime-600'>HTML</span>, <span className='text-lime-600'>CSS</span>, <span className='text-lime-600'>SCSS</span>,{' '}
                <span className='text-lime-600'>Responsive</span> and <span className='text-lime-600'>TailwindCSS</span> is
                essential.
              </li>
              <li>
                Utilize popular UI libraries such as <span className='text-lime-600'>Ant Design</span>,{' '}
                <span className='text-lime-600'>MaterialUI</span>, and
                <span className='text-lime-600'>Mantine</span> to create visually appealing and intuitive
                user interfaces.
              </li>
              <li>
                Specialized in handling and managing state management,
                particularly <span className='text-lime-600'>Redux</span>, for complex systems.
              </li>
              <li>
                Mastered <span className='text-lime-600'>Axios</span>, <span className='text-lime-600'>RESTful API</span> (
                <span className='text-lime-600'>SWR</span>, <span className='text-lime-600'>ReactQuery</span>) and
                <span className='text-lime-600'>Graphql</span> (<span className='text-lime-600'>ApolloClient</span>) for efficient
                data access.
              </li>
            </ul>
          </div>

          <div
            style={{ minWidth: width * 0.9 }}
            className='w-full flex-col items-center justify-center rounded-xl bg-emerald-50 p-4 py-2'
          >
            <p className='text-xl'>Backend</p>
            <p>
              I have a specialization in developing robust and real-time
              systems. Building high-performance server-side solutions is my
              passion and I use <span className='text-lime-600'>NodeJS</span> and <span className='text-lime-600'>NestJS</span> to
              create APIs and backend services that meet the highest standards
              of performance and scalability. My expertise also includes
              designing and implementing RESTful APIs and GraphQL to facilitate
              flexible and efficient data access. With my extensive experience,
              I have a proven track record of optimizing application speed and
              building real-time functionalities to provide exceptional user
              experiences.
            </p>

            <ul>
              <li>
                Adept at using ORM frameworks such as <span className='text-lime-600'>TypeORM</span>,{' '}
                <span className='text-lime-600'>Prisma</span> for efficient data modeling and seamless
                database interaction with <span className='text-lime-600'>MySQL</span>,{' '}
                <span className='text-lime-600'>PostgreSQL</span>, and <span className='text-lime-600'>MongoDB</span>.
              </li>
              <li>
                Implement real-time features using <span className='text-lime-600'>SocketIO</span> and
                leverage <span className='text-lime-600'>Redis</span>
                for caching and data storage optimization.
              </li>
              <li>
                Proficient in both Object-Oriented Programming (OOP), Functional
                Programming, and Design Patterns.
              </li>
              <li>
                Using tools like <span className='text-lime-600'>Docker</span>, <span className='text-lime-600'>AWS</span>, and{' '}
                <span className='text-lime-600'>Nginx</span> for development and deployment processes,
                management, and automation.
              </li>
              <li>
                Having a comprehensive knowledge of information security
                practices is crucial. This includes understanding
                authentication, authorization, data encryption, and techniques
                to prevent cyber attacks.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className='my-6 mt-0 flex flex-wrap items-center gap-2 px-4  text-sm'>
        {tabs.map((tab, index) => (
          <Chip
            text={tab}
            selected={1 === index}
            // setSelected={() => setImgIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

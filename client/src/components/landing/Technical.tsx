import { IconChevronLeft } from '@tabler/icons-react'

export default function Technical() {
  return (
    <>
      <div
        className='flex items-center gap-2'
        style={{
          gridArea: '1 / 1 /2 / 13'
        }}
      >
        <IconChevronLeft />
        <p
          className='text-xl'
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Technical
        </p>
      </div>
      <div
        className='m-1 flex flex-col justify-center rounded bg-blue-900/40 p-4 '
        style={{
          gridArea: '2 / 1 /13 / 6'
        }}
      >
        <p
          className=''
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Frontend
        </p>

        <p>
          <span className='text-lime-500'>Redux</span> ensures efficient state
          management, <span className='text-lime-500'>Socket.IO</span> enables
          real-time communication,{' '}
          <span className='text-lime-500'>Tailwind CSS</span> and{' '}
          <span className='text-lime-500'>SCSS</span> aid rapid UI development,{' '}
          <span className='text-lime-500'>Mantine UI</span> ensures cross-device
          consistency, <span className='text-lime-500'>React Query</span> and{' '}
          <span className='text-lime-500'>Axios</span> hooks handle data
          fetching, while <span className='text-lime-500'>Firebase</span>{' '}
          simplifies authentication.
        </p>

        <div className='mt-3 flex gap-4'>
          <img className='h-10 w-10' src='/techs/react.png' />
          <img className='h-10 w-10' src='/techs/tailwind.png' />
          <img className='h-10 w-10' src='/techs/mantine.png' />
          <img className='h-10 w-10' src='/techs/redux.png' />
          <img className='h-10 w-10' src='/techs/react-query.png' />
          <img className='h-10 w-10' src='/techs/socket-io.png' />
          <img className='h-10 w-10' src='/techs/firebase.png' />
          <img className='h-10 w-10' src='/techs/vite.png' />
        </div>
      </div>

      <div
        className='m-1 flex flex-col justify-center rounded bg-violet-900/40 p-4 '
        style={{
          gridArea: '2 / 6 /9 / 13'
        }}
      >
        <p
          className=''
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Backend
        </p>
        <p>
          Building server-side logic with{' '}
          <span className='text-lime-500'>NestJS</span> for ease of development.
        </p>
        <p>
          Managing data with <span className='text-lime-500'>MySQL</span> for
          strict integrity and security.
        </p>
        <p>
          Creating efficient data models with{' '}
          <span className='text-lime-500'>Prisma ORM</span> for easy
          maintenance.
        </p>
        <p>
          Implementing <span className='text-lime-500'>Socket.IO</span> for
          real-time bidirectional communication.
        </p>
        <p>
          Utilizing <span className='text-lime-500'>Redis</span> caching for
          high-speed data management.
        </p>

        <div className='mt-3 flex gap-4'>
          <img className='h-10 w-10' src='/techs/nestjs.png' />
          <img className='h-10 w-10' src='/techs/mysql.png' />
          <img className='h-10 w-10' src='/techs/redis.png' />
          <img className='h-10 w-10' src='/techs/socket-io.png' />
          <img className='h-10 w-10' src='/techs/prisma.png' />
          <img className='h-10 w-10' src='/techs/firebase.png' />
        </div>
      </div>

      <div
        className='m-1 flex flex-col justify-center rounded bg-sky-900/40 p-4 '
        style={{
          gridArea: '9 / 6 /13 / 13'
        }}
      >
        <p
          className=''
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Deployment
        </p>
        <p>
          Deploying on <span className='text-lime-500'>Linux</span> with{' '}
          <span className='text-lime-500'>AWS EC2</span> tier free, which
          includes 1GB RAM and 1 CPU.
        </p>
        <p>
          Utilizing <span className='text-lime-500'>Docker</span> for
          containerization of server,{' '}
          <span className='text-lime-500'>Nginx</span>, client, and
          <span className='text-lime-500'>Redis services</span>.
        </p>
        <p>
          Implementing <span className='text-lime-500'>MYSQL</span> with
          Relational Database (RDB) for data storage and management.
        </p>

        <div className='mt-3 flex gap-4'>
          <img className='h-10 w-10' src='/techs/ec2.png' />
          <img className='h-10 w-10' src='/techs/docker.png' />
          <img className='h-10 w-10' src='/techs/ngnix.png' />
        </div>
      </div>
    </>
  )
}

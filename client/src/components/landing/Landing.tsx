import { ActionIcon, Button, Drawer } from '@mantine/core'
import {
  IconBrandFacebookFilled,
  IconBrandGithubFilled
} from '@tabler/icons-react'
import React from 'react'
import Authentication from '../auth/Login'
import './landing.scss'

export default function Landing() {
  const [open, setOpen] = React.useState(false)
  return (
    <div
      className='grid h-screen w-screen text-justify text-sm'
      style={{
        gridAutoRows: 'calc((calc(100vh) / 30))',
        gridAutoColumns: 'calc((calc(100vw) / 30))',
        backgroundImage: 'url(/img/31.jpg)'
      }}
    >
      <div
        className='flex items-end'
        style={{
          gridArea: '1 / 3 / 3 / 29'
        }}
      >
        <div className='flex h-fit w-full items-center justify-between'>
          <p
            style={{
              fontFamily: 'vortice-concept, sans-serif'
            }}
          >
            Live Workspace
          </p>
          <Button variant='light' onClick={() => setOpen(true)}>
            Sign In
          </Button>
        </div>
      </div>

      <div
        className='flex flex-col items-center justify-end gap-4 pb-14'
        style={{
          gridArea: '15 / 29 / 30 / 31'
        }}
      >
        <a href='https://github.com/SeNyterA/live-workspace' target='_blank'>
          <ActionIcon className='!bg-transparent'>
            <IconBrandGithubFilled size={20} />
          </ActionIcon>
        </a>

        <a href='https://www.facebook.com/senytera' target='_blank'>
          <ActionIcon className='!bg-transparent'>
            <IconBrandFacebookFilled size={20} />
          </ActionIcon>
        </a>

        <a
          href='https://portfolio.senytera.online'
          target='_blank'
          className='rotate-180 cursor-pointer text-white no-underline hover:text-blue-400'
          style={{
            writingMode: 'vertical-rl',
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Senytera
        </a>
      </div>

      <div
        className='flex items-center justify-end px-10'
        style={{
          gridArea: '30 / 1 / 30 / 31'
        }}
      >
        <span className='text-xs'>
          The application is under development, please do not use for purposes
          other than testing.
        </span>
      </div>

      <div
        style={{ gridArea: '11 / 3 / 20 / 14' }}
        className='m-1 flex flex-col items-center justify-center rounded bg-gray-500/50 p-4 text-white hover:scale-[1.01] hover:ring-2'
      >
        <p
          className='w-full'
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Flexibility
        </p>
        <p>
          Your workspace adapts to your needs, not the other way around. With
          customizable grids and layouts, you shape your environment for maximum
          productivity.
        </p>
      </div>
      <div
        style={{ gridArea: '4 / 6 / 11 / 14' }}
        className='m-1 flex flex-col items-center justify-center rounded bg-blue-500/50 p-4 text-white hover:scale-[1.01] hover:ring-2'
      >
        <p
          className='w-full'
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Seamless Task Management
        </p>
        <p>
          From inception to completion, every task finds its home in our
          intuitive system. Keep track of progress effortlessly, leaving no
          detail overlooked.
        </p>
      </div>
      <div
        style={{ gridArea: '20 / 9 / 29 / 16' }}
        className='m-1 flex flex-col items-center justify-center rounded bg-red-500/50 p-4 text-white hover:scale-[1.01] hover:ring-2'
      >
        <p
          className='w-full'
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Unified Collaboration
        </p>
        <p>
          Connect with your team seamlessly within the workspace. Group
          discussions, file sharing, and real-time collaboration foster synergy
          like never before.
        </p>
      </div>
      <div
        style={{ gridArea: '8 / 14 / 20 / 22' }}
        className='m-1 flex flex-col items-center justify-center rounded bg-yellow-500/50 p-4 text-white hover:scale-[1.01] hover:ring-2'
      >
        <p
          className='w-full'
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Empowering Groups
        </p>
        <p>
          Whether small teams or large departments, our platform cultivates a
          sense of belonging and fosters collective success. Your group thrives,
          empowered by shared goals and streamlined communication.
        </p>
      </div>
      <div
        style={{ gridArea: '20 / 16 / 28 / 27' }}
        className='m-1 flex flex-col items-center justify-center rounded bg-lime-500/50 p-4 text-white hover:scale-[1.01] hover:ring-2'
      >
        <p
          className='w-full'
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Effortless Communication
        </p>
        <p>
          Say goodbye to scattered conversations. Our integrated chat feature
          keeps discussions organized and accessible, ensuring clarity and
          alignment across the board.
        </p>
      </div>
      <div
        style={{ gridArea: '10 / 22 / 20 / 29' }}
        className='m-1 flex flex-col items-center justify-center rounded bg-sky-500/50 p-4 text-white hover:scale-[1.01] hover:ring-2'
      >
        <p
          className='w-full'
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Maximized Productivity
        </p>
        <p>
          With every tool at your fingertips and distractions minimized,
          productivity becomes second nature. Harness the power of focused work
          and achieve your goals with ease.
        </p>
      </div>
      <div
        style={{ gridArea: '20 / 4 / 25 / 9' }}
        className='m-1 flex flex-col items-center justify-center rounded bg-yellow-500/50 p-4 text-white hover:scale-[1.01] hover:ring-2'
      >
        <p
          className='w-full'
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Technical
        </p>
      </div>

      <div
        className='mt-4 h-full w-full rounded bg-black/95 p-10'
        style={{
          gridArea: '3 / 3 / 29 / 29',
          display: 'grid',
          gridAutoRows: 'calc(100% / 12)',
          gridAutoColumns: 'calc(100% / 12)'
        }}
      >
        <p
          className='text-2xl'
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Technical
        </p>
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
            <span className='text-lime-500'>SCSS</span> aid rapid UI
            development, <span className='text-lime-500'>Mantine UI</span>{' '}
            ensures cross-device consistency,{' '}
            <span className='text-lime-500'>React Query</span> and{' '}
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
            <span className='text-lime-500'>NestJS</span> for ease of
            development.
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
      </div>

      <Drawer
        onClose={() => {
          setOpen(false)
        }}
        opened={open}
        title={<p className='text-lg font-semibold'></p>}
        position='right'
        size={376}
        classNames={{
          body: 'p-0'
        }}
        overlayProps={{
          blur: '0.5'
        }}
      >
        <Authentication />
      </Drawer>
    </div>
  )
}

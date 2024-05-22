import { ActionIcon, Button, Drawer } from '@mantine/core'
import {
  IconBrandFacebookFilled,
  IconBrandGithubFilled,
  IconChevronLeft
} from '@tabler/icons-react'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import Authentication from '../auth/Login'
import './landing.scss'
import { useSearchParams } from 'react-router-dom'
import Feature from './Feature'
import Modern from './Modern'
import Speed from './Speed'
import TaskManager from './TaskManager'
import Technical from './Technical'

export default function Landing() {
  const [open, setOpen] = React.useState(false)
  const [openContent, setOpenContent] = useState<
    'board' | 'speed' | 'task' | 'tech' | 'modern' | 'feature'
  >()
  const [params] = useSearchParams()
  useEffect(() => {
    if (params.size) setOpen(true)
  }, [params])

  const content = () => {
    switch (openContent) {
      case 'board':
        return <TaskManager onBack={() => setOpenContent(undefined)} />
      case 'speed':
        return <Speed onBack={() => setOpenContent(undefined)} />
      case 'tech':
        return <Technical onBack={() => setOpenContent(undefined)} />
      case 'modern':
        return <Modern onBack={() => setOpenContent(undefined)} />
      case 'feature':
        return <Feature onBack={() => setOpenContent(undefined)} />
      default:
        return <TaskManager onBack={() => setOpenContent(undefined)} />
    }
  }

  return (
    <div
      className='grid h-screen w-screen bg-cover text-justify text-sm'
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
        className='m-1 flex flex-col items-center justify-center rounded bg-gray-500/50 p-4 hover:scale-[1.01] hover:ring-2'
      >
        <p
          className='w-full'
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Esay to cusstom
        </p>
        <p>
          This is open-source code, robust, utilizing suitable technology,
          written cleanly, and easy to use for customization for various
          purposes.
        </p>
        <div className='mt-2 w-full'>
          <a
            className='flex no-underline'
            href='https://github.com/SeNyterA/live-workspace'
            target='_blank'
          >
            <Button className='space-x-2'>
              <IconBrandGithubFilled size={16} />
              <span className='ml-2'>View on Github</span>
            </Button>
          </a>
        </div>
      </div>
      <div
        style={{ gridArea: '4 / 6 / 11 / 14' }}
        className='m-1 flex cursor-pointer flex-col items-center justify-center rounded bg-pink-500/50 p-4 hover:scale-[1.01] hover:ring-2'
        onClick={() => setOpenContent('modern')}
      >
        <p
          className='z-10 w-full'
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Modern UI
        </p>
        <p className='z-10'>
          From inception to completion, every task finds its home in our
          intuitive system. Keep track of progress effortlessly, leaving no
          detail overlooked.
        </p>
      </div>
      <div
        style={{ gridArea: '20 / 7 / 29 / 16' }}
        className='m-1 flex flex-col items-center justify-center rounded bg-red-500/50 p-4 hover:scale-[1.01] hover:ring-2'
        onClick={() => setOpenContent('tech')}
      >
        <p
          className='w-full'
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Technical
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
      </div>
      <div
        style={{ gridArea: '8 / 14 / 20 / 22' }}
        className='lading-board m-1 flex cursor-pointer flex-col items-center justify-center rounded bg-blue-500/50 p-4 hover:scale-[1.01] hover:ring-2'
        onClick={() => setOpenContent('board')}
      >
        <p
          className='z-10 w-full'
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Board
        </p>
        <p className='z-10'>
          Manage tasks efficiently and intuitively, with easy navigation.
          Create, update, and delete tasks, property with ease, with
          drag-and-drop functionality.
        </p>
      </div>
      <div
        style={{ gridArea: '20 / 16 / 28 / 27' }}
        className='m-1 flex cursor-pointer flex-col items-center justify-center rounded bg-violet-500/50 p-4 hover:scale-[1.01] hover:ring-2'
        onClick={() => setOpenContent('speed')}
      >
        <p
          className='z-10 w-full'
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Speed
        </p>
        <p className='z-10'>
          With a clean and modern interface, you can navigate the workspace with
          ease. The intuitive design ensures that every task is just a click
          away.
        </p>
      </div>
      <div
        style={{ gridArea: '10 / 22 / 20 / 29' }}
        className='m-1 flex cursor-pointer flex-col items-center justify-center rounded bg-sky-500/50 p-4 hover:scale-[1.01] hover:ring-2'
        onClick={() => setOpenContent('feature')}
      >
        <p
          className='w-full'
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Productivity
        </p>
        <p>
          Our application is equipped with a range of powerful features designed
          to streamline your workflow and enhance your efficiency. With
          intuitive tools and seamless integration, accomplishing tasks has
          never been easier.
        </p>
      </div>

      <motion.div
        className='mt-4 h-full w-full rounded bg-black/95 p-10'
        style={{
          gridArea: '3 / 3 / 29 / 29',
          display: 'grid',
          gridAutoRows: 'calc(100% / 12)',
          gridAutoColumns: 'calc(100% / 12)',
          animationDuration: '0.5s'
        }}
        animate={{
          opacity: openContent ? 1 : 0,
          zIndex: openContent ? 20 : -1
        }}
      >
        {content()}
      </motion.div>

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

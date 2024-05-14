import { ActionIcon, Button, Drawer } from '@mantine/core'
import {
  IconBrandFacebookFilled,
  IconBrandGithubFilled,
  IconChevronLeft
} from '@tabler/icons-react'
import React from 'react'
import Authentication from '../auth/Login'
import './landing.scss'
import TaskManager from './TaskManager'

export default function Landing() {
  const [open, setOpen] = React.useState(false)
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
        className='landing- m-1 flex flex-col items-center justify-center rounded bg-gray-500/50 p-4 text-white hover:scale-[1.01] hover:ring-2'
      >
        <p
          className='w-full'
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Easy to manage
        </p>
        <p>
          Create, update, and delete tasks, property with ease, with
          drag-and-drop functionality.
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
         Modern UI
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
          Seamless Collaboration
        </p>
        <p>
          Connect with your team seamlessly within the workspace. Group
          discussions, file sharing, and real-time collaboration foster synergy
          like never before.
        </p>
      </div>
      <div
        style={{ gridArea: '8 / 14 / 20 / 22' }}
        className='lading-board m-1 flex flex-col items-center justify-center rounded hover:scale-[1.01] hover:ring-2'
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
        className='m-1 flex flex-col items-center justify-center rounded bg-lime-500/50 p-4 text-white hover:scale-[1.01] hover:ring-2'
      >
        <p
          className='w-full'
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Speed
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

      {/* <div
        className='mt-4 h-full w-full rounded bg-black/95 p-10'
        style={{
          gridArea: '3 / 3 / 29 / 29',
          display: 'grid',
          gridAutoRows: 'calc(100% / 12)',
          gridAutoColumns: 'calc(100% / 12)'
        }}
      >
        <TaskManager />
      </div> */}

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

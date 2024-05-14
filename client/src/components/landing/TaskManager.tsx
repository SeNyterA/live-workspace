import { IconChevronLeft } from '@tabler/icons-react'
import React from 'react'

export default function TaskManager() {
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
          Task Manager
        </p>
      </div>

      <div
        className='m-1 flex flex-col justify-center rounded bg-blue-900/40 p-4'
        style={{
          gridArea: '2 / 1 /13 / 5'
        }}
      >
        <p
          className=''
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Board
        </p>
        <p>Manage tasks efficiently and intuitively, with easy navigation</p>

        <img src='/imgs/board.png' className='w-full mt-4' alt='board' />
      </div>

      <div
        className='m-1 flex flex-col justify-center rounded bg-violet-900/40 p-4 '
        style={{
          gridArea: '2 / 5 /13 / 9'
        }}
      >
        <p
          className=''
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Easy to customize
        </p>
        <p>
          Create, update, and delete tasks, property with ease, with
          drag-and-drop functionalit.
        </p>
        <img
          src='/imgs/custom-property-2.png'
          className='w-full mt-4'
          alt='custom-property-2'
        />
      </div>

      <div
        className='m-1 flex flex-col justify-center rounded bg-sky-900/40 p-4 '
        style={{
          gridArea: '2 / 9 /13 / 13'
        }}
      >
        <p
          className=''
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Full Potential
        </p>
        <p>
          Utilize the full potential of the task manager with customizable
          properties.
        </p>
        <img
          src='/imgs/detal-board.png'
          className='w-full mt-4'
          alt='custom-property-2'
        />
      </div>
    </>
  )
}

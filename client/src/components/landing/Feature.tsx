import { IconChevronLeft } from '@tabler/icons-react'
import { useState } from 'react'

export default function Feature({ onBack }: { onBack: () => void }) {
  return (
    <>
      <div
        className='flex items-center gap-2'
        style={{
          gridArea: '1 / 1 /2 / 13'
        }}
      >
        <IconChevronLeft onClick={onBack} />
        <p
          className='text-xl'
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Productivity
        </p>
      </div>

      <div
        className='m-1 flex justify-center gap-2 rounded p-4'
        style={{
          gridArea: '2 / 1 /13 / 13'
        }}
      >
        <img src='/imgs/feature2.png' className='object-contain' alt='board' />
        <img src='/imgs/feature1.png' className='object-contain' alt='board' />
        <div className='flex flex-1 flex-col overflow-hidden'>
          <div>
            <p
              className='text-xl'
              style={{
                fontFamily: 'vortice-concept, sans-serif'
              }}
            >
              Feature
            </p>
            <p>
              Many features for creating and managing, assigning roles for
              members, integrating all necessary features for a task management
              application. Simple interface to save time, fast response speed.
            </p>
          </div>
          <img
            src='/imgs/feature3.png'
            className='mt-4 h-fit w-full flex-1 overflow-hidden object-contain object-top'
            alt='board'
          />
        </div>
      </div>
    </>
  )
}

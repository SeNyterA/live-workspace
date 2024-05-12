import React from 'react'

export default function Features() {
  return (
    <div className='flex h-screen w-screen snap-center gap-3 p-10 pt-16 text-gray-950 transition-all duration-1000'>
      <div className='feature group flex flex-1 bg-gray-300 transition-all duration-1000 hover:flex-grow-[20]'>
        <p
          className='title'
          style={{
            fontFamily: '"Attack", sans-serif'
          }}
        >
          lightweight
        </p>

        <div className='content'>
          <img
            src='/workspace.png'
            alt='workspace'
            className='h-full w-full object-left'
          />
        </div>
      </div>
      <div className='feature group flex flex-1 bg-gray-300 transition-all duration-1000 hover:flex-grow-[20]'>
        <p
          className='title'
          style={{
            fontFamily: '"Attack", sans-serif'
          }}
        >
          productivity
        </p>

        <div className='content'>
          <img
            src='/workspace.png'
            alt='workspace'
            className='h-full w-full object-left'
          />
        </div>
      </div>{' '}
      <div className='feature group flex flex-1 bg-gray-300 transition-all duration-1000 hover:flex-grow-[20]'>
        <p
          className='title'
          style={{
            fontFamily: '"Attack", sans-serif'
          }}
        >
          speed
        </p>

        <div className='content'>
          <img
            src='/workspace.png'
            alt='workspace'
            className='h-full w-full object-left'
          />
        </div>
      </div>{' '}
      <div className='feature group flex flex-1 bg-gray-300 transition-all duration-1000 hover:flex-grow-[20]'>
        <p
          className='title'
          style={{
            fontFamily: '"Attack", sans-serif'
          }}
        >
          security
        </p>

        <div className='content'>
          <img
            src='/workspace.png'
            alt='workspace'
            className='h-full w-full object-left'
          />
        </div>
      </div>
    </div>
  )
}

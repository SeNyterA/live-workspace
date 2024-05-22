import { IconChevronLeft } from '@tabler/icons-react'

export default function Speed({ onBack }: { onBack: () => void }) {
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
          Fast Response Time
        </p>
      </div>

      <div
        className='m-1 flex flex-col justify-center rounded bg-violet-800/40 p-4'
        style={{
          gridArea: '2 / 1 /7 / 5'
        }}
      >
        <p
          className=''
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Lightning-Fast Speed
        </p>
        <p>
          With optimized code and efficient algorithms, this application
          delivers lightning-fast performance, ensuring users get tasks done
          quickly and efficiently.
        </p>
      </div>

      <div
        className='m-1 flex flex-col justify-center rounded bg-sky-900/40 p-4 '
        style={{
          gridArea: '7 / 1 /13 / 5'
        }}
      >
        <p
          className=''
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Super Lightweight
        </p>
        <p>
          This application is built to be incredibly lightweight, ensuring
          seamless performance even on low-end devices.
        </p>
      </div>

      <div
        className='flex items-center justify-center mt-4'
        style={{
          gridArea: '2 / 6 /13 / 13'
        }}
      >
        <img src='/imgs/speed.png' className='w-full' alt='speed' />
      </div>
    </>
  )
}

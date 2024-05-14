import { IconChevronLeft } from '@tabler/icons-react'

export default function Modern({ onBack }: { onBack: () => void }) {
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
          Modern UI
        </p>
      </div>

      <div
        className='m-1 flex flex-col justify-center rounded bg-lime-500/20 p-4'
        style={{
          gridArea: '2 / 1 /13 / 9'
        }}
      >
        <p
          className=''
          style={{
            fontFamily: 'vortice-concept, sans-serif'
          }}
        >
          Modern UI
        </p>
        <p>
          The UI of the app is designed to be modern and minimalistic. It is
          easy to use and navigate.
        </p>

        <img src='/imgs/modern.png' className='mt-4 w-full' alt='board' />
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
          Easy to cusomize theme
        </p>
        <p>
          You can easily customize the theme of the app by changing the
          variables in the theme file.
        </p>
        <img
          src='/imgs/theme.png'
          className='mt-4 w-full'
          alt='custom-property-2'
        />
      </div>
    </>
  )
}

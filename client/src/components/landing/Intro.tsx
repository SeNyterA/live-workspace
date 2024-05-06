export default function Intro() {
  return (
    <div className='relative flex h-screen w-screen snap-center items-center justify-center text-gray-950'>
      <div className='absolute top-[30%] flex flex-col items-center justify-center'>
        <p
          className='text-6xl font-black uppercase text-center'
          style={{
            fontFamily: '"Attack", sans-serif'
          }}
        >
          A{' '}
          <span
            className='bg-gradient-to-r from-[#ff00a9] to-[#ff8370] bg-clip-text text-transparent'
            style={{}}
          >
            lightweight workspace
          </span>
        </p>
        <p className='text-4xl font-semibold'>Built for all of us.</p>
      </div>
    </div>
  )
}

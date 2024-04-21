export default function Loading() {
  return (
    <div className='fixed inset-0 z-[-1] flex flex-col items-center justify-center gap-2 bg-white leading-[100%] text-black'>
      <div className='bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 bg-clip-text text-4xl font-bold text-transparent'>
        <span className='text-5xl'>S</span>
        <span>e</span>
        <span>N</span>
        <span>y</span>
        <span>e</span>
        <span>r</span>
        <span>'</span>
        <span>A</span>
        <sup className='text-xl'>.online</sup>
      </div>

      <div className='h-0.5 w-60 rounded bg-gradient-to-r from-yellow-500 from-10% via-sky-500 via-30% to-lime-500 to-90%'></div>
    </div>
  )
}

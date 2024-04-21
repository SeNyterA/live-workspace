import './landing.scss'

const Intro = () => {
  return (
    <div className='section relative h-screen text-black bg-gray-950'>
      {/* <video
        src='./intro.webm'
        autoPlay
        muted
        loop
        playsInline
        className='absolute right-0 top-0 h-[80vh] w-full object-cover'
      /> */}
      <p className='intro-text absolute left-[10%] top-[60%] z-10 bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 bg-clip-text text-7xl font-bold text-transparent'>
        <span className='text-9xl'>S</span>
        <span>e</span>
        <span>N</span>
        <span>y</span>
        <span>e</span>
        <span>r</span>
        <span>'</span>
        <span>A</span>
        <sup className='text-xl'>.online</sup>
      </p>
    </div>
  )
}

const Features = () => {
  return (
    <div className='section relative h-screen bg-gray-400 text-black'></div>
  )
}

export default function LandingContent() {
  return (
    <>
      <Intro />
      <Features />
    </>
  )
}

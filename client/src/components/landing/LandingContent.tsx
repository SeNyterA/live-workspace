import './landing.scss'

const Intro = () => {
  return (
    <div className='section relative h-screen bg-gray-950 text-gray-50'>
      <div className='intro relative'>
        <p
          data-text="&nbsp;SeNyter'A&nbsp;"
          className='intro-text z-10 text-7xl font-bold text-transparent'
        >
          &nbsp;
          <span className='text-9xl'>S</span>
          <span>eNyter'A</span>
          <sup className='text-xl'>.online</sup>
          &nbsp;
        </p>

        <p
          data-text="&nbsp;SeNyter'A&nbsp;"
          className='intro-overlay absolute top-0 z-10 bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 bg-clip-text text-7xl font-bold text-transparent'
        >
          &nbsp;
          <span className='text-9xl'>S</span>
          <span>eNyter'A</span>
          <sup className='text-xl'>.online</sup>
          &nbsp;
        </p>
      </div>
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

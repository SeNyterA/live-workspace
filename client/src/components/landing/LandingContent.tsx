import './landing.scss'

const Intro = () => {
  return (
    <div className='section relative h-screen bg-gray-950 text-gray-50'>
      <p
        data-text="&nbsp;SeNyter'A&nbsp;"
        className='intro-text relative z-10 text-7xl font-bold text-transparent'
      >
        &nbsp;
        <span className='text-9xl'>S</span>
        <span>eNyter'A</span>
        <sup className='text-xl'>.online</sup>
        &nbsp;
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

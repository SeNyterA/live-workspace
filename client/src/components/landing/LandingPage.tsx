import LandingContent from './LandingContent'
import Loading from './Loading'
import './landing.scss'

export default function LandingPage() {
  return (
    // <div className='landing'>
    //   <svg className='filter'>
    //     <filter id='alphaRed'>
    //       <feColorMatrix
    //         mode='matrix'
    //         values='1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'
    //         result='joint'
    //       />
    //     </filter>
    //     <filter id='alphaGreen'>
    //       <feColorMatrix
    //         mode='matrix'
    //         values='0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0'
    //         result='joint'
    //       />
    //     </filter>
    //     <filter id='alphaBlue'>
    //       <feColorMatrix
    //         mode='matrix'
    //         values='0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0'
    //         result='joint'
    //       />
    //     </filter>
    //     <filter id='alpha'>
    //       <feColorMatrix type='saturate' values='0' />
    //     </filter>
    //   </svg>
    //   <div className='page'>
    //     <div className='imgWrap'>
    //       <img className='red' src='/auth-bg.jpg' />
    //       <img className='green' src='/auth-bg.jpg' />
    //       <img className='blue' src='/auth-bg.jpg' />
    //       <p className='text'>
    //         <span>Live workspace</span>
    //       </p>
    //     </div>
    //   </div>
    // </div>
    <>
      <LandingContent />
      {/* <Loading /> */}
    </>
  )
}

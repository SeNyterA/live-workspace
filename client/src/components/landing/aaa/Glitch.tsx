import { useEffect } from 'react'

export default function Glitch() {
  useEffect(() => {
    const bg = document.querySelector('.glitch')

    if (!bg) return
    const count = 20
    for (let i = 0; i < count; i++) {
      let glitchBox = document.createElement('div')
      if (!bg) return
      glitchBox.className = 'box'
      bg.appendChild(glitchBox)
    }
    const interval = setTimeout(() => {
      let glitch = document.getElementsByClassName('box') as any

      console.log({ glitch })
      for (let i = 0; i < glitch.length; i++) {
        glitch[i].style.left = Math.floor(Math.random() * 100) + 'vw'
        glitch[i].style.top = Math.floor(Math.random() * 100) + 'vh'
        glitch[i].style.width = Math.floor(Math.random() * 300) + 'px'
        glitch[i].style.height = Math.floor(Math.random() * 300) + 'px'
        glitch[i].style.backgroundPosition =
          Math.floor(Math.random() * 50) + 'px'
        // glitch[i].style.backgroundSize = Math.floor(Math.random() * 50) + 'px'
        // glitch[i].style.animationDuration = Math.floor(Math.random() * 5) + 's'
      }
    }, 0)
    return () => clearInterval(interval)
  }, [])
  return <div className='glitch'></div>
}

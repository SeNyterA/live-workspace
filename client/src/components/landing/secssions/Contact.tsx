import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import React, { useRef } from 'react'
import { FiArrowRight } from 'react-icons/fi'

const Contact = () => {
  return (
    <section className='absolute inset-0 flex items-end justify-center gap-10 p-10'>
      <div className='mx-auto w-full'>
        <Link
          heading='Github'
          subheading='Check out my projects'
          imgSrc='/github.png'
          href='https://github.com/SeNyterA'
        />
        <Link
          heading='+84 849 630 412'
          subheading='Call me anytime'
          imgSrc='/phone.jpeg'
          href='tel:'
        />
        <Link
          heading='Senytera@gmail.com'
          subheading='Get in touch with me'
          imgSrc='/email.webp'
          href='mailto:'
        />
      </div>
      <video
        autoPlay
        loop
        muted
        playsInline
        className='h-full w-full flex-1 rounded-3xl object-cover'
        src='https://cdn.dribbble.com/userupload/9908185/file/original-db0555d341dd48b24ad15d7564f76175.mp4'
      />
    </section>
  )
}

interface LinkProps {
  heading: string
  imgSrc: string
  subheading: string
  href: string
}

const Link = ({ heading, imgSrc, subheading, href }: LinkProps) => {
  const ref = useRef<HTMLAnchorElement | null>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const top = useTransform(mouseYSpring, [0.5, -0.5], ['40%', '60%'])
  const left = useTransform(mouseXSpring, [0.5, -0.5], ['60%', '70%'])

  const handleMouseMove = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const rect = ref.current!.getBoundingClientRect()

    const width = rect.width
    const height = rect.height

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  return (
    <motion.a
      //   href={href}
      ref={ref}
      onMouseMove={handleMouseMove}
      initial='initial'
      whileHover='whileHover'
      className='group relative flex items-center justify-between border-0 border-solid border-gray-400 py-2 no-underline transition-colors duration-500 hover:border-gray-950'
    >
      <div>
        <motion.span
          variants={{
            initial: { x: 0 },
            whileHover: { x: -16 }
          }}
          transition={{
            type: 'spring',
            staggerChildren: 0.075,
            delayChildren: 0.25
          }}
          className='relative z-10 block text-3xl font-bold text-gray-500 transition-colors duration-500 group-hover:text-gray-950'
        >
          {heading.split('').map((l, i) => (
            <motion.span
              variants={{
                initial: { x: 0 },
                whileHover: { x: 16 }
              }}
              transition={{ type: 'spring' }}
              className='inline-block'
              key={i}
            >
              {l}
            </motion.span>
          ))}
        </motion.span>
        <span className='relative z-10 mt-1 block text-base text-gray-500 transition-colors duration-500 group-hover:text-gray-950'>
          {subheading}
        </span>
      </div>

      <motion.img
        style={{
          top,
          left,
          translateX: '-50%',
          translateY: '-50%'
        }}
        variants={{
          initial: { scale: 0, rotate: '-12.5deg' },
          whileHover: { scale: 1, rotate: '12.5deg' }
        }}
        transition={{ type: 'spring' }}
        src={imgSrc}
        className='absolute z-0 h-24 w-32 rounded-lg object-cover md:h-48 md:w-64'
        // alt={`Image representing a link for ${heading}`}
      />

      <motion.div
        variants={{
          initial: {
            x: '25%',
            opacity: 0
          },
          whileHover: {
            x: '0%',
            opacity: 1
          }
        }}
        transition={{ type: 'spring' }}
        className='relative z-10 p-4'
      >
        <FiArrowRight className='text-5xl text-gray-950' />
      </motion.div>
    </motion.a>
  )
}

export default Contact

import { ScrollArea } from '@mantine/core'
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform
} from 'framer-motion'
import React, { ReactNode, useRef } from 'react'
import { FiArrowUpRight } from 'react-icons/fi'

export const Project = () => {
  const viewPortRef = useRef<HTMLDivElement>(null)

  return (
    <ScrollArea
      className='absolute inset-0 rounded-[20px]'
      viewportRef={viewPortRef}
    >
      <TextParallaxContent
        viewPortRef={viewPortRef}
        imgUrl='https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        subheading='Collaborate'
        heading='Built for all of us.'
      >
        <ExampleContent />
      </TextParallaxContent>
      <TextParallaxContent
        viewPortRef={viewPortRef}
        imgUrl='https://images.unsplash.com/photo-1530893609608-32a9af3aa95c?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        subheading='Quality'
        heading='Never compromise.'
      >
        <ExampleContent />
      </TextParallaxContent>
      <TextParallaxContent
        viewPortRef={viewPortRef}
        imgUrl='https://images.unsplash.com/photo-1504610926078-a1611febcad3?q=80&w=2416&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        subheading='Modern'
        heading='Dress for the best.'
      >
        <ExampleContent />
      </TextParallaxContent>
    </ScrollArea>
  )
}

const IMG_PADDING = 0

const TextParallaxContent = ({
  imgUrl,
  subheading,
  heading,
  children,
  viewPortRef
}: {
  imgUrl: string
  subheading: string
  heading: string
  children: ReactNode
  viewPortRef: React.RefObject<HTMLDivElement>
}) => {
  return (
    <div
      style={{
        paddingLeft: IMG_PADDING,
        paddingRight: IMG_PADDING
      }}
    >
      <div className='relative h-[150vh]'>
        <StickyImage imgUrl={imgUrl} viewPortRef={viewPortRef} />
        <OverlayCopy
          heading={heading}
          subheading={subheading}
          viewPortRef={viewPortRef}
        />
      </div>
      {children}
    </div>
  )
}

const StickyImage = ({
  imgUrl,
  viewPortRef
}: {
  imgUrl: string
  viewPortRef: React.RefObject<HTMLDivElement>
}) => {
  const targetRef = useRef(null)
  const { scrollYProgress, scrollY } = useScroll({
    target: targetRef,
    container: viewPortRef,
    offset: ['end end', 'end start'],
    layoutEffect: false
  })

  useMotionValueEvent(scrollY, 'change', latest => {
    console.log(latest)
  })

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  return (
    <motion.div
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: `calc(100vh - 128px - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale
      }}
      ref={targetRef}
      className='sticky z-0 overflow-hidden rounded-3xl'
    >
      <motion.div
        className='absolute inset-0 bg-neutral-950/70'
        style={{
          opacity
        }}
      />
    </motion.div>
  )
}

const OverlayCopy = ({
  subheading,
  heading,
  viewPortRef
}: {
  subheading: string
  heading: string
  viewPortRef: React.RefObject<HTMLDivElement>
}) => {
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    container: viewPortRef,
    offset: ['start end', 'end start'],
    layoutEffect: false
  })

  const y = useTransform(scrollYProgress, [0, 1], [250, -250])
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0])

  return (
    <motion.div
      style={{
        y,
        opacity
      }}
      ref={targetRef}
      className='absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center text-white'
    >
      <p className='mb-2 text-center text-xl md:mb-4 md:text-3xl'>
        {subheading}
      </p>
      <p className='text-center text-4xl font-bold md:text-7xl'>{heading}</p>
    </motion.div>
  )
}

const ExampleContent = () => (
  <div className='mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12'>
    <h2 className='col-span-1 text-3xl font-bold md:col-span-4'>
      Additional content explaining the above card here
    </h2>
    <div className='col-span-1 md:col-span-8'>
      <p className='mb-4 text-xl text-neutral-600 md:text-2xl'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi,
        blanditiis soluta eius quam modi aliquam quaerat odit deleniti minima
        maiores voluptate est ut saepe accusantium maxime doloremque nulla
        consectetur possimus.
      </p>
      <p className='mb-8 text-xl text-neutral-600 md:text-2xl'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
        reiciendis blanditiis aliquam aut fugit sint.
      </p>
      <button className='w-full rounded bg-neutral-900 px-9 py-4 text-xl text-white transition-colors hover:bg-neutral-700 md:w-fit'>
        Learn more <FiArrowUpRight className='inline' />
      </button>
    </div>
  </div>
)

import { motion } from 'framer-motion'
import { Dispatch, SetStateAction, useState } from 'react'

export const Chip = ({
  text,
  selected,
  setSelected
}: {
  text: string
  selected: boolean
  setSelected: Dispatch<SetStateAction<string>>
}) => {
  return (
    <button
      onClick={() => setSelected(text)}
      className={`${
        selected
          ? 'text-white'
          : 'text-slate-950 hover:bg-slate-700 hover:text-slate-200'
      } relative rounded-md border-none bg-blend-multiply cursor-pointer bg-transparent px-2.5 py-0.5 text-base outline-none transition-colors`}
    >
      <span className='relative z-10'>{text}</span>
      {selected && (
        <motion.span
          layoutId='pill-tab'
          transition={{ type: 'spring', duration: 0.5 }}
          className='absolute inset-0 z-0 rounded-md bg-gradient-to-r from-violet-500 to-indigo-500'
        ></motion.span>
      )}
    </button>
  )
}

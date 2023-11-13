import { RootState, useAppSelector } from './store'

export default function Watching<T>({
  watchingFn,
  children
}: {
  children: (value?: T) => any
  watchingFn: (state: RootState) => T
}) {
  const state = useAppSelector(watchingFn)
  return children(state)
}

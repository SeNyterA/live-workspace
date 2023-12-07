import { Modal } from '@mantine/core'

export default function DetailCard({ cardId }: { cardId?: string }) {
  return (
    <Modal
      onClose={() => {}}
      opened={!!cardId}
      title={<p className='text-lg font-semibold'>Create direct channel</p>}
    ></Modal>
  )
}

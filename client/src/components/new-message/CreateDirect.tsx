// import { Button, Drawer, Select } from '@mantine/core'
// import { useDebouncedValue } from '@mantine/hooks'
// import { IconSearch } from '@tabler/icons-react'
// import { useState } from 'react'
// import { useAppQuery } from '../../services/apis/useAppQuery'

// export default function CreateDirect({
//   onClose,
//   isOpen
// }: {
//   isOpen: boolean
//   onClose: () => void
// }) {
//   const [searchValue, setSearchValue] = useState('')
//   const [keyword] = useDebouncedValue(searchValue, 200)
//   const { data, isLoading } = useAppQuery({
//     key: 'findUsersByKeyword',
//     url: {
//       baseUrl: '/users/by-keyword',
//       queryParams: {
//         keyword
//       }
//     },
//     options: {
//       queryKey: [keyword],
//       enabled: !!keyword
//     }
//   })

//   return (
//     <Drawer
//       onClose={onClose}
//       opened={isOpen}
//       title={<p className='text-lg font-semibold'>Send direct</p>}
//       overlayProps={{
//         color: '#000',
//         backgroundOpacity: 0.2,
//         blur: 0.5
//       }}
//       classNames={{
//         content: 'rounded-lg flex flex-col',
//         inner: 'p-3',
//         body: 'flex flex-col flex-1'
//       }}
//     >
//       <Select
//         label='Group member'
//         description='Description for the direct'
//         placeholder='Username, email, nickName...'
//         leftSection={<IconSearch size={16} />}
//         limit={10}
//         searchable
//         searchValue={searchValue}
//         onSearchChange={value => setSearchValue(value)}
//         className='mt-2'
//       />

//       <div className='mt-2 flex items-center justify-end gap-3'>
//         <Button variant='default' color='red'>
//           Close
//         </Button>
//         <Button>Create</Button>
//       </div>
//     </Drawer>
//   )
// }

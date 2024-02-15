import { Textarea, TextInput } from '@mantine/core'

export default function EditInfo() {
  return (
    <div className='w-96'>
      <div className='text-lg font-bold'>Team Information</div>
      <TextInput
        data-autofocus
        withAsterisk
        label='Team Name'
        placeholder='Enter the team name'
        description='Leave it blank to use the default name...'
        size='sm'
      />

      <Textarea
        label='Team Description'
        description='Description for the team'
        placeholder='Enter a description for the team...'
        className='mt-2'
      />
    </div>
  )
}

import {
  ActionIcon,
  Avatar,
  Button,
  Divider,
  NavLink,
  ScrollArea
} from '@mantine/core'
import {
  IconAdjustments,
  IconArrowRight,
  IconHash,
  IconLayoutKanban,
  IconMessage,
  IconSearch,
  IconUsersGroup
} from '@tabler/icons-react'

const intData = [
  {
    icon: <IconLayoutKanban size='1rem' stroke={1.5} />,
    title: 'Board',
    chidren: [
      {
        isPublic: true,
        title: 'Genaral'
      },
      {
        isPublic: true,
        title: 'Notification'
      },
      {
        isPublic: false,
        title: 'Private board 1'
      },
      {
        isPublic: false,
        title: 'Private board 2'
      }
    ]
  },
  {
    icon: <IconHash size='1rem' stroke={1.5} />,
    title: 'Channel',
    chidren: [
      {
        isPublic: true,
        title: 'Genaral'
      },
      {
        isPublic: true,
        title: 'Notification'
      },
      {
        isPublic: false,
        title: 'Private channel 1'
      },
      {
        isPublic: false,
        title: 'Private channel 2'
      }
    ]
  },

  {
    icon: <IconUsersGroup size='1rem' stroke={1.5} />,
    title: 'Group',
    chidren: [
      {
        isPublic: true,
        title: 'Genaral'
      },
      {
        isPublic: true,
        title: 'Notification'
      },
      {
        isPublic: false,
        title: 'Private board 1'
      },
      {
        isPublic: false,
        title: 'Private board 2'
      }
    ]
  },
  {
    icon: <IconMessage size='1rem' stroke={1.5} />,
    title: 'Direct message',
    chidren: [
      {
        isPublic: true,
        title: 'Genaral',
        icon: <Avatar size='xs' />
      },
      {
        isPublic: true,
        title: 'Notification',
        icon: <Avatar size='xs' />
      },
      {
        isPublic: false,
        title: 'Private board 1',
        icon: <Avatar size='xs' />
      },
      {
        isPublic: false,
        title: 'Private board 2',
        icon: <Avatar size='xs' />
      }
    ]
  }
]

export default function TeamSidebar() {
  return (
    <div className='w-72 flex py-3 flex-col gap-2'>
      <p className='text-xl px-4'>Team name </p>
      <div className='flex gap-2 items-center justify-center px-4'>
        <Button
          variant='default'
          size='xs'
          className='flex-1'
          leftSection={<IconSearch size={14} />}
          rightSection={<IconArrowRight size={14} />}
        >
          <p>Search on team</p>
        </Button>
        <ActionIcon
          variant='default'
          aria-label='Settings'
          className='w-[30px] h-[30px]'
        >
          <IconAdjustments
            style={{ width: '70%', height: '70%' }}
            stroke={1.5}
          />
        </ActionIcon>
      </div>

      <Divider className='mx-4' />

      <div className='flex-1 relative'>
        <ScrollArea scrollbarSize={6} className='inset-0 absolute px-4'>
          {intData.map((group, index) => (
            <NavLink
              key={index}
              className='p-1'
              label={group.title}
              leftSection={group.icon}
            >
              {group.chidren.map((item, index) => (
                <NavLink key={index} className='p-1' label={item.title} />
              ))}

              {/* <NavLink className='p-1' label='Nested parent link'>
                <NavLink className='p-1' label='First child link' />
                <NavLink className='p-1' label='Second child link' />
                <NavLink className='p-1' label='Third child link' />
              </NavLink> */}
            </NavLink>
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}

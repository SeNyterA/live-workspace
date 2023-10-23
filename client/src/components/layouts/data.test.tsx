import { Avatar } from '@mantine/core'
import {
  IconHash,
  IconLayoutKanban,
  IconMessage,
  IconUsersGroup
} from '@tabler/icons-react'

const generateId = () => {
  return Math.random().toString(36).substring(7)
}

export const intData = [
  {
    id: generateId(), // Thêm id cho mỗi đối tượng
    icon: <IconLayoutKanban size='1rem' stroke={1.5} />,
    title: 'Board',
    type: 'board',
    children: [
      {
        id: generateId(), // Thêm id cho mỗi đối tượng con
        isPublic: true,
        title: 'General'
      },
      {
        id: generateId(),
        isPublic: true,
        title: 'Notification'
      },
      {
        id: generateId(),
        isPublic: false,
        title: 'Private board 1'
      },
      {
        id: generateId(),
        isPublic: false,
        title: 'Private board 2'
      }
    ]
  },
  {
    id: generateId(),
    icon: <IconHash size='1rem' stroke={1.5} />,
    title: 'Channel',
    type: 'channel',
    children: [
      {
        id: generateId(),
        isPublic: true,
        title: 'General'
      },
      {
        id: generateId(),
        isPublic: true,
        title: 'Notification'
      },
      {
        id: generateId(),
        isPublic: false,
        title: 'Private channel 1'
      },
      {
        id: generateId(),
        isPublic: false,
        title: 'Private channel 2'
      }
    ]
  },
  {
    id: generateId(),
    icon: <IconUsersGroup size='1rem' stroke={1.5} />,
    title: 'Group',
    type: 'group',
    children: [
      {
        id: generateId(),
        isPublic: true,
        title: 'General'
      },
      {
        id: generateId(),
        isPublic: true,
        title: 'Notification'
      },
      {
        id: generateId(),
        isPublic: false,
        title: 'Private board 1'
      },
      {
        id: generateId(),
        isPublic: false,
        title: 'Private board 2'
      }
    ]
  },
  {
    id: generateId(),
    icon: <IconMessage size='1rem' stroke={1.5} />,
    title: 'Direct message',
    type: 'direct-message',
    children: [
      {
        id: generateId(),
        isPublic: true,
        title: 'General',
        icon: <Avatar size='xs' />
      },
      {
        id: generateId(),
        isPublic: true,
        title: 'Notification',
        icon: <Avatar size='xs' />
      },
      {
        id: generateId(),
        isPublic: false,
        title: 'Private board 1',
        icon: <Avatar size='xs' />
      },
      {
        id: generateId(),
        isPublic: false,
        title: 'Private board 2',
        icon: <Avatar size='xs' />
      }
    ]
  }
]

// Sử dụng mảng intData ở đây

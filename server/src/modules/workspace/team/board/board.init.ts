import { Card, Property, PropertyOption, PropertyType } from '@prisma/client'

import { v4 as uuidv4 } from 'uuid'

export const generateBoardData = ({
  boardId
}: {
  boardId: string
}): {
  properties: Partial<Property>[]
  cards: Partial<Card>[]
  options: Partial<PropertyOption>[]
} => {
  const properties: Partial<Property>[] = [
    {
      id: uuidv4(),
      title: 'Status',
      workspaceId: boardId,
      order: 1,
      type: PropertyType.Select
    },
    {
      id: uuidv4(),
      title: 'Progress',
      workspaceId: boardId,
      order: 2,
      type: PropertyType.String
    },
    {
      id: uuidv4(),
      title: 'Assignee',
      workspaceId: boardId,
      order: 3,
      type: PropertyType.People
    }
  ]

  const options: Partial<PropertyOption>[] = [
    {
      id: uuidv4(),
      color: '#FF0000',
      title: 'To Do',
      propertyId: properties[0].id,
      order: 1
    },
    {
      id: uuidv4(),
      color: '#00FF00',
      title: 'In Progress',
      propertyId: properties[0].id,
      order: 2
    },
    {
      id: uuidv4(),
      color: '#0000FF',
      title: 'Done',
      propertyId: properties[0].id,
      order: 3
    },
    {
      id: uuidv4(),
      color: '#FFFF00',
      title: 'Review',
      propertyId: properties[0].id,
      order: 4
    },
    {
      id: uuidv4(),
      color: '#FF00FF',
      title: 'Blocked',
      propertyId: properties[0].id,
      order: 5
    },
    {
      id: uuidv4(),
      color: '#008080',
      title: 'On Hold',
      propertyId: properties[0].id,
      order: 6
    }
  ]

  const cards: Partial<Card>[] = [
    {
      title: 'Fix login page UI',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Implement backend authentication',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Design landing page',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Add forgot password functionality',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Optimize database queries',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Update documentation',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Refactor CSS codebase',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Fix email sending issue',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Implement user profile settings',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Conduct user testing',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Update website images',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Fix broken links',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Optimize frontend performance',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Add new feature: Dark mode',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Integrate payment gateway',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Fix broken API endpoints',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Create user onboarding tutorial',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Update terms of service',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Fix responsive design issues',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Implement email notifications',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Design new logo',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Update admin dashboard UI',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Fix security vulnerabilities',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Add social media sharing functionality',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Create automated tests',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Update privacy policy',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Fix broken login API',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Implement two-factor authentication',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Optimize server response time',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Update user interface text',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Fix broken signup form',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Implement file upload functionality',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Add support for multiple languages',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Create user feedback survey',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Update FAQ section',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Fix broken checkout process',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Implement live chat support',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Design email templates',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Update product pricing',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Fix broken password reset functionality',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Add subscription plans',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Create user testimonials section',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Update product images',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Fix broken contact form',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Implement feedback submission feature',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Design newsletter templates',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Update product descriptions',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Fix broken product search functionality',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Add product comparison feature',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Create product demo videos',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Update customer support documentation',
      workspaceId: boardId,
      order: Math.random() * 100,
      properties: {
        [properties[0].id]: options[Math.floor(Math.random() * 6)].id,
        [properties[1].id]: `${(Math.random() * 100) % 100}%`
      }
    }
  ]

  return { properties, options, cards }
}

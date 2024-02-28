import { EFieldType } from 'src/entities/board/property.entity'
import { v4 as uuidv4 } from 'uuid'

export const generateBoardData = ({ boardId }: { boardId: string }) => {
  const properties = [
    {
      _id: uuidv4(),
      title: 'Status',
      board: { _id: boardId },
      order: 1,
      fieldType: EFieldType.Select
    },
    {
      _id: uuidv4(),
      title: 'Progress',
      board: { _id: boardId },
      order: 2,
      fieldType: EFieldType.String
    },
    {
      _id: uuidv4(),
      title: 'Assignee',
      board: { _id: boardId },
      order: 3,
      fieldType: EFieldType.People
    }
  ]

  const options = [
    {
      _id: uuidv4(),
      color: '#FF0000',
      title: 'To Do',
      property: { _id: properties[0]._id },
      board: { _id: boardId },
      order: 1
    },
    {
      _id: uuidv4(),
      color: '#00FF00',
      title: 'In Progress',
      property: { _id: properties[0]._id },
      board: { _id: boardId },
      order: 2
    },
    {
      _id: uuidv4(),
      color: '#0000FF',
      title: 'Done',
      property: { _id: properties[0]._id },
      board: { _id: boardId },
      order: 3
    },
    {
      _id: uuidv4(),
      color: '#FFFF00',
      title: 'Review',
      property: { _id: properties[0]._id },
      board: { _id: boardId },
      order: 4
    },
    {
      _id: uuidv4(),
      color: '#FF00FF',
      title: 'Blocked',
      property: { _id: properties[0]._id },
      board: { _id: boardId },
      order: 5
    },
    {
      _id: uuidv4(),
      color: '#008080',
      title: 'On Hold',
      property: { _id: properties[0]._id },
      board: { _id: boardId },
      order: 6
    }
  ]

  const cards = [
    {
      title: 'Fix login page UI',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Implement backend authentication',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Design landing page',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Add forgot password functionality',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Optimize database queries',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Update documentation',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Refactor CSS codebase',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Fix email sending issue',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Implement user profile settings',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Conduct user testing',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Update website images',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Fix broken links',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Optimize frontend performance',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Add new feature: Dark mode',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Integrate payment gateway',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Fix broken API endpoints',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Create user onboarding tutorial',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Update terms of service',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Fix responsive design issues',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Implement email notifications',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Design new logo',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Update admin dashboard UI',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Fix security vulnerabilities',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Add social media sharing functionality',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Create automated tests',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Update privacy policy',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Fix broken login API',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Implement two-factor authentication',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Optimize server response time',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Update user interface text',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Fix broken signup form',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Implement file upload functionality',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Add support for multiple languages',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Create user feedback survey',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Update FAQ section',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Fix broken checkout process',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Implement live chat support',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Design email templates',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Update product pricing',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Fix broken password reset functionality',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Add subscription plans',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Create user testimonials section',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Update product images',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Fix broken contact form',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Implement feedback submission feature',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Design newsletter templates',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Update product descriptions',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Fix broken product search functionality',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Add product comparison feature',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Create product demo videos',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    },
    {
      title: 'Update customer support documentation',
      board: { _id: boardId },
      properties: {
        [properties[0]._id]: options[Math.floor(Math.random() * 6)]._id,
        [properties[1]._id]: `${(Math.random() * 100) % 100}%`
      }
    }
  ]

  return { properties, options, cards }
}

import { Button, FileButton, Menu } from '@mantine/core'
import {
  IconCheckbox,
  IconFile,
  IconLineDashed,
  IconTextSize,
  IconTrash
} from '@tabler/icons-react'
import useAppParams from '../../../hooks/useAppParams'
import { useAppMutation } from '../../../services/apis/useAppMutation'
import { EBlockType } from '../../../types/workspace.type'

export default function BlockActions() {
  const { boardId, cardId } = useAppParams()
  const { mutateAsync: createBlock } = useAppMutation('createBlock')
  const { mutateAsync: uploadFile } = useAppMutation('uploadFile', {
    headers: {
      'Content-Type': undefined
    }
  })
  return (
    <Menu shadow='md'>
      <Menu.Target>
        <Button variant='outline'>Toggle menu</Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Create at below</Menu.Label>
        <Menu.Item
          leftSection={<IconTextSize size={16} />}
          onClick={() => {
            createBlock({
              method: 'post',
              url: {
                baseUrl: '/workspace/boards/:boardId/cards/:cardId/blocks',
                urlParams: {
                  boardId: boardId!,
                  cardId: cardId!
                },
                queryParams: {
                  index: -1
                }
              },

              payload: {
                blockType: EBlockType.Text
              }
            })
          }}
        >
          Text
        </Menu.Item>
        <Menu.Item
          leftSection={<IconCheckbox size={16} />}
          onClick={() => {
            createBlock({
              method: 'post',
              url: {
                baseUrl: '/workspace/boards/:boardId/cards/:cardId/blocks',
                urlParams: {
                  boardId: boardId!,
                  cardId: cardId!
                },
                queryParams: {
                  index: -1
                }
              },

              payload: {
                blockType: EBlockType.Checkbox
              }
            })
          }}
        >
          Checkbox
        </Menu.Item>

        <FileButton
          inputProps={{
            value: ''
          }}
          onChange={async files => {
            console.log(files)
            if (files) {
              const urls: string[] = []
              const uploadPromises = Array.from(files).map(file => {
                const formData = new FormData()
                formData.append('file', file)

                return uploadFile({
                  method: 'post',
                  url: {
                    baseUrl: '/upload'
                  },
                  payload: formData
                })
                  .then(data => {
                    console.log(data)
                    urls.push(data.url)
                  })
                  .catch(error => {
                    console.error('File upload failed', error)
                  })
              })

              await Promise.all(uploadPromises)

              createBlock({
                method: 'post',
                url: {
                  baseUrl: '/workspace/boards/:boardId/cards/:cardId/blocks',
                  urlParams: {
                    boardId: boardId!,
                    cardId: cardId!
                  },
                  queryParams: {
                    index: -1
                  }
                },
                payload: {
                  blockType: EBlockType.Files,
                  files: urls
                }
              })
            }
          }}
          accept='image/png,image/jpeg'
          multiple
        >
          {({ onClick }) => (
            <Menu.Item
              onClick={() => {
                onClick()
              }}
              leftSection={<IconFile size={16} />}
            >
              Files
            </Menu.Item>
          )}
        </FileButton>

        <Menu.Item
          leftSection={<IconLineDashed size={16} />}
          onClick={() => {
            createBlock({
              method: 'post',
              url: {
                baseUrl: '/workspace/boards/:boardId/cards/:cardId/blocks',
                urlParams: {
                  boardId: boardId!,
                  cardId: cardId!
                },
                queryParams: {
                  index: -1
                }
              },

              payload: {
                blockType: EBlockType.Divider
              }
            })
          }}
        >
          Divider
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>

        <Menu.Item color='red' leftSection={<IconTrash size={16} />}>
          Delete block
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

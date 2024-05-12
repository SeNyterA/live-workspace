import { TFile } from '../../types'

export type TUploadMutionApi = {
  uploadFile: {
    url: {
      baseUrl: '/upload'
    }
    method: 'post'
    payload: { file: File }
    isFormData: true
    response: TFile
  }
}

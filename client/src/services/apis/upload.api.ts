import { TFile } from '../../new-types/file'

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

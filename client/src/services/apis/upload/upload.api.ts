export type TUploadMutionApi = {
  uploadFile: {
    url: {
      baseUrl: '/upload'
    }
    method: 'post'
    // A FormData instance with the file attached.
    // const formData = new FormData();
    // formData.append('file', file);
    payload: FormData
    response: any
  }
}

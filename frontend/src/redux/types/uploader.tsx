// ADTs
interface Empty {
  kind: 'Empty'
}

interface Loading {
  kind: 'Loading',
  progress: number,
}

interface UploadSuccess {
  kind: 'UploadSuccess',
}

export type UploadData = Empty | Loading | UploadSuccess

// Reducer types
export const enum UploaderActionTypes {
  UPLOAD_REQUEST = '@@uploader/UPLOAD_REQUEST',
  UPLOAD_LOADING = '@@uploader/UPLOAD_LOADING',
  UPLOAD_SUCCESS = '@@uploader/UPLOAD_SUCCESS',
}

export interface UploaderState {
  readonly uploadState: UploadData,
}

import { Reducer, Dispatch } from 'redux'
import { action } from 'typesafe-actions'

import { UploaderState } from '../types/uploader'
import api from '../../utils/api'

export const initialState: UploaderState = {
  uploadState: {
    kind: 'Empty',
  },
}

export const UploaderActionTypes = {
  UPLOAD_REQUEST: '@@uploader/UPLOAD_REQUEST',
  UPLOAD_LOADING: '@@uploader/UPLOAD_LOADING',
  UPLOAD_SUCCESS: '@@uploader/UPLOAD_SUCCESS',
}

// Reducer
export const uploaderReducer: Reducer<UploaderState> = (state = initialState, action) => {
  switch (action.type) {
    case UploaderActionTypes.UPLOAD_REQUEST:
      return {
        ...state,
        uploadState: {
          kind: 'Empty'
        }
      }
    case UploaderActionTypes.UPLOAD_LOADING:
      return {
        ...state,
        uploadState: {
          kind: 'Loading',
          progress: action.payload,
        }
      }
    default:
      return state
  }
}

// Actions
// export const uploadImg = (files: File[], endpoint: string, field: string, dispatch:Dispatch) => {

//   return action(
//     UploaderActionTypes.UPLOAD_REQUEST,
//     {
//       file: files[0],
//       endpoint,
//       field,
//     },
//     dispatch,
//    )
// }

// const updateUploadProgress = (progress: any) => {

//   return action(UploaderActionTypes.UPLOAD_LOADING, progress)
// }

// function* sendImg(action: ActionType<typeof uploadImg>) {
//   try {
//     const token = yield call(getAccessToken)
//     const encodedFile = yield call(getBase64, action.payload.file)
//     const reqPayload = yield call(preparePayload, encodedFile, action.payload.field)

//     const [ uploadPromise, channel ] = createUploadChannel(
//       action.payload.endpoint,
//       reqPayload,
//       token,
//       action.meta,
//     )
    
//     yield fork(watchOnProgress, channel);

//     try {
//       const result = yield call(() => uploadPromise)

//       // yield put(getPartner(partnerId, action.meta))
//     }
//     catch (error) {
//       console.log(error)
//     }
//   }
//   catch (error) {
//     console.log(error)
//   }
// }

// function* watchOnProgress(channel) {
//   while(true) {
//     const progress = yield take(channel)

//     yield put(updateUploadProgress(progress))
//   }
// }

// function* uploaderWatcher() {
//   yield takeLatest(UploaderActionTypes.UPLOAD_REQUEST, sendImg)
// }

// export function* uploaderSaga() {
//   yield all([
//     fork(uploaderWatcher),
//   ])
// }

// Side Effects Services
// const createUploadChannel = (endpoint: string, payload: string, token: string, dispatch: Dispatch) => {
//   let emit;
//   const channel = eventChannel(
//     emitter => {
//       emit = emitter

//       return () => {}
//     }
//   )

//   const uploadPromise = api.put(
//     endpoint,
//     payload,
//     { 'Access-Token': token },
//     dispatch,
//     (
//       e => {
//         if (e.lengthComputable) {
//           const progress = Math.round(e.loaded / e.total * 100);

//           if (progress === 1) {
//             console.log('progress', progress)
//             emit(END)
//           }
//           else {
//             console.log('progress', progress)
//             emit(progress);
//           }
//         }
//       }
//     )
//   )

//   return [ uploadPromise, channel ]
// }

// const preparePayload = (encodedFile: string, field: string) => {
//   return JSON.stringify({
//     [field]: encodedFile
//   })
// }

// Misc.
export const getBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      let encoded = (reader.result as string).replace(/^data:(.*;base64,)?/, '')

      resolve([encoded, file.name, file.type])
    }
    reader.onerror = error => reject(error)
  })
}

export const apiHelper = (
  method: string,
  endpoint: string,
  payload: any,
  headers: object,
  dispatch: Dispatch,
  progressListener: any
) => {

  switch (method) {
    case 'post':
      return api.post(
        endpoint,
        payload,
        headers,
        dispatch,
        progressListener
      )
    case 'put':
      return api.put(
        endpoint,
        payload,
        headers,
        dispatch,
        progressListener
      )
    default:
      return
  }
}

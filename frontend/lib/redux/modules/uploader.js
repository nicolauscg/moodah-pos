"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = __importDefault(require("../../utils/api"));
exports.initialState = {
    uploadState: {
        kind: 'Empty',
    },
};
exports.UploaderActionTypes = {
    UPLOAD_REQUEST: '@@uploader/UPLOAD_REQUEST',
    UPLOAD_LOADING: '@@uploader/UPLOAD_LOADING',
    UPLOAD_SUCCESS: '@@uploader/UPLOAD_SUCCESS',
};
// Reducer
exports.uploaderReducer = (state = exports.initialState, action) => {
    switch (action.type) {
        case exports.UploaderActionTypes.UPLOAD_REQUEST:
            return Object.assign({}, state, { uploadState: {
                    kind: 'Empty'
                } });
        case exports.UploaderActionTypes.UPLOAD_LOADING:
            return Object.assign({}, state, { uploadState: {
                    kind: 'Loading',
                    progress: action.payload,
                } });
        default:
            return state;
    }
};
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
exports.getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
            resolve([encoded, file.name, file.type]);
        };
        reader.onerror = error => reject(error);
    });
};
exports.apiHelper = (method, endpoint, payload, headers, dispatch, progressListener) => {
    switch (method) {
        case 'post':
            return api_1.default.post(endpoint, payload, headers, dispatch, progressListener);
        case 'put':
            return api_1.default.put(endpoint, payload, headers, dispatch, progressListener);
        default:
            return;
    }
};

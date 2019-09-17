import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose, withHandlers, withReducer } from 'recompose'
import { action } from 'typesafe-actions'

import Dropzone from 'react-dropzone'
import { Progress } from 'reactstrap'

import {
  uploaderReducer,
  initialState,
  getBase64,
  UploaderActionTypes,
} from '../../redux/modules/uploader'

const CirclePlus = `${process.env.PUBLIC_URL}/img/circle-plus.svg`

const WithUploadHandler = compose(
  withReducer('uploader', 'recDispatch', uploaderReducer, initialState),
  withHandlers({
    progressListener: ({ recDispatch }) => e => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100)

        recDispatch(action(UploaderActionTypes.UPLOAD_LOADING, progress))
      }
    },
  }),
  withHandlers({
    onDropAccepted: ({ onDrop }) => files => onDrop(files[0]),
  })
)

const DropzoneImg = WithUploadHandler(props => {
  const {
    uploader: { uploadState },
    onDropAccepted,
  } = props

  const accept = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xls',
    '.xlsx',
    '.csv',
  ]

  switch (uploadState.kind) {
    case 'Empty':
      return (
        <Dropzone
          className="dropzone-img small"
          accept={accept}
          onDropAccepted={onDropAccepted}
        >
          <div className="img-wrapper">
            <img src={CirclePlus} alt="upload" />
          </div>
          <span>Drop files here to upload</span>
        </Dropzone>
      )
    case 'Loading':
      const { progress } = uploadState

      return (
        <Dropzone className="dropzone-img small loading" accept={accept}>
          <Progress value={progress} />
          <span>{progress}%</span>
        </Dropzone>
      )
    default:
      return null
  }
})

DropzoneImg.propTypes = {
  headers: PropTypes.object,
  getPayload: PropTypes.func,
  callbackAction: PropTypes.func,
}

export default connect()(DropzoneImg)

const enhanceGQL = compose(
  withHandlers({
    onDropAccepted: ({ uploader }) => files => {
      getBase64(files[0])
        .then(([encoded, fileName, fileType]) => {
          uploader(encoded, fileName, fileType)
        })
        .catch(error => console.log(error))
    },
  })
)

const Dropzone2 = ({ loading, onDropAccepted }) => {
  if (loading) {
    return (
      <Dropzone
        className="dropzone-img loading"
        accept={'image/jpeg, image/png'}
      >
        <Progress value={100} />
        <span>{100}%</span>
      </Dropzone>
    )
  }

  return (
    <Dropzone
      className="dropzone-img"
      accept={'image/jpeg, image/png'}
      onDropAccepted={onDropAccepted}
    >
      <div className="img-wrapper">
        <img src={CirclePlus} alt="upload" />
      </div>
      <span>Drop files here to upload</span>
    </Dropzone>
  )
}

export const DropzoneGQL = enhanceGQL(Dropzone2)

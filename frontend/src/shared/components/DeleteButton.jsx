import React, { Fragment, useState } from 'react'

import { Button } from 'reactstrap'
import FA from 'react-fontawesome'

import Modal from './form-custom/Modal'

const DeleteButton = ({
  title,
  message,
  loading,
  btnDelete,
  ButtonComp,
  confirm,
  color,
}) => {
  const [open, setOpen] = useState(false)

  const toggle = e => {
    e.stopPropagation()
    setOpen(!open)
  }

  const onConfirm = e => {
    confirm(e)
    setOpen(false)
  }

  return (
    <Fragment>
      {ButtonComp ? (
        <ButtonComp onClick={toggle} />
      ) : (
        <div className="btn-wrapper">
          <Button
            color={color ? color : 'danger'}
            size="sm"
            onClick={toggle}
            className="table-action"
          >
            {btnDelete || 'Hapus'}
          </Button>
        </div>
      )}
      <Modal
        type="dialog"
        title={title}
        body={message}
        action={
          <Fragment>
            <Button
              size="sm"
              color="primary"
              className={`${loading ? 'loading' : ''}`}
              onClick={onConfirm}
            >
              Ya
              {loading && <FA name="circle-o-notch" spin className="spinner" />}
            </Button>
            <Button color="danger" size="sm" onClick={toggle}>
              Tidak
            </Button>
          </Fragment>
        }
        toggle={toggle}
        isOpen={open}
        centered
      />
    </Fragment>
  )
}

export default DeleteButton

import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { Modal } from 'reactstrap'

const ModalComponent = props => {
  const {
    title,
    body,
    colored,
    header,
    toggle,
    footer,
    type,
    subtitle,
    contentClassName,
    action,
    noCloseBtn,
    ...rest
  } = props

  if (type === 'form') {
    return (
      <Modal
        contentClassName={classnames('modal-form', {
          [contentClassName]: contentClassName,
        })}
        {...rest}
      >
        <div className="modal__header">
          {!noCloseBtn ? (
            <button
              className="lnr lnr-cross modal__close-btn"
              onClick={toggle}
            />
          ) : null}
          <h4 className="modal__title">{title}</h4>
          <h5 className="modal__subtitle">{subtitle}</h5>
        </div>
        <div className="modal__body">{body}</div>
      </Modal>
    )
  }

  return (
    <Modal
      contentClassName={classnames('modal-dialog', {
        [contentClassName]: contentClassName,
      })}
      {...rest}
    >
      <div className="modal__header">
        {!noCloseBtn ? (
          <button className="lnr lnr-cross modal__close-btn" onClick={toggle} />
        ) : null}
        <h4 className="modal__title">{title}</h4>
      </div>
      <div className="modal__body">
        <p className="modal__message">{body}</p>
      </div>
      <div className="modal__action">{action}</div>
    </Modal>
  )
}

ModalComponent.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  body: PropTypes.any.isRequired,
  type: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
}

ModalComponent.defaultProps = {
  type: 'dialog',
  zIndex: 2000,
}

export default ModalComponent

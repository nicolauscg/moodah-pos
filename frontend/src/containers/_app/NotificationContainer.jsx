import React, { Fragment } from 'react'
import NotificationSystem from 'rc-notification'
import { connect } from 'react-redux'
import { getContext, compose, withState, withPropsOnChange } from 'recompose'

import { Button } from 'reactstrap'

import { removeNotif, hideDialog } from '../../redux/modules/general'
import { UserInfoContext } from '../../utils/transformers/general'
import { logOut } from '../../redux/modules/auth'

import { FullWideNotification } from '../../shared/components/Notification'
import Modal from '../../shared/components/form-custom/Modal'

let notification

class NotificationContainer extends React.Component {
  componentDidMount() {
    NotificationSystem.newInstance({ style: { top: 0 } }, n => {
      notification = n
    })
  }

  componentWillUnmount() {
    if (notification) {
      notification.destroy()
    }
  }

  showNotif = (id, message, type) => {
    if (notification) {
      notification.notice({
        content: <FullWideNotification color={type} message={message} />,
        duration: 3,
        closable: true,
        style: { top: 0, left: 0 },
      })
    }
  }

  render() {
    const { notifs } = this.props

    notifs.map(({ id, message, type }) => {
      this.props.removeNotif(id)

      return this.showNotif(id, message, type)
    })

    const { title, message } = this.props.dialogContent

    return (
      <Fragment>
        <Modal
          type="dialog"
          title={title}
          body={message}
          action={
            <Button size="sm" color="success" onClick={this.props.hideDialog}>
              Ok
            </Button>
          }
          toggle={this.props.hideDialog}
          isOpen={this.props.dialogState}
          centered
        />
        <Modal
          type="dialog"
          title="Masa berlangganan Anda sudah berakhir."
          body="Mohon maaf, masa berlangganan Anda telah berakhir. Aktifkan kembali akun Anda dengan melakukan pembayaran di Moodah Billing."
          action={
            <Fragment>
              <Button
                color="success"
                onClick={() => window.open('http://admin.moodah.id', '_blank')}
                size="sm"
              >
                Ke Moodah Billing
              </Button>
              <Button onClick={this.props.logOut} size="sm">
                Logout
              </Button>
            </Fragment>
          }
          centered
          isOpen={this.props.openExpired}
          toggle={() => {}}
          noCloseBtn
        />
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  notifs: state.general.notifs,
  dialogState: state.general.dialogState,
  dialogContent: state.general.dialogContent,
})

const mapDispatchToProps = (dispatch, props) => ({
  removeNotif: id => dispatch(removeNotif(id)),
  hideDialog: () => dispatch(hideDialog()),
  logOut: () => {
    props.setOpenExpired(false)
    dispatch(logOut())
  },
})

export default compose(
  getContext(UserInfoContext),
  withState('openExpired', 'setOpenExpired', false),
  withPropsOnChange(['showExpired'], ({ setOpenExpired, showExpired }) => {
    setOpenExpired(showExpired ? true : false)
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(NotificationContainer)

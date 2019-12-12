import React from 'react'
import { compose, withStateHandlers } from 'recompose'
import { Auth } from 'aws-amplify'

import { Card, CardBody, Row, Col, Button } from 'reactstrap'
import StickyBox from 'react-sticky-box'
import { FastField, Field, Form, withFormik } from 'formik'

import {
  AccountSettingsHelp,
  AccountSettingsLabel,
} from './AccountSettingsHelp'
import withNotif from '../../../shared/components/withNotif'

import FormikInput from '../../../shared/components/formik/TextInput'
import Panel from '../../../shared/components/Panel'

const FormContent = ({ onInputFocus }) => {
  return (
    <Form className="col-md-8">
      <Row>
        <Panel
          xs={12}
          title="Pengaturan Password"
          subhead="Isi form ini untuk mengubah password Anda"
          isForm
        >
          <div className="material-form">
            <FastField
              label="Password Lama"
              name="oldPassword"
              type="password"
              required
              inputProps={{ minLength: 8 }}
              onFocus={onInputFocus}
              component={FormikInput}
            />
            <FastField
              label="Password Baru"
              name="newPassword"
              type="password"
              required
              inputProps={{ minLength: 8 }}
              onFocus={onInputFocus}
              component={FormikInput}
            />
          </div>
        </Panel>
      </Row>
      <Button color="primary" size="sm" type="submit">
        Simpan
      </Button>
    </Form>
  )
}

const enhance = compose(
  withNotif,
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: () => ({ oldPassword: '', newPassword: '' }),
    handleSubmit: (values, { props }) => {
      const { oldPassword, newPassword } = values
      const { triggerNotif, setLoading } = props

      setLoading(true)

      Auth.currentAuthenticatedUser()
        .then(user => {
          return Auth.changePassword(user, oldPassword, newPassword)
        })
        .then(data => {
          triggerNotif({ type: 'success', message: 'Password berhasil diubah' })
          setLoading(false)
        })
        .catch(({ code }) => {
          let message

          switch (code) {
            default:
              message = 'Terjadi kesalahan, silakan coba lagi'
              break
            case 'NotAuthorizedException':
              message = 'Password lama yang Anda masukkan salah'
              break
          }

          triggerNotif({
            type: 'danger',
            message,
          })
          setLoading(false)
        })
    },
  })
)

const RouterFormikForm = enhance(FormContent)

const HelpHandler = compose(
  withStateHandlers(
    () => ({
      title: AccountSettingsLabel.name,
      help: AccountSettingsHelp.name,
    }),
    {
      onInputFocus: () => e => {
        const { name } = e.target

        return {
          title: AccountSettingsLabel[name],
          help: AccountSettingsHelp[name],
        }
      },
    }
  )
)

const AccountSettingsForm = ({ title, help, onInputFocus, ...props }) => (
  <Col xs={12}>
    <Card>
      <CardBody>
        <Row>
          <RouterFormikForm {...props} onInputFocus={onInputFocus} />
          <Col md={4}>
            <StickyBox offsetTop={80}>
              <Row>
                <Panel xs={12} title={title} expand={false} isHint>
                  <p>{help}</p>
                </Panel>
              </Row>
            </StickyBox>
          </Col>
        </Row>
      </CardBody>
    </Card>
  </Col>
)

export default HelpHandler(AccountSettingsForm)

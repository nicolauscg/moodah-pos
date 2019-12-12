import React from 'react'
import { compose, withHandlers } from 'recompose'

import { withFormik, Form, FastField } from 'formik'
import { Button } from 'reactstrap'

import FormikInput from '../../../shared/components/formik/TextInput'

class CreatePassForm extends React.Component {
  render() {
    return (
      <Form className="material-form">
        <FastField label="Code" name="code" required component={FormikInput} />
        <FastField
          label="New Password"
          name="password"
          type="password"
          noVisible
          required
          component={FormikInput}
        />
        <FastField
          label="Confirm New Password"
          name="passwordRepeat"
          type="password"
          noVisible
          required
          component={FormikInput}
        />
        <div className="d-inline-block w-100 pt-2">
          <Button
            color="primary"
            className="account__btn account__btn--small"
            type="submit"
            disabled={this.props.loadingSubmit}
          >
            Confirm
          </Button>
          <Button
            color="primary"
            className="account__btn account__btn--small"
            disabled={this.props.loadingResend}
            onClick={this.props.resend}
          >
            Resend Code
          </Button>
        </div>
      </Form>
    )
  }
}

const CreatePassFormik = compose(
  withFormik({
    mapPropsToValues: ({ username }) => ({
      username: username,
      code: '',
      password: '',
      passwordRepeat: '',
    }),
    handleSubmit: (values, { props }) => {
      props.submit(values)
    },
    validate: values => {
      let errors = {}

      if (
        values.password &&
        values.passwordRepeat &&
        values.password !== values.passwordRepeat
      ) {
        errors.passwordRepeat = "Password doesn't match"
      }

      return errors
    },
    displayName: 'CreatePassForm',
    validateOnBlur: true,
    validateOnChange: false,
  }),
  withHandlers({
    resend: ({ values, resend }) => () => {
      resend({ email: values.username }, true)
    },
  })
)(CreatePassForm)

export default CreatePassFormik

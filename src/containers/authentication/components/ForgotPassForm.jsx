import React from 'react'
import { connect } from 'react-redux'

import { withFormik, Form, FastField } from 'formik'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'

import { requestResetPass } from '../../../redux/modules/auth'

import FormikInput from '../../../shared/components/formik/TextInput'

class ForgotPassForm extends React.Component {
  render() {
    const { isSubmitting } = this.props

    return (
      <Form className="material-form">
        <FastField
          label="Email"
          name="email"
          required
          component={FormikInput}
        />
        <div className="d-inline-block w-100 pt-2">
          <Button
            color="primary"
            className="account__btn account__btn--small"
            type="submit"
            disabled={isSubmitting}
          >
            Submit
          </Button>
          <Link
            className="btn btn-outline-primary account__btn account__btn--small"
            to="/log_in"
          >
            Back
          </Link>
        </div>
      </Form>
    )
  }
}

const ForgotPassFormik = withFormik({
  mapPropsToValues: () => ({
    email: '',
  }),
  handleSubmit: (values, { props }) => {
    props.requestResetPass(values)
  },
  displayName: 'ForgotPassForm',
  validateOnBlur: false,
  validateOnChange: false,
})(ForgotPassForm)

const mapDispatchToProps = dispatch => ({
  requestResetPass: formValues => dispatch(requestResetPass(formValues)),
})

export default connect(
  null,
  mapDispatchToProps
)(ForgotPassFormik)

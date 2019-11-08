import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { prop } from 'ramda'
import { connect } from 'react-redux'
import { TextField } from '@material-ui/core';


import { Row, Col, Button } from 'reactstrap'
import StickyBox from 'react-sticky-box'
import { withFormik, Form, FastField, Field } from 'formik'
import {
  compose,
  withState,
  withHandlers,
  withStateHandlers,
  withPropsOnChange,
} from 'recompose'

import {
  preparePartnerFormMasters,
  prepareCountryStates,
  transformPartnerForm,
  prepareCountries,
} from '../../../utils/transformers/partner'
import { addNotif } from '../../../redux/modules/general'
import {
  PartnerFormQuery,
  ResCountries,
  ResCountryStates,
} from '../../../generated-models'

import Panel from '../../../shared/components/Panel'
import FormikInput from '../../../shared/components/formik/TextInput'
import FormCheckbox from '../../../shared/components/form-custom/FormCheckbox'
import FormikCheckbox from '../../../shared/components/formik/Checkbox'
import Select from '../../../shared/components/form-custom/DynamicSelect'

import FormInput from '../../../shared/components/form-custom/FormInput'

const InputAddress = ({ disabled, ...props }) =>
  disabled ? (
    <FastField {...props} disabled={disabled} component={FormikInput} />
  ) : (
    <FastField {...props} component={FormikInput} />
  )

const FormContent = ({
    onInputFocus,
    handleSubmit,
    copyGeneral,
    setGeneralAsShipping
}) => {
    return (
      <Form>
       <Row>
         <Col xs={12} md={6}>
           <FormInput label="Point of Sale Name" defaultValue="Dummy" type="text" variant="outlined" />
         </Col>
       </Row>

       <div className="material-form row d-flex justify-content-center row d-flex justify-content-end">
         <Col xs={12} md={6}>
           <FormCheckbox
             FormLabelProps={{
              label: 'Product Price',

             }}
             name="copyGeneral"
             CheckboxProps={{
               checked: copyGeneral,
               onChange: setGeneralAsShipping,

             }}
             />

             <FormCheckbox
               FormLabelProps={{
                label: 'Global Discount',
             }}
               name="copyGeneral"
               CheckboxProps={{
                checked: copyGeneral,
                onChange: setGeneralAsShipping,
             }}
             />
         </Col>
       </div>

       <div className="material-form row d-flex justify-content-center row d-flex justify-content-end">
                <Col xs={12} md={6}>

                  <FormCheckbox
                    FormLabelProps={{
                    label: 'Pricelist',

                  }}
                    name="copyGeneral"
                    CheckboxProps={{
                    checked: copyGeneral,
                    onChange: setGeneralAsShipping,
                  }}
                  />

                  <FormCheckbox
                    FormLabelProps={{
                     label: 'Price Control',

                    }}
                    name="copyGeneral"
                    CheckboxProps={{
                      checked: copyGeneral,
                      onChange: setGeneralAsShipping,

                    }}
                    />

                    <FormCheckbox
                      FormLabelProps={{
                       label: 'Payment Methods',
                    }}
                      name="copyGeneral"
                      CheckboxProps={{
                       checked: copyGeneral,
                       onChange: setGeneralAsShipping,
                    }}
                    />
                </Col>
              </div>

              <div className="material-form row d-flex justify-content-center">
                       <Col xs={12} md={6}>
                         <FormCheckbox
                           FormLabelProps={{
                            label: 'Header & Footer',

                           }}
                           name="copyGeneral"
                           CheckboxProps={{
                             checked: copyGeneral,
                             onChange: setGeneralAsShipping,

                           }}
                           />
                       </Col>
              </div>

              <div className="material-form row d-flex justify-content-center">
                       <Col xs={12} md={6}>
                         <FormCheckbox
                           FormLabelProps={{
                            label: 'Stock Locations',
                            }}
                            name="copyGeneral"
                            CheckboxProps={{
                             checked: copyGeneral,
                             onChange: setGeneralAsShipping,
                             }}
                         />
                       </Col>
              </div>
      </Form>
    )
}

const ConfigurationForm = compose(
  withRouter,
)(FormContent)

export default ConfigurationForm


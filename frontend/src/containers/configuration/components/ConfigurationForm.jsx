import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { prop } from 'ramda'
import { connect } from 'react-redux'
import { TextField } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';

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
import CustomizedRadios from '../../../shared/components/form-custom/CustomizedRadios'


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
    <div aria-busy="false">
      <Row>
            <Col md={4}>
              <FormInput label="Point of Sale Name" defaultValue="Dummy" type="text" variant="outlined" />

              <div className="material-form">
               <FormCheckbox
                 FormLabelProps={{
                  label: 'Category Products',
                 }}
                 name="copyGeneral"
                 CheckboxProps={{
                  checked: copyGeneral,
                  onChange: setGeneralAsShipping,
                 }}
                 />


                 <div className="text-muted">
                   Display pictures of product categories
                 </div>
               </div>
               <div className="material-form">
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

                  <div className="text-muted">
                    Set shop-specific prices, seasonal discounts, etc.
                  </div>

                  <div>
                    <FormInput type="text" variant="outlined"/>
                  </div>

                  <div>
                    <FormInput type="text" variant="outlined"/>
                  </div>
               </div>
            </Col>

            <Col md={4}>
             <div>
               <div className="material-form">
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
                   <div class="text-muted">
                     Product prices on receipts
                   </div>

                   <div>
                     <CustomizedRadios />
                   </div>
               </div>
             </div>



               <div className="material-form">
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
                   <div class="text-muted">
                     Restrict price modification to managers
                   </div>
               </div>

               <div className="material-form">
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

                   <div class="text-muted">
                     Add a custom message to header and footer
                   </div>

                   <div>
                     <FormInput type="text" variant="outlined"/>
                   </div>

                   <div>
                     <FormInput type="text" variant="outlined"/>
                   </div>
               </div>

             <div className="material-form">
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
                 <div class="text-muted">
                   Stock location used for the inventory
                 </div>
             </div>
            </Col>

            <Col md={4}>
              <div className="material-form">
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

                  <div class="text-muted">
                    Allow global discounts on orders
                  </div>

                  <div>
                    <FormInput type="text" variant="outlined"/>
                  </div>

                  <div>
                    <FormInput type="text" variant="outlined"/>
                  </div>
              </div>

             <div className="material-form">
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

                 <div class="text-muted">
                   Payment Methods Available
                 </div>
             </div>
            </Col>
      </Row>
    </div>
    )
}

const ConfigurationForm = compose(
  withRouter,
)(FormContent)

export default ConfigurationForm


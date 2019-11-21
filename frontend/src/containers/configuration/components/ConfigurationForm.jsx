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

import { addNotif } from '../../../redux/modules/general'

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
    copyCategoryProducts,
    setGeneralAsCategoryProducts,
    copyProductPrice,
    setGeneralAsProductPrice,
    copyGlobalDiscount,
    setGeneralAsGlobalDiscount,
    copyPricelist,
    setGeneralAsPricelist,
    copyPriceControl,
    setGeneralAsPriceControl,
    copyPaymentMethods,
    setGeneralAsPaymentMethods,
    copyPrefill,
    setGeneralAsPrefill,
    copyHeaderFooter,
    setGeneralAsHeaderFooter,
    copyAutomaticReceipt,
    setGeneralAsAutomaticReceipt,
    copyOperationType,
    setGeneralAsOperationType,
    copyStockLocations,
    setGeneralAsStockLocations,
}) => {
    return (
    <div aria-busy="false">
      <Row>
        <Col xs={12} md={3}>
          <FormInput label="Point of Sale Name" defaultValue="Dummy" type="text" variant="outlined" />
        </Col>
      </Row>

      <br />

      <Row>
        <Col md={4}>
          <div className="material-form display-linebreak" >
            <FormCheckbox
              FormLabelProps={{
                label: 'Category Products \n Display pictures of product categories',
              }}
              name="copyCategoryProducts"
              CheckboxProps={{
                checked: true,
                onChange: setGeneralAsCategoryProducts,
                disabled: true,
              }}
            />
          </div>
        </Col>

        <Col md={4}>
          <div>
            <div className="material-form display-linebreak">
              <FormCheckbox
                FormLabelProps={{
                  label: 'Product Price \n Product prices on receipts',
                }}
                name="copyProductPrice"
                CheckboxProps={{
                  checked: copyProductPrice,
                  onChange: setGeneralAsProductPrice,
                }}
              />

              <div>
                <CustomizedRadios />
              </div>

            </div>
          </div>
        </Col>

        <Col md={4}>
          <div className="material-form display-linebreak">
            <FormCheckbox
              FormLabelProps={{
                label: 'Global Discount \n Allow global discounts on orders',
              }}
              name="copyGeneral"
              CheckboxProps={{
                checked: copyGlobalDiscount,
                onChange: setGeneralAsGlobalDiscount,
              }}
            />

            <div>
              <FastField
                label = 'Discount Product'
                name = 'name'
                onFocus = {onInputFocus}
                component = {FormikInput}
                variant = 'outlined'
              />
            </div>

            <div>
              <FastField
                label = 'Global Discount'
                name = 'name'
                onFocus = {onInputFocus}
                component = {FormikInput}
                variant = 'outlined'
              />
            </div>

          </div>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <div className="material-form display-linebreak">
            <FormCheckbox
              FormLabelProps={{
                label: 'Pricelist \n Set shop-specific prices, seasonal discounts, etc.',
              }}
              name="copyGeneral"
              CheckboxProps={{
                checked: copyPricelist,
                onChange: setGeneralAsPricelist,
              }}
            />
          </div>

          <div>
            <FastField
              label = 'Available Pricelist'
              name = 'name'
              onFocus = {onInputFocus}
              component = {FormikInput}
              variant = 'outlined'
            />
          </div>

          <br />

          <div>
            <FastField
              label = 'Default Pricelist'
              name = 'name'
              onFocus = {onInputFocus}
              component = {FormikInput}
              variant = 'outlined'
            />
          </div>
        </Col>

        <Col md={4}>
          <div className="material-form display-linebreak">
            <FormCheckbox
              FormLabelProps={{
                label: 'Price Control \n Restrict price modification to managers',
              }}
              name="copyGeneral"
              CheckboxProps={{
                checked: copyPriceControl,
                onChange: setGeneralAsPriceControl,
              }}
            />
          </div>
        </Col>

        <Col md={4}>
          <div className="material-form display-linebreak">
            <FormCheckbox
              FormLabelProps={{
                label: 'Payment Methods \n Payment Methods Available',
              }}
              name="copyGeneral"
              CheckboxProps={{
                checked: copyPaymentMethods,
                onChange: setGeneralAsPaymentMethods,
              }}
            />

            <div>
              <FormInput type="text" variant="outlined"/>
            </div>

          </div>
        </Col>
      </Row>

      <br />

      <Row>
        <Col md={4}>
          <div className="material-form display-linebreak" >
            <FormCheckbox
              FormLabelProps={{
                label: 'Prefill Cash Payment \n Prefill amount paid with the exact due amount',
              }}
              name="copyPrefill"
              CheckboxProps={{
                checked: true,
                onChange: setGeneralAsPrefill,
                disabled: true,
              }}
            />
          </div>
        </Col>

        <Col md={4}>
          <div className="material-form display-linebreak">
            <FormCheckbox
              FormLabelProps={{
                label: 'Header & Footer \n Add a custom message to header and footer',
              }}
              name="copyHeaderFooter"
              CheckboxProps={{
                checked: copyHeaderFooter,
                onChange: setGeneralAsHeaderFooter,
              }}
            />

            <div>
              <FormInput type="text" variant="outlined"/>
            </div>

            <div>
              <FormInput type="text" variant="outlined"/>
            </div>
          </div>
        </Col>

        <Col md={4}>
          <div className="material-form display-linebreak" >
            <FormCheckbox
              FormLabelProps={{
                label: 'Automatic Receipt Printing \n Print receipts automatically once the payment registered',
              }}
              name="copyAutomaticReceipt"
              CheckboxProps={{
                checked: true,
                onChange: setGeneralAsAutomaticReceipt,
                disabled: true,
              }}
            />
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <div className="material-form display-linebreak" >
            <FormCheckbox
              FormLabelProps={{
                label: 'Operation Type \n Prefill amount paid with the exact due amount',
              }}
              name="copyOperationType"
              CheckboxProps={{
                checked: true,
                onChange: setGeneralAsOperationType,
                disabled: true,
              }}
            />
          </div>
        </Col>

        <Col md={4}>
          <div className="material-form display-linebreak">
            <FormCheckbox
              FormLabelProps={{
                label: 'Stock Locations \n Stock location used for the inventory',
              }}
              name="copyStockLocations"
              CheckboxProps={{
                checked: copyStockLocations,
                onChange: setGeneralAsStockLocations,
              }}
            />

            <div>
              <FormInput type="text" variant="outlined"/>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

const ConfigurationForm = compose(
  withRouter,
  withFormik({
        mapsPropsToValue: props => {
          return{
            name:'',
          }
        },
      })
)(FormContent)

export default ConfigurationForm


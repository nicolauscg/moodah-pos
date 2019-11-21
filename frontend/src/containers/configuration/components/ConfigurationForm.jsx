import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { prop } from 'ramda'

import { Row, Col } from 'reactstrap'
import { withFormik, Form, FastField } from 'formik'
import {
  compose,
  withState,
  withHandlers,
  withPropsOnChange,
} from 'recompose'

import { prepareAvailablePricelists, prepareDefaultPricelists } from '../../../utils/transformers/configuration'
import { PosProductsSelect, AvailablePricelistsSelect } from '../../../generated-pos-models'

import Panel from '../../../shared/components/Panel'
import FormikInput from '../../../shared/components/formik/TextInput'
import FormCheckbox from '../../../shared/components/form-custom/FormCheckbox'
import FormikCheckbox from '../../../shared/components/formik/Checkbox'
import Select from '../../../shared/components/form-custom/DynamicSelect'
import RadioSelect from '../../../shared/components/form-custom/CustomizedRadios'
import { prepareProducts } from '../../../utils/transformers/product'


import FormInput from '../../../shared/components/form-custom/FormInput'

const FormContent = ({
  onInputFocus,
  handleSubmit,
  copyGeneral,
  setGeneralAsShipping,
  values,
  products,
  refetchProducts,
  globalDiscount,
  setGlobalDiscount,
  availablePricelists,
  defaultPricelists
}) => {
  return (
    <Form
      onSubmit={e => {
        e.stopPropagation()
        handleSubmit(e)
      }}
    >
      <Row>
        <Panel
          xs={12}
          title='Product Category'
          isForm
        >
          <div className="material-form">
            <Row>
              <Col xs={6}>
                <FastField
                  required
                  label="Point of Sale Name"
                  name="name"
                  onFocus={onInputFocus}
                  component={FormikInput}
                  variant="outlined"
                />
              </Col>
            </Row>
            <Row>
              <Col xs={4}>
                <FormCheckbox
                  FormLabelProps={{
                    label: (
                      <div className="text-muted">
                        Category Products<br />
                        Display pictures of product categories
                      </div>
                    ),
                  }}
                  CheckboxProps={{
                    disabled: true,
                    checked: true
                  }}
                />
              </Col>
              <Col xs={4}>
                <RadioSelect 
                  name="ifaceTaxIncluded"
                  label={(
                    <div>
                      Product Price<br />
                      Product prices on receipts
                    </div>
                  )}
                  options={[
                    {
                      label: "Tax Included",
                      value: "subtotal"
                    },
                    {
                      label: "Tax Excluded",
                      value: "total"
                    },
                  ]}
                  values={values}
                />
              </Col>
              <Col md={4}>
                <FastField
                  name="globalDiscount"
                  FormLabelProps={{
                    label: (
                      <div>
                        Global Discount<br />
                        Allow global discounts on orders
                      </div>
                    )
                  }}
                  component={FormikCheckbox}
                />
                {values.globalDiscount && (
                  <Fragment>
                    <Select
                      dataState={products}
                      field='product'
                      label='Discount Product'
                      refetch={refetchProducts}
                      onFocus={onInputFocus}
                      queryKey={['posProducts', 'records']}
                    />
                    <FastField
                      label='Discount'
                      name='discountPc'
                      onFocus={onInputFocus}
                      component={FormikInput}
                    />
                  </Fragment>
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={4}>
                <FastField
                  name="usePricelist"
                  FormLabelProps={{
                    label: (
                      <div>
                        Pricelist<br />
                        Set shop-specific prices, seasonal discounts, etc.
                      </div>
                    )
                  }}
                  component={FormikCheckbox}
                />
                {values.usePricelist && (
                  <Fragment>
                    <Select
                      dataState={availablePricelists}
                      field='availablePricelistIds'
                      label='Available Pricelists'
                      onFocus={onInputFocus}
                      queryKey={['availablePriceLists', 'records']}
                      multiple={true}
                    />
                    <Select
                      dataState={defaultPricelists}
                      field='pricelistId'
                      label='Default Pricelist'
                      onFocus={onInputFocus}
                      queryKey={['defaultPricelists', 'records']}
                    />
                  </Fragment>
                )}
              </Col>
              <Col xs={4}>
                <FastField
                  FormLabelProps={{
                    label: 'Price Control',
                  }}
                  name="copyGeneral"
                  component={FormikCheckbox}
                />
                <div class="text-muted">
                  Restrict price modification to managers
                </div>
              </Col>
              <Col xs={4}>
                <div class="text-muted">
                  Payment Methods<br />
                  Payment Methods Available
                </div>
                <div>
                  <FormInput type="text" variant="outlined"/>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={4}>
                <FormCheckbox
                  FormLabelProps={{
                    label: (
                      <div className="text-muted">
                        Prefill Cash Payment<br />
                        Prefill amount paid with exact due amount
                      </div>
                    ),
                  }}
                  CheckboxProps={{
                    disabled: true,
                    checked: true
                  }}
                />
              </Col>
              <Col xs={4}>
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
              </Col>
            </Row>
            <Row>
              <Col xs={4}>
                <FormCheckbox
                  FormLabelProps={{
                    label: (
                      <div className="text-muted">
                        Operation Type<br />
                        Prefill amount paid with exact due amount
                      </div>
                    ),
                  }}
                  CheckboxProps={{
                    disabled: true,
                    checked: true
                  }}
                />
              </Col>
              <Col xs={4}>
                <div class="text-muted">
                  Stock Locations<br />
                  Stock location used for the inventory
                </div>
                <div>
                  <FormInput type="text" variant="outlined"/>
                </div>
              </Col>
            </Row>
          </div>
        </Panel>
      </Row>
    </Form>
  )
}

const ConfigurationForm = compose(
  withRouter,
  withState('productFilters', 'setProductFilters', {}),
  withState('availablePricelistsFilters', 'setAvailablePricelistsFilters', {}),
  withState('globalDiscount', 'setGlobalDiscount', false),
  withHandlers({
    refetchProducts: ({ setProductFilters }) => input => {
      setProductFilters({
        OR: [{ 'name': input }]
      })
    },
    refetchAvailablePricelists: ({ setAvailablePricelistsFilters }) => input => {
      setAvailablePricelistsFilters({
        OR: [{ 'name': input }]
      })
    },
  }),
  PosProductsSelect.HOC({
    name: 'products',
    options: ({
      productFilters
    }) => ({
      context: {
        clientName: 'pos'
      },
      variables: {
        filters: productFilters,
        limit: 10
      }
    })
  }),
  AvailablePricelistsSelect.HOC({
    name: 'availablePricelists',
    options: ({
      availablePricelistsFilters
    }) => ({
      context: {
        clientName: 'pos'
      },
      variables: {
        filters: availablePricelistsFilters,
        limit: 10
      }
    })
  }),
  withPropsOnChange(['products'], ({ products: oldProducts }) => {
    let products = oldProducts;

    if (!products.loading) {
      products = {
        ...products,
        ...prepareProducts(prop('posProducts', products)),
      }
    }

    return { products }
  }),
  withPropsOnChange(['availablePricelists'], ({ availablePricelists: oldAvailablePricelists }) => {
    let availablePricelists = oldAvailablePricelists;

    if (!availablePricelists.loading) {
      availablePricelists = {
        ...availablePricelists,
        ...prepareAvailablePricelists(prop('availablePricelists', availablePricelists)),
      }
    }

    return { availablePricelists }
  }),
  withPropsOnChange(['availablePricelists'], ({ availablePricelists, values }) => {
    let defaultPricelists =  availablePricelists;

    if (!availablePricelists.loading) {
      defaultPricelists = {
        ...availablePricelists,
        ...prepareDefaultPricelists(prop('availablePricelists', availablePricelists)),
      }
    }

    return { defaultPricelists }
  }),
  withFormik({
    mapPropsToValues: props => {
      return {
        name: '',
        ifaceTaxIncluded: [],
        globalDiscount: false,
        globalDiscountId: null,
        discountPc: 0.0,
        usePriceList: false,
        availablePricelistIds: [],
        pricelistId: null,
        restrictPriceControl: false,
        journalIds: [],
        isHeaderOrFooter: false,
        receiptHeadr: '',
        receiptFooter: '',
        stockLocationId: null
      }
    },
    handleSubmit: (values, { props }) => {
      props.handleSubmit({
        context: {
          clientName: 'pos'
        },
        variables: {
          input: {}
        }
      })
    },
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
  })
)(FormContent)

export default ConfigurationForm


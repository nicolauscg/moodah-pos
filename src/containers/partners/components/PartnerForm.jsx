import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { prop } from 'ramda'
import { connect } from 'react-redux'

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
import { PartnerHelp, PartnerLabel } from './PartnerHelp'
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

const InputAddress = ({ disabled, ...props }) =>
  disabled ? (
    <FastField {...props} disabled={disabled} component={FormikInput} />
  ) : (
    <FastField {...props} component={FormikInput} />
  )

const FormContent = ({
  onInputFocus,
  copyShipping,
  handleCountryChange,
  handleSetAddressFields,
  setShippingAsBilling,
  countries,
  refetchCountries,
  states,
  refetchStates,
  masters,
  refetchPaymentTerms,
  refetchUsers,
  refetchProductPricelists,
  copyGeneral,
  setGeneralAsShipping,
  copyGenInvoice,
  setGeneralAsBilling,
  handleSubmit,
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
          title="Detail Kontak"
          subhead="Rincian data dari pelanggan atau pemasok"
          isForm
        >
          <div className="material-form">
            <FastField
              required
              label="Nama"
              name="name"
              onFocus={onInputFocus}
              component={FormikInput}
            />
            <FastField
              label="NPWP"
              name="vat"
              onFocus={onInputFocus}
              component={FormikInput}
            />
            <FastField
              label="Email"
              name="email"
              onFocus={onInputFocus}
              component={FormikInput}
            />
            <FastField
              label="Nomor Telepon"
              name="phone"
              onFocus={onInputFocus}
              component={FormikInput}
            />
            <FastField
              label="Website"
              name="website"
              onFocus={onInputFocus}
              component={FormikInput}
            />
            <Row>
              <Col xs={12} md={6}>
                <Select
                  dataState={countries}
                  field="countryId"
                  label="Negara"
                  handleSetValue={handleCountryChange}
                  refetch={refetchCountries}
                  onFocus={onInputFocus}
                  queryKey={['resCountries', 'resCountries']}
                  hasMoreKey={['resCountries', 'pageInfo', 'hasNextPage']}
                />
              </Col>
              <Col xs={12} md={6}>
                <Select
                  dataState={states}
                  field="stateId"
                  label="Provinsi"
                  handleSetValue={handleSetAddressFields}
                  refetch={refetchStates}
                  onFocus={onInputFocus}
                  queryKey={['resCountryStates', 'resCountryStates']}
                  hasMoreKey={['resCountryStates', 'pageInfo', 'hasNextPage']}
                />
              </Col>
            </Row>
            <FastField
              label="Alamat"
              name="street"
              handleSetValue={handleSetAddressFields}
              onFocus={onInputFocus}
              component={FormikInput}
            />
            <Row>
              <Col xs={12} md={6}>
                <FastField
                  label="Kota"
                  name="city"
                  handleSetValue={handleSetAddressFields}
                  onFocus={onInputFocus}
                  component={FormikInput}
                />
              </Col>
              <Col xs={12} md={6}>
                <FastField
                  label="Kode Pos"
                  name="zip"
                  handleSetValue={handleSetAddressFields}
                  onFocus={onInputFocus}
                  component={FormikInput}
                />
              </Col>
            </Row>
          </div>
        </Panel>
      </Row>
      <Row>
        <Panel
          xs={12}
          title="Alamat Pengiriman"
          subhead="Data alamat yang digunakan untuk proses pengiriman"
          isForm
        >
          <div className="material-form">
            <FormCheckbox
              FormLabelProps={{
                label: 'Sama dengan alamat kantor',
              }}
              name="copyGeneral"
              CheckboxProps={{
                checked: copyGeneral,
                onChange: setGeneralAsShipping,
              }}
            />
            <Row>
              <Col xs={12} md={6}>
                <Select
                  dataState={countries}
                  field="deliveryAddress.shippingCountryId"
                  label="Negara"
                  handleSetValue={handleCountryChange}
                  refetch={refetchCountries}
                  onFocus={onInputFocus}
                  queryKey={['resCountries', 'resCountries']}
                  hasMoreKey={['resCountries', 'pageInfo', 'hasNextPage']}
                  disabled={copyGeneral}
                />
              </Col>
              <Col xs={12} md={6}>
                <Select
                  dataState={states}
                  field="deliveryAddress.shippingStateId"
                  label="Provinsi"
                  handleSetValue={handleSetAddressFields}
                  refetch={refetchStates}
                  onFocus={onInputFocus}
                  queryKey={['resCountryStates', 'resCountryStates']}
                  hasMoreKey={['resCountryStates', 'pageInfo', 'hasNextPage']}
                  disabled={copyGeneral}
                />
              </Col>
            </Row>
            <InputAddress
              label="Alamat"
              name="deliveryAddress.shippingStreet"
              onFocus={onInputFocus}
              disabled={copyGeneral}
              handleSetValue={handleSetAddressFields}
            />
            <Row>
              <Col xs={12} md={6}>
                <InputAddress
                  label="Kota"
                  name="deliveryAddress.shippingCity"
                  onFocus={onInputFocus}
                  disabled={copyGeneral}
                  handleSetValue={handleSetAddressFields}
                />
              </Col>
              <Col xs={12} md={6}>
                <InputAddress
                  label="Kode Pos"
                  name="deliveryAddress.shippingZip"
                  disabled={copyGeneral}
                  handleSetValue={handleSetAddressFields}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <InputAddress
                  label="Telepon"
                  name="deliveryAddress.shippingPhone"
                  disabled={copyGeneral}
                  handleSetValue={handleSetAddressFields}
                />
              </Col>
              <Col>
                <InputAddress
                  label="Email"
                  name="deliveryAddress.shippingEmail"
                  disabled={copyGeneral}
                  onFocus={onInputFocus}
                  component={FormikInput}
                />
              </Col>
            </Row>
          </div>
        </Panel>
      </Row>
      <Row>
        <Panel
          xs={12}
          title="Alamat Tagihan"
          subhead="Data alamat yang digunakan untuk proses penagihan"
          isForm
        >
          <div className="material-form">
            <FormCheckbox
              FormLabelProps={{
                label: 'Sama dengan alamat kantor',
              }}
              name="copyGenInvoice"
              CheckboxProps={{
                checked: copyGenInvoice,
                onChange: setGeneralAsBilling,
              }}
            />
            <FormCheckbox
              FormLabelProps={{
                label: 'Sama dengan alamat pengiriman',
              }}
              name="copyShipping"
              CheckboxProps={{
                checked: copyShipping,
                onChange: setShippingAsBilling,
              }}
            />
            <Row>
              <Col xs={12} md={6}>
                <Select
                  dataState={countries}
                  field="invoiceAddress.billingCountryId"
                  label="Negara"
                  handleSetValue={handleCountryChange}
                  refetch={refetchCountries}
                  onFocus={onInputFocus}
                  queryKey={['resCountries', 'resCountries']}
                  hasMoreKey={['resCountries', 'pageInfo', 'hasNextPage']}
                  disabled={copyShipping || copyGenInvoice}
                />
              </Col>
              <Col xs={12} md={6}>
                <Select
                  dataState={states}
                  field="invoiceAddress.billingStateId"
                  label="Provinsi"
                  handleSetValue={handleSetAddressFields}
                  refetch={refetchStates}
                  onFocus={onInputFocus}
                  queryKey={['resCountryStates', 'resCountryStates']}
                  hasMoreKey={['resCountryStates', 'pageInfo', 'hasNextPage']}
                  disabled={copyShipping || copyGenInvoice}
                />
              </Col>
            </Row>
            <InputAddress
              label="Alamat"
              name="invoiceAddress.billingStreet"
              onFocus={onInputFocus}
              disabled={copyShipping || copyGenInvoice}
              handleSetValue={handleSetAddressFields}
            />
            <Row>
              <Col xs={12} md={6}>
                <InputAddress
                  label="Kota"
                  name="invoiceAddress.billingCity"
                  onFocus={onInputFocus}
                  disabled={copyShipping || copyGenInvoice}
                  handleSetValue={handleSetAddressFields}
                />
              </Col>
              <Col xs={12} md={6}>
                <InputAddress
                  label="Kode Pos"
                  name="invoiceAddress.billingZip"
                  disabled={copyShipping || copyGenInvoice}
                  handleSetValue={handleSetAddressFields}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <InputAddress
                  label="Telepon"
                  name="invoiceAddress.billingPhone"
                  disabled={copyShipping || copyGenInvoice}
                  handleSetValue={handleSetAddressFields}
                />
              </Col>
              <Col>
                <InputAddress
                  label="Email"
                  name="invoiceAddress.billingEmail"
                  disabled={copyShipping || copyGenInvoice}
                  onFocus={onInputFocus}
                  component={FormikInput}
                />
              </Col>
            </Row>
          </div>
        </Panel>
      </Row>
      <Row>
        <Panel xs={12} title="Penjualan & Pembelian" subhead="" isForm>
          <div className="material-form">
            <h5 className="bold-text">Penjualan</h5>
            <FastField
              FormLabelProps={{
                label: 'Customer',
              }}
              name="customer"
              component={FormikCheckbox}
            />
            <Select
              dataState={masters}
              field="userId"
              label="Salesperson"
              refetch={refetchUsers}
              queryKey={['users', 'users']}
              onFocus={onInputFocus}
            />
            <Select
              dataState={masters}
              field="propertyPaymentTermId"
              label="Termin Pembayaran"
              refetch={refetchPaymentTerms}
              queryKey={['paymentTerms', 'paymentTerms']}
              onFocus={onInputFocus}
            />
            <Select
              dataState={masters}
              field="propertyProductPricelist"
              label="Daftar Harga Jual"
              refetch={refetchProductPricelists}
              queryKey={['productPricelists', 'productPricelists']}
              onFocus={onInputFocus}
            />
            <h5 className="bold-text">Pembelian</h5>
            <FastField
              FormLabelProps={{
                label: 'Supplier',
              }}
              name="supplier"
              component={FormikCheckbox}
            />
            <Select
              dataState={masters}
              field="propertySupplierPaymentTermId"
              label="Termin Pembayaran"
              refetch={refetchPaymentTerms}
              queryKey={['paymentTerms', 'paymentTerms']}
              onFocus={onInputFocus}
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
  withRouter,
  connect(
    null,
    dispatch => ({
      triggerNotif: notif => dispatch(addNotif(notif)),
    })
  ),
  withState('countryFilters', 'setCountryFilters', {}),
  withState('stateFilters', 'setStateFilters', {}),
  withState('paymentTermFilters', 'setPaymentTermFilters', {}),
  withState('productPricelistFilters', 'setProductPricelistFilters', {}),
  withState('userFilters', 'setUserFilters', {}),
  withState('copyShipping', 'setCopyShipping', false),
  withState('copyGeneral', 'setCopyGeneral', false),
  withState('copyGenInvoice', 'setCopyGenInvoice', false),
  withHandlers({
    refetchCountries: ({ setCountryFilters }) => input => {
      setCountryFilters({
        name_contains: input,
      })
    },
    refetchStates: ({ setStateFilters }) => input => {
      setStateFilters({
        name_contains: input,
      })
    },
    refetchPaymentTerms: ({ setPaymentTermFilters }) => input => {
      setPaymentTermFilters({
        name_contains: input,
      })
    },
    refetchUsers: ({ setUserFilters }) => input => {
      setUserFilters({
        name_contains: input,
      })
    },
    refetchProductPricelists: ({ setProductPricelistFilters }) => input => {
      setProductPricelistFilters({
        name_contains: input,
      })
    },
  }),
  PartnerFormQuery.HOC({
    name: 'masters',
    options: ({
      paymentTermFilters,
      userFilters,
      productPricelistFilters,
    }) => ({
      variables: {
        paymentTermFilters: paymentTermFilters,
        userFilters: userFilters,
        productPricelistFilters: productPricelistFilters,
      },
      fetchPolicy: 'cache-and-network',
    }),
  }),
  ResCountries.HOC({
    name: 'countries',
    options: ({ countryFilters }) => ({
      variables: {
        filters: countryFilters,
      },
    }),
  }),
  ResCountryStates.HOC({
    name: 'states',
    options: ({ stateFilters }) => ({
      variables: {
        filters: stateFilters,
      },
    }),
  }),
  withPropsOnChange(['countries'], ({ countries: oldCountries }) => {
    let countries = oldCountries

    if (!countries.loading) {
      countries = {
        ...countries,
        ...prepareCountries(prop('resCountries', countries)),
      }
    }

    return { countries }
  }),
  withPropsOnChange(['states'], ({ states: oldCountries }) => {
    let states = oldCountries

    if (!states.loading) {
      states = {
        ...states,
        ...prepareCountryStates(prop('resCountryStates', states)),
      }
    }

    return { states }
  }),
  withPropsOnChange(['masters'], ({ masters: oldMasters }) => {
    let masters = oldMasters

    if (!masters.loading) {
      const { paymentTerms, users, productPricelists } = oldMasters

      masters = {
        ...masters,
        ...preparePartnerFormMasters(paymentTerms, users, productPricelists),
      }
    }

    return { masters }
  }),
  withFormik({
    mapPropsToValues: props => {
      const { partner, defaultPartner, location } = props

      if (partner) {
        return partner
      }

      let defaultCustomer = false
      let defaultSupplier = false

      switch (location.hash) {
        case '#customer':
          defaultCustomer = true
          break
        case '#supplier':
          defaultSupplier = true
          break
        default:
          defaultCustomer = true
          defaultSupplier = true
          break
      }

      return {
        name: '',
        vat: '',
        email: '',
        phone: '',
        website: '',
        countryId: null,
        stateId: null,
        street: '',
        city: '',
        zip: '',
        deliveryAddress: {
          shippingCountryId: null,
          shippingStateId: null,
          shippingStreet: '',
          shippingCity: '',
          shippingZip: '',
          shippingPhone: '',
          shippingEmail: '',
        },
        invoiceAddress: {
          billingCountryId: null,
          billingStateId: null,
          billingStreet: '',
          billingCity: '',
          billingZip: '',
          billingPhone: '',
          billingEmail: '',
        },
        customer: defaultCustomer,
        userId: null,
        propertyPaymentTermId: null,
        supplier: defaultSupplier,
        propertySupplierPaymentTermId: null,
        ...defaultPartner,
      }
    },
    handleSubmit: (values, { props }) => {
      if (values.supplier || values.customer) {
        const transValues = transformPartnerForm(values)
        props.handleSubmit({ variables: { vals: transValues } })
      } else {
        props.triggerNotif({
          message:
            'Partner harus dikategorikan sebagai Supplier atau Customer!',
          type: 'warning',
        })
      }
    },
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
  }),
  withHandlers({
    handleSetAddressFields: ({
      setFieldValue,
      copyShipping,
      copyGeneral,
      copyGenInvoice,
    }) => (field, value) => {
      if (copyShipping) {
        if (field === 'deliveryAddress.shippingCountryId') {
          setFieldValue('invoiceAddress.billingCountryId', value)
        } else if (field === 'deliveryAddress.shippingStateId') {
          setFieldValue('invoiceAddress.billingStateId', value)
        } else if (field === 'deliveryAddress.shippingCity') {
          setFieldValue('invoiceAddress.billingCity', value)
        } else if (field === 'deliveryAddress.shippingStreet') {
          setFieldValue('invoiceAddress.billingStreet', value)
        } else if (field === 'deliveryAddress.shippingZip') {
          setFieldValue('invoiceAddress.billingZip', value)
        } else if (field === 'deliveryAddress.shippingPhone') {
          setFieldValue('invoiceAddress.billingPhone', value)
        } else if (field === 'deliveryAddress.shippingEmail') {
          setFieldValue('invoiceAddress.billingEmail', value)
        }
      }

      if (copyGeneral) {
        if (field === 'countryId') {
          setFieldValue('deliveryAddress.shippingCountryId', value)
        } else if (field === 'stateId') {
          setFieldValue('deliveryAddress.shippingStateId', value)
        } else if (field === 'city') {
          setFieldValue('deliveryAddress.shippingCity', value)
        } else if (field === 'street') {
          setFieldValue('deliveryAddress.shippingStreet', value)
        } else if (field === 'zip') {
          setFieldValue('deliveryAddress.shippingZip', value)
        } else if (field === 'phone') {
          setFieldValue('deliveryAddress.shippingPhone', value)
        } else if (field === 'email') {
          setFieldValue('deliveryAddress.shippingEmail', value)
        }
      }

      if (copyGenInvoice) {
        if (field === 'countryId') {
          setFieldValue('invoiceAddress.billingCountryId', value)
        } else if (field === 'stateId') {
          setFieldValue('invoiceAddress.billingStateId', value)
        } else if (field === 'city') {
          setFieldValue('invoiceAddress.billingCity', value)
        } else if (field === 'street') {
          setFieldValue('invoiceAddress.billingStreet', value)
        } else if (field === 'zip') {
          setFieldValue('invoiceAddress.billingZip', value)
        } else if (field === 'phone') {
          setFieldValue('invoiceAddress.billingPhone', value)
        } else if (field === 'email') {
          setFieldValue('invoiceAddress.billingEmail', value)
        }
      }

      setFieldValue(field, value)
    },
  }),
  withHandlers({
    handleCountryChange: ({
      stateFilters,
      setStateFilters,
      handleSetAddressFields,
    }) => (name, value) => {
      switch (name) {
        case 'deliveryAddress.shippingCountryId':
          if (value) {
            setStateFilters({
              ...stateFilters,
              countryId_relation: {
                name_contains: value.label,
              },
            })
            handleSetAddressFields(name, value)
          } else {
            handleSetAddressFields('deliveryAddress.shippingStateId', null)
            handleSetAddressFields(name, null)
          }
          break
        case 'invoiceAddress.billingCountryId':
          if (value) {
            setStateFilters({
              ...stateFilters,
              countryId_relation: {
                name_contains: value.label,
              },
            })
            handleSetAddressFields(name, value)
          } else {
            handleSetAddressFields('invoiceAddress.billingStateId', null)
            handleSetAddressFields(name, null)
          }
          break
        default:
          if (value) {
            setStateFilters({
              ...stateFilters,
              countryId_relation: {
                name_contains: value.label,
              },
            })
            handleSetAddressFields(name, value)
          } else {
            handleSetAddressFields('stateId', null)
            handleSetAddressFields(name, null)
          }
          break
      }
    },
    setShippingAsBilling: ({
      setFieldValue,
      values,
      setCopyShipping,
      setCopyGenInvoice,
    }) => (_, checked) => {
      const { deliveryAddress } = values
      setCopyShipping(checked)
      setCopyGenInvoice(false)

      if (checked) {
        setFieldValue(
          'invoiceAddress.billingCountryId',
          deliveryAddress.shippingCountryId
        )
        setFieldValue(
          'invoiceAddress.billingStateId',
          deliveryAddress.shippingStateId
        )
        setFieldValue(
          'invoiceAddress.billingCity',
          deliveryAddress.shippingCity
        )
        setFieldValue(
          'invoiceAddress.billingStreet',
          deliveryAddress.shippingStreet
        )
        setFieldValue('invoiceAddress.billingZip', deliveryAddress.shippingZip)
        setFieldValue(
          'invoiceAddress.billingPhone',
          deliveryAddress.shippingPhone
        )
        setFieldValue(
          'invoiceAddress.billingEmail',
          deliveryAddress.shippingEmail
        )
      }
    },
    setGeneralAsShipping: ({ setFieldValue, values, setCopyGeneral }) => (
      _,
      checked
    ) => {
      const { countryId, stateId, street, city, zip, phone, email } = values
      setCopyGeneral(checked)

      if (checked) {
        setFieldValue('deliveryAddress.shippingCountryId', countryId)
        setFieldValue('deliveryAddress.shippingStateId', stateId)
        setFieldValue('deliveryAddress.shippingCity', city)
        setFieldValue('deliveryAddress.shippingStreet', street)
        setFieldValue('deliveryAddress.shippingZip', zip)
        setFieldValue('deliveryAddress.shippingPhone', phone)
        setFieldValue('deliveryAddress.shippingEmail', email)
      }
    },
    setGeneralAsBilling: ({
      setFieldValue,
      values,
      setCopyGenInvoice,
      setCopyShipping,
    }) => (_, checked) => {
      const { countryId, stateId, street, city, zip, phone, email } = values
      setCopyGenInvoice(checked)
      setCopyShipping(false)

      if (checked) {
        setFieldValue('invoiceAddress.billingCountryId', countryId)
        setFieldValue('invoiceAddress.billingStateId', stateId)
        setFieldValue('invoiceAddress.billingCity', city)
        setFieldValue('invoiceAddress.billingStreet', street)
        setFieldValue('invoiceAddress.billingZip', zip)
        setFieldValue('invoiceAddress.billingPhone', phone)
        setFieldValue('invoiceAddress.billingEmail', email)
      }
    },
  })
)

const RouterFormikForm = enhance(FormContent)

const HelpHandler = compose(
  withStateHandlers(
    () => ({
      title: PartnerLabel.name,
      help: PartnerHelp.name,
    }),
    {
      onInputFocus: () => e => {
        const { name } = e.target

        return {
          title: PartnerLabel[name],
          help: PartnerHelp[name],
        }
      },
    }
  )
)

const PartnerForm = ({ title, help, onInputFocus, hideHelp, ...props }) => {
  if (hideHelp) {
    return <RouterFormikForm {...props} />
  }

  return (
    <Row>
      <Col md={8}>
        <RouterFormikForm {...props} onInputFocus={onInputFocus} />
      </Col>
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
  )
}

export default HelpHandler(PartnerForm)

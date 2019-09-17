import * as R from 'ramda'

import {
  ResPartners,
  PartnerFormQuery,
  ResPartner,
  PartnerFormFields,
  GetDefaultPartner,
  ResCountries,
  ResCountryStates,
  ResPartnerContacts,
} from '../../generated-models'
import {
  toSuggestions,
  toSuggestion,
  renameKeys,
  referenceFromOdoo,
  referenceToOdoo,
  getValueOdooSelection,
  textFromOdoo,
} from './general'

// ====================================================
// Constants
// ====================================================
export const PartnerColumns = [
  { name: 'name', title: 'Nama' },
  { name: 'type', title: 'Tipe' },
  { name: 'email', title: 'Email' },
  { name: 'phone', title: 'Telepon' },
  // { name: 'status', title: 'Status' },
]

export const ContactColumns = [
  { name: 'name', title: 'Nama' },
  { name: 'email', title: 'Email' },
  { name: 'function', title: 'Posisi' },
  { name: 'phone', title: 'Telepon' },
]

export const ImportVals = {
  model: 'res.partner',
  key: 'partners',
}

// ====================================================
// Transformers
// ====================================================
export const transformPartners = (data: ResPartners.Partners[]) => {
  return R.map((partner: ResPartners.Partners) => {
    const type = `${partner.supplier ? 'Supplier' : ''}
        ${partner.supplier && partner.customer ? ' & ' : ''}
        ${partner.customer ? 'Customer' : ''}`

    const status = partner.active ? 'Active' : 'Inactive'

    return R.pipe(
      R.omit(['supplier', 'customer', 'active']),
      R.assoc('type', type),
      R.assoc('status', status)
    )(partner)
  })(data)
}

export const preparePartnerFormMasters = (
  paymentTerms: PartnerFormQuery.PaymentTerms,
  users: PartnerFormQuery.Users,
  productPricelists: PartnerFormQuery.ProductPricelists
) => {
  return {
    paymentTerms: {
      ...paymentTerms,
      paymentTerms: toSuggestions(paymentTerms.paymentTerms),
    },
    users: {
      ...users,
      users: toSuggestions(users.users),
    },
    productPricelists: {
      ...productPricelists,
      productPricelists: toSuggestions(productPricelists.productPricelists),
    },
  }
}

export const prepareCountries = (countries: ResCountries.ResCountries) => {
  return {
    resCountries: {
      ...countries,
      resCountries: toSuggestions(countries.resCountries),
    },
  }
}

export const prepareCountryStates = (
  states: ResCountryStates.ResCountryStates
) => {
  return {
    resCountryStates: {
      ...states,
      resCountryStates: toSuggestions(states.resCountryStates),
    },
  }
}

export const preparePartner = (partner: ResPartner.ResPartner) => {
  const { invoiceAddress, deliveryAddress } = prepareChildPartner(
    partner.childIds
  )

  return R.pipe(
    R.evolve({
      propertyPaymentTermId: referenceFromOdoo,
      propertyProductPricelist: referenceFromOdoo,
      propertySupplierPaymentTermId: referenceFromOdoo,
      userId: referenceFromOdoo,
      invoiceWarn: R.pipe(
        R.find(R.propEq('selected', true)),
        R.prop('value')
      ),
      pickingWarn: R.pipe(
        R.find(R.propEq('selected', true)),
        R.prop('value')
      ),
      purchaseWarn: R.pipe(
        R.find(R.propEq('selected', true)),
        R.prop('value')
      ),
      saleWarn: R.pipe(
        R.find(R.propEq('selected', true)),
        R.prop('value')
      ),
      email: textFromOdoo,
      phone: textFromOdoo,
      vat: textFromOdoo,
      website: textFromOdoo,
      countryId: referenceFromOdoo,
      stateId: referenceFromOdoo,
      street: textFromOdoo,
      city: textFromOdoo,
      zip: textFromOdoo,
    }),
    R.dissoc('childIds'),
    R.assoc('invoiceAddress', invoiceAddress),
    R.assoc('deliveryAddress', deliveryAddress),
    R.dissoc('__typename')
  )(partner)
}

const prepareChildPartner = (childs: PartnerFormFields.ChildIds) => {
  const groupByType = R.groupBy((child: PartnerFormFields.PartnerChildIds) => {
    const { type } = child
    const selected: PartnerFormFields.Type = R.find(R.propEq('selected', true))(
      type
    )

    return selected.value
  })(childs.partnerChildIds)

  const evolveChildKeys = R.evolve({
    countryId: referenceFromOdoo,
    stateId: referenceFromOdoo,
    street: textFromOdoo,
    city: textFromOdoo,
    zip: textFromOdoo,
    phone: textFromOdoo,
    email: textFromOdoo,
  })

  const deliveryAddress = R.ifElse(
    R.has('delivery'),
    R.pipe(
      R.prop('delivery'),
      R.nth(0),
      // @ts-ignore
      evolveChildKeys,
      renameKeys({
        countryId: 'shippingCountryId',
        stateId: 'shippingStateId',
        street: 'shippingStreet',
        city: 'shippingCity',
        zip: 'shippingZip',
        phone: 'shippingPhone',
        email: 'shippingEmail',
      }),
      R.dissoc('__typename')
    ),
    R.always({
      shippingCountryId: null,
      shippingStateId: null,
      shippingStreet: '',
      shippingCity: '',
      shippingZip: '',
      shippingPhone: '',
      shippingEmail: '',
    })
  )(groupByType)

  const invoiceAddress = R.ifElse(
    R.has('invoice'),
    R.pipe(
      R.prop('invoice'),
      R.nth(0),
      // @ts-ignore
      evolveChildKeys,
      renameKeys({
        countryId: 'billingCountryId',
        stateId: 'billingStateId',
        street: 'billingStreet',
        city: 'billingCity',
        zip: 'billingZip',
        phone: 'billingPhone',
        email: 'billingEmail',
      }),
      R.dissoc('__typename')
    ),
    R.always({
      billingCountryId: null,
      billingStateId: null,
      billingStreet: '',
      billingCity: '',
      billingZip: '',
      billingPhone: '',
      billingEmail: '',
    })
  )(groupByType)

  return {
    deliveryAddress,
    invoiceAddress,
  }
}

const transformAddresses = values => {
  const { invoiceAddress, deliveryAddress } = values
  const childIds = {
    CREATE: [],
    UPDATE: [],
  }

  const invoiceChild = R.pipe(
    renameKeys({
      billingCountryId: 'countryId',
      billingStateId: 'stateId',
      billingCity: 'city',
      billingStreet: 'street',
      billingZip: 'zip',
      billingPhone: 'phone',
      billingEmail: 'email',
    }),
    R.evolve({
      countryId: referenceToOdoo,
      stateId: referenceToOdoo,
    }),
    R.assoc('type', 'invoice'),
    R.assoc('customer', R.prop('customer', values)),
    R.assoc('supplier', R.prop('supplier', values)),
    R.assoc('invoiceWarn', R.prop('invoiceWarn', values)),
    R.assoc('pickingWarn', R.prop('pickingWarn', values)),
    R.assoc('saleWarn', R.prop('saleWarn', values)),
    R.assoc('purchaseWarn', R.prop('purchaseWarn', values))
  )(invoiceAddress)

  if (R.has('id', invoiceChild)) {
    childIds['UPDATE'].push(invoiceChild)
  } else {
    childIds['CREATE'].push(invoiceChild)
  }

  const deliveryChild = R.pipe(
    renameKeys({
      shippingCountryId: 'countryId',
      shippingStateId: 'stateId',
      shippingCity: 'city',
      shippingStreet: 'street',
      shippingZip: 'zip',
      shippingPhone: 'phone',
      shippingEmail: 'email',
    }),
    R.evolve({
      countryId: referenceToOdoo,
      stateId: referenceToOdoo,
    }),
    R.assoc('type', 'delivery'),
    R.assoc('customer', R.prop('customer', values)),
    R.assoc('supplier', R.prop('supplier', values)),
    R.assoc('invoiceWarn', R.prop('invoiceWarn', values)),
    R.assoc('pickingWarn', R.prop('pickingWarn', values)),
    R.assoc('saleWarn', R.prop('saleWarn', values)),
    R.assoc('purchaseWarn', R.prop('purchaseWarn', values))
  )(deliveryAddress)

  if (R.has('id', deliveryChild)) {
    childIds['UPDATE'].push(deliveryChild)
  } else {
    childIds['CREATE'].push(deliveryChild)
  }

  return R.assoc('childIds', childIds)(values)
}

export const transformPartnerForm = values => {
  return R.pipe(
    R.evolve({
      userId: referenceToOdoo,
      propertyPaymentTermId: referenceToOdoo,
      propertyProductPricelist: referenceToOdoo,
      propertySupplierPaymentTermId: referenceToOdoo,
      countryId: referenceToOdoo,
      stateId: referenceToOdoo,
    }),
    transformAddresses,
    R.dissoc('invoiceAddress'),
    R.dissoc('deliveryAddress')
  )(values)
}

export const prepareDefaultPartner = (
  defaultPartner: GetDefaultPartner.InitResPartner
) => {
  return R.pipe(
    R.evolve({
      invoiceWarn: getValueOdooSelection,
      pickingWarn: getValueOdooSelection,
      purchaseWarn: getValueOdooSelection,
      saleWarn: getValueOdooSelection,
      propertyAccountPayableId: R.prop('id'),
      propertyAccountReceivableId: R.prop('id'),
    }),
    R.dissoc('__typename')
  )(defaultPartner)
}

export const prepareContacts = (contacts: ResPartnerContacts.Partners[]) => {
  return R.map(
    R.pipe(
      R.dissoc('__typename'),
      R.evolve({
        name: textFromOdoo,
        email: textFromOdoo,
        function: textFromOdoo,
        phone: textFromOdoo,
      })
    )
  )(contacts)
}

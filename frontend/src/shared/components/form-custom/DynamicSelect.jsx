import React from 'react'
import { pathOr } from 'ramda'

import { Field } from 'formik'

import FormSelect from './FormSelect'
import FormikSelect from '../formik/Select'

const Select = ({
  isTCell,
  component,
  selectedItem,
  handleSetValue,
  ...props
}) => {
  if (isTCell) {
    return (
      <FormSelect
        isTCell
        onChange={handleSetValue}
        selectedItem={selectedItem}
        {...props}
      />
    )
  }

  return (
    <Field component={component} handleSetValue={handleSetValue} {...props} />
  )
}

const DynamicSelect = ({ dataState, field, disabled, queryKey, ...props }) => {
  const { loading } = dataState
  const suggestions = loading ? [] : pathOr([], queryKey, dataState)

  return (
    <Select
      itemToString={item => (item ? item.label : '')}
      name={field}
      suggestions={suggestions}
      loading={loading}
      disabled={disabled}
      component={FormikSelect}
      {...props}
    />
  )
}

export default DynamicSelect

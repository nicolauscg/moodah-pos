import React from 'react'

import FormSelect from '../form-custom/FormSelect'

export default function FormikSelect(props) {
  const {
    field: { value, onChange, ...restField },
    form: { setFieldValue },
    handleSetValue,
    ...restProps
  } = props

  const handleChange = value => {
    const handle = handleSetValue ? handleSetValue : setFieldValue
    handle(restField.name, value)
  }

  return (
    <FormSelect
      {...restField}
      {...restProps}
      onChange={handleChange}
      selectedItem={value}
    />
  )
}

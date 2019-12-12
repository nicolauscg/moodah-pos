import React from 'react'

import FormSelect from '../form-custom/FormSelect2'

export default function FormikSelect(props) {
  const {
    field: { onChange, ...restField },
    form: { setFieldValue },
    handleSetValue,
    ...restProps
  } = props

  const handleChange = value => {
    const handle = handleSetValue ? handleSetValue : setFieldValue
    handle(restField.name, value)
  }

  return <FormSelect {...restField} {...restProps} onChange={handleChange} />
}

import React from 'react'

import FormInput from '../form-custom/FormInput'

export default function TextInput(props) {
  const {
    field: { onChange, ...restField },
    form: { errors, setFieldValue },
    handleSetValue,
    ...restProps
  } = props

  const handleChange = e => {
    if (handleSetValue) {
      handleSetValue(restField.name, e.target.value)
    } else {
      setFieldValue(restField.name, e.target.value)
    }
  }

  return (
    <FormInput
      {...restField}
      {...restProps}
      // onChange={
      //   handleSetValue
      //   ? (e) => handleSetValue(restField.name, e.target.value)
      //   : onChange
      // }
      onChange={handleChange}
      error={errors[restField.name] ? true : false}
      helperText={errors[restField.name]}
    />
  )
}

import React from 'react'

import Picker from '../form-custom/DateTimePicker'

export default function DateTimePicker(props) {
  const {
    field: { value, onChange, ...restField },
    form: { errors, setFieldValue, setFieldError },
    handleSetValue,
    ...restProps
  } = props

  const handleChange = date => {
    if (handleSetValue) {
      handleSetValue(restField.name, date)
    } else {
      setFieldValue(restField.name, date)
    }
  }

  return (
    <Picker
      value={value ? value : null}
      error={errors[restField.name] ? true : false}
      helperText={errors[restField.name]}
      onError={(_, error) => setFieldError(restField.name, error)}
      onChange={handleChange}
      {...restProps}
    />
  )
}

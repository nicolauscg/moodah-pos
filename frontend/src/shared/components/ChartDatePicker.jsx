import React from 'react'

import DateTimePicker from './form-custom/DateTimePicker'

const ChartDatePicker = ({ label, ...props }) => {
  return (
    <div className={`chart-date-picker__container ${label ? '' : 'd-flex'}`}>
      <p className='chart-date-picker__label'>{label}</p>
      <DateTimePicker
        className='chart-date-picker__input'
        {...props}
        TextFieldComponent={({ error, helperText, InputProps, ...props }) => (
          <input {...props} />
        )}
      />
    </div>
  )
}

export default ChartDatePicker

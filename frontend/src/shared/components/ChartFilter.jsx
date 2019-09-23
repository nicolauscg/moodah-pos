import React from 'react'

import Select from 'react-select'

const ChartFilter = props => {
  return (
    <Select
      className="chart-filter__container"
      classNamePrefix="chart-filter"
      {...props}
    />
  )
}

export default ChartFilter

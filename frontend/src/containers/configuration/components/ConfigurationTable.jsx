import React, { Fragment } from 'react'
import { compose, withHandlers } from 'recompose'
import { withRouter } from 'react-router-dom'

// import classnames from 'classnames'
// import Skeleton from 'react-loading-skeleton'
// import NumberFormat from 'react-number-format'

import { PosConfigs } from '../../../generated-pos-models'

import { ConfigurationColumns } from '../../../utils/transformers/configuration'
import DataTable from '../../../shared/components/DataTable'

const Table = ({
  data,
  offset,
  limit,
  handlePageChange,
  onClickRow,
}) => {

  const tableColumnExtensions = ConfigurationColumns.map(col => ({
    columnName: col.name,
    wordWrapEnabled: true,
  }))
  const { loading, posConfigs } = data;
  const rows = loading || !posConfigs ? [] : posConfigs.records;
  const totalCount = loading || !posConfigs ? 0 : posConfigs.length;
  
  return (
    <Fragment>
      <DataTable
        rows={rows.map(el => ({
          id:el.id,
          name: el.name,
          stockLocation: el.stockLocation.name
        }))}
        columns={ConfigurationColumns}
        totalCount={totalCount}
        defaultSorting={[{ columnName: 'displayName', direction: 'asc' }]}
        offset={offset} 
        limit={limit}
        handlePageChange={handlePageChange}
        tableColumnExtensions={tableColumnExtensions}
        clickableRow
        onClickRow={onClickRow}
        loading={loading}
      />
    </Fragment>
  )
}


const ConfigurationTable = compose(
  withRouter,
  PosConfigs.HOC({
    options: ({ filters, offset, limit }) => ({
      context: {
        clientName: "pos"
      },
      variables: {
        filters,
        offset,
        limit
      },
      fetchPolicy: 'network-only'
    })
  }),
  withHandlers({
    onClickRow: ({ history }) => row => {
      history.push(`/configuration/details/${row.id}`)
    },
    handlePageChange: ({ setOffset }) => offset => setOffset(offset)
  })
)(Table)

export default (ConfigurationTable)
import React, { Fragment } from 'react'
import { compose, withHandlers } from 'recompose'
import { withRouter } from 'react-router-dom'

import { PosCategories } from '../../../generated-pos-models'

import { ProductCategoryColumns } from '../../../utils/transformers/productcategory'
import DataTable from '../../../shared/components/DataTable'

const Table = ({
  data,
  offset,
  handlePageChange,
  onClickRow,
}) => {
  const tableColumnExtensions = ProductCategoryColumns.map(col => ({
    columnName: col.name,
    wordWrapEnabled: true,
  }))
  const { loading, posCategories } = data;
  const rows =
    loading || !posCategories ? [] : posCategories.records;
  const totalCount = 
    loading || !posCategories ? 0 : posCategories.length;
  const limit = 10;

  return (
    <Fragment>
      <DataTable
        rows={rows}
        columns={ProductCategoryColumns}
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


const ProductCategoryTable = compose(
  withRouter,
  PosCategories.HOC({
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
      history.push(`/product_category/details/${row.id}`)
    },
  })
)(Table)

export default(ProductCategoryTable)

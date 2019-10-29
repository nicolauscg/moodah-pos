import React, { Fragment } from 'react'
  import classnames from 'classnames'
  import { compose, withHandlers, withStateHandlers, withState } from 'recompose'
  import { withRouter } from 'react-router-dom'

  import Skeleton from 'react-loading-skeleton'
  import NumberFormat from 'react-number-format'

  import { ProductCategoryColumns } from '../../../utils/transformers/productcategory'
  import DataTable from '../../../shared/components/DataTable'

   const Table = ({
    offset,
    limit,
    handlePageChange,
    onClickRow,
  }) => {

    const tableColumnExtensions = ProductCategoryColumns.map(col => ({
      columnName: col.name,
      wordWrapEnabled: true,
    }))
    return (
      <Fragment>
        <DataTable
          rows={[]}
          columns={ProductCategoryColumns}
          defaultSorting={[{ columnName: 'name', direction: 'asc' }]}
          offset={offset}
          limit={limit}
          handlePageChange={handlePageChange}
          tableColumnExtensions={tableColumnExtensions}
          clickableRow
          onClickRow={onClickRow}
        />
      </Fragment>
    )
  }


  const ProductCategoryTable = compose(
    withRouter,
  )(Table)

export default(ProductCategoryTable)

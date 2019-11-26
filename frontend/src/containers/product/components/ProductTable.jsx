import React, { Fragment } from "react";
import { compose, withHandlers } from "recompose";
import { withRouter } from "react-router-dom";

import { PosProducts } from "../../../generated-pos-models";

import {
  ProductColumns,
  prepareProductRows
} from "../../../utils/transformers/product";
import DataTable from "../../../shared/components/DataTable";

const Table = ({ data, offset, limit, handlePageChange, onClickRow }) => {
  const tableColumnExtensions = ProductColumns.map(col => ({
    columnName: col.name,
    wordWrapEnabled: true
  }));
  const { loading, posProducts } = data;
  const rows = loading || !posProducts ? [] : posProducts.records;
  const totalCount = loading || !posProducts ? 0 : posProducts.length;

  return (
    <Fragment>
      <DataTable
        rows={prepareProductRows(rows)}
        columns={ProductColumns}
        totalCount={totalCount}
        defaultSorting={[{ columnName: "name", direction: "asc" }]}
        offset={offset}
        limit={limit}
        handlePageChange={handlePageChange}
        tableColumnExtensions={tableColumnExtensions}
        clickableRow
        onClickRow={onClickRow}
        loading={loading}
      />
    </Fragment>
  );
};

const ProductTable = compose(
  withRouter,
  PosProducts.HOC({
    options: ({ filters, offset, limit }) => ({
      context: {
        clientName: "pos"
      },
      variables: {
        filters,
        offset,
        limit
      },
      fetchPolicy: "network-only"
    })
  }),
  withHandlers({
    onClickRow: ({ history }) => row => {
      history.push(`/product/details/${row.id}`);
    },
    handlePageChange: ({ setOffset }) => offset => setOffset(offset)
  })
)(Table);

export default ProductTable;

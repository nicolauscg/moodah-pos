import React, { Fragment } from "react";
import { compose, withHandlers } from "recompose";
import { withRouter } from "react-router-dom";

import { PosCategories } from "../../../generated-pos-models";

import { CategoryColumns } from "../../../utils/transformers/category";
import DataTable from "../../../shared/components/DataTable";

const Table = ({ data, offset, limit, handlePageChange, onClickRow }) => {
  const tableColumnExtensions = CategoryColumns.map(col => ({
    columnName: col.name,
    wordWrapEnabled: true
  }));
  const { loading, posCategories } = data;
  const rows = loading || !posCategories ? [] : posCategories.records;
  const totalCount = loading || !posCategories ? 0 : posCategories.length;

  return (
    <Fragment>
      <DataTable
        rows={rows}
        columns={CategoryColumns}
        totalCount={totalCount}
        defaultSorting={[{ columnName: "displayName", direction: "asc" }]}
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

const CategoryTable = compose(
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
      fetchPolicy: "network-only"
    })
  }),
  withHandlers({
    onClickRow: ({ history }) => row => {
      history.push(`/category/details/${row.id}`);
    },
    handlePageChange: ({ setOffset }) => offset => setOffset(offset)
  })
)(Table);

export default CategoryTable;

import React, { Fragment } from "react";
import { compose, withHandlers, getContext } from "recompose";
import { withRouter } from "react-router-dom";

import { PosConfigsDashboard } from "../../../generated-pos-models";
import {
  DashboardColumns,
  preparePosConfigRows
} from "../../../utils/transformers/dashboard";
import DataTable from "../../../shared/components/DataTable";

const Table = ({
  data,
  offset,
  limit,
  handlePageChange,
  onClickRow,
  openSession,
  closeSession
}) => {
  const tableColumnExtensions = DashboardColumns.map(col => ({
    columnName: col.name,
    wordWrapEnabled: true
  }));
  const { loading, posConfigs } = data;
  const rows = loading || !posConfigs ? [] : posConfigs.records;
  const totalCount = loading || !posConfigs ? 0 : posConfigs.length;

  return (
    <Fragment>
      <DataTable
        rows={preparePosConfigRows(rows, openSession, closeSession)}
        columns={DashboardColumns}
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

const DashboardTable = compose(
  withRouter,
  PosConfigsDashboard.HOC({
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
      history.push(`/configuration/details/${row.id}`);
    },
    handlePageChange: ({ setOffset }) => offset => setOffset(offset)
  })
)(Table);

export default DashboardTable;

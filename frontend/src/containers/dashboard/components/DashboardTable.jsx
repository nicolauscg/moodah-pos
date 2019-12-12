import React, { Fragment } from "react";
import { compose, withHandlers, getContext, withProps } from "recompose";
import { withRouter } from "react-router-dom";

import Loader from "../../../shared/components/Loader";
import {
  PosConfigsDashboard,
  OpenSession,
  CloseSession
} from "../../../generated-pos-models";
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
  loadingOpen,
  closeSession,
  loadingClose,
  history
}) => {
  if (loadingOpen || loadingClose) {
    return <Loader />;
  }

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
        rows={preparePosConfigRows(rows, openSession, closeSession, history)}
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
    refetchPosConfigs: ({ data }) => () => ({
      data: data.refetch()
    })
  }),
  WrappedComp => props => (
    <OpenSession.Component onError={props.onError}>
      {(openSession, { loading }) => (
        <WrappedComp
          openSession={openSession}
          loadingOpen={loading}
          {...props}
        />
      )}
    </OpenSession.Component>
  ),
  WrappedComp => props => (
    <CloseSession.Component
      onCompleted={props.refetchPosConfigs}
      onError={props.onError}
    >
      {(closeSession, { loading }) => (
        <WrappedComp
          closeSession={closeSession}
          loadingClose={loading}
          {...props}
        />
      )}
    </CloseSession.Component>
  ),
  withHandlers({
    onClickRow: ({ history }) => row => {
      history.push(`/configuration/details/${row.id}`);
    },
    handlePageChange: ({ setOffset }) => offset => setOffset(offset)
  })
  // withProps({
  //   onOpenSessionSuccess: () => console.log("onOpenSessionSuccess")
  // })
)(Table);

export default DashboardTable;

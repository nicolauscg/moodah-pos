import React, { Fragment } from "react";
import { Button, Badge } from "reactstrap";
import { PosConfigsDashboard } from "../../generated-pos-models";
import { pathOr } from "ramda";

// ====================================================
// Constants
// ====================================================
export const DashboardColumns = [
  { name: "name", title: "Point of Sale Name" },
  { name: "stockLocation", title: "Stock Location" },
  { name: "sessionButtons", title: " " }
];

// ====================================================
// Transformers
// ====================================================
const getInProgressName = (configurationName, sessionUsername) => (
  <p>
    {configurationName}{" "}
    <Badge color="success">{`In Progress by ${sessionUsername}`}</Badge>
  </p>
);

export const preparePosConfigRows = (
  rows: Array<PosConfigsDashboard.Records>,
  open,
  close,
  history
) => {
  return rows.map(row => ({
    ...row,
    name:
      row.posSessionState === null
        ? row.name
        : getInProgressName(row.name, row.posSessionUsername),
    stockLocation:
      row.stockLocation === null ? row.stockLocation : row.stockLocation.name,
    sessionButtons:
      row.posSessionState === "opened" && row.currentSessionState === null ? (
        <></>
      ) : row.currentSessionState === "opened" ? (
        <Fragment>
          <Button
            size="sm"
            color="primary"
            tag="a"
            className="text-white"
            onClick={event => {
              event.stopPropagation();
              history.push(
                `/configuration/${row.id}/session/${row.currentSessionId.id}`
              );
            }}
          >
            resume session
          </Button>
          <Button
            size="sm"
            color="danger"
            className="text-white"
            tag="a"
            onClick={event => {
              close({
                context: {
                  clientName: "pos"
                },
                variables: {
                  id: row.currentSessionId.id
                }
              });
              event.stopPropagation();
            }}
          >
            close session
          </Button>
        </Fragment>
      ) : (
        <Button
          size="sm"
          color="primary"
          className="text-white"
          tag="a"
          onClick={event => {
            open({
              context: {
                clientName: "pos"
              },
              variables: {
                id: row.id
              }
            }).then(result => {
              const sessionId = pathOr(
                false,
                ["data", "openSession", "sessionId"],
                result
              );
              if (sessionId) {
                history.push(`/configuration/${row.id}/session/${sessionId}`);
              }
            });
            event.stopPropagation();
          }}
        >
          new session
        </Button>
      )
  }));
};

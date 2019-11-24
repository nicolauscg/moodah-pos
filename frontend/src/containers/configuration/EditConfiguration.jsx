import React, { Fragment } from "react";
import { connect } from "react-redux";
import { compose, withHandlers, getContext, withState } from "recompose";

import { Col, Container, Row, Card, Button } from "reactstrap";
import { Link } from "react-router-dom";
import Loader from "../../shared/components/Loader";
import {
  PosConfig,
  UpdatePosConfig,
  DeletePosConfig
} from "../../generated-pos-models";
import { preparePosConfig } from "../../utils/transformers/configuration";
import { ErrorHandlerContext } from "../../utils/transformers/general";
import { addNotif } from "../../redux/modules/general";

import Breadcrumb from "../../shared/components/Breadcrumb";
import PosConfigForm from "./components/ConfigurationForm";
import Modal from "../../shared/components/form-custom/Modal";

const DeleteModal = ({ toggle, isOpen, confirm }) => {
  return (
    <Modal
      type="dialog"
      title="Delete Configuration"
      body="Are you sure you want to delete this configuration"
      action={
        <Fragment>
          <Button color="primary" size="sm" onClick={confirm}>
            Yes
          </Button>
          <Button color="danger" size="sm" onClick={toggle}>
            No
          </Button>
        </Fragment>
      }
      toggle={toggle}
      isOpen={isOpen}
      centered
    />
  );
};

const EditPosConfig = ({
  data,
  match,
  deleteState,
  onEditSuccess,
  onDeleteSuccess,
  deleteToggle,
  deleteConfirm,
  onError
}) => {
  const { isOpen } = deleteState;
  const id = match.params.id;

  return (
    <UpdatePosConfig.Component onCompleted={onEditSuccess} onError={onError}>
      {(UpdatePosConfig, { loading }) => (
        <DeletePosConfig.Component
          onCompleted={onDeleteSuccess}
          onError={onError}
        >
          {(deletePosConfig, { loading: deleteLoading }) => {
            const { loading: dataLoading, posConfig } = data;

            if (loading || dataLoading || deleteLoading) {
              return <Loader />;
            }

            return (
              <Fragment>
                <Container className="posconfig__form">
                  <Row className="header">
                    <Col md={6} className="header__item">
                      <Breadcrumb
                        crumbs={[
                          {
                            text: "Configuration",
                            path: "/product_category/list"
                          },
                          { text: posConfig.displayName }
                        ]}
                      />
                    </Col>
                    <Col
                      md={6}
                      className="header__item d-flex justify-content-end align-items-center"
                    >
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => deleteToggle(id)}
                      >
                        Delete
                      </Button>
                      <div>
                        <Link
                          to="/configuration/list"
                          className="btn btn-info btn-sm"
                        >
                          Back
                        </Link>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <Card>
                        <PosConfigForm
                          posConfig={preparePosConfig(posConfig)}
                          handleSubmit={UpdatePosConfig}
                        />
                      </Card>
                    </Col>
                  </Row>
                </Container>
                <DeleteModal
                  toggle={deleteToggle}
                  isOpen={isOpen}
                  confirm={() => deleteConfirm(deletePosConfig)}
                />
              </Fragment>
            );
          }}
        </DeletePosConfig.Component>
      )}
    </UpdatePosConfig.Component>
  );
};

const defaultDeleteState = {
  isOpen: false,
  deleteId: null
};

const enhance = compose(
  withState("deleteState", "setDeleteState", defaultDeleteState),
  connect(
    null,
    dispatch => ({
      triggerNotif: notif => dispatch(addNotif(notif))
    })
  ),
  PosConfig.HOC({
    options: ({ match }) => ({
      context: {
        clientName: "pos"
      },
      variables: {
        input: {
          id: match.params.id
        }
      }
    })
  }),
  withHandlers({
    onEditSuccess: ({ triggerNotif }) => () =>
      triggerNotif({
        message: "Configuration updated successfully",
        type: "success"
      }),
    deleteToggle: ({ deleteState, setDeleteState }) => id => {
      const isOpen = !deleteState.isOpen;
      const deleteId = id;

      setDeleteState({
        isOpen,
        deleteId
      });
    },
    deleteConfirm: ({ deleteState, setDeleteState }) => (
      deletePosConfig,
      id
    ) => {
      const { deleteId } = deleteState;
      const vals = {
        id: deleteId || id
      };

      setDeleteState(defaultDeleteState);
      deletePosConfig({
        context: {
          clientName: "pos"
        },
        variables: {
          input: vals
        }
      });
    },
    onDeleteSuccess: ({ triggerNotif, history }) => () => {
      const message = "Configuration successfully deleted";

      history.push(`/configuration/list`);
      triggerNotif({
        message,
        type: "success"
      });
    }
  }),
  getContext(ErrorHandlerContext)
);

export default enhance(EditPosConfig);

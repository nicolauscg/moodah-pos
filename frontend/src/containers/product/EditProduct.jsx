import React, { Fragment } from "react";
import { connect } from "react-redux";
import { compose, withHandlers, getContext, withState } from "recompose";

import { Col, Container, Row, Card, Button } from "reactstrap";
import { Link } from "react-router-dom";
import Loader from "../../shared/components/Loader";
import {
  PosProduct,
  UpdatePosProduct,
  DeletePosProduct
} from "../../generated-pos-models";
import { preparePosProduct } from "../../utils/transformers/product";
import { ErrorHandlerContext } from "../../utils/transformers/general";
import { addNotif } from "../../redux/modules/general";

import Breadcrumb from "../../shared/components/Breadcrumb";
import ProductForm from "./components/ProductForm";
import Modal from "../../shared/components/form-custom/Modal";

const DeleteModal = ({ toggle, isOpen, confirm }) => {
  return (
    <Modal
      type="dialog"
      title="Delete Product"
      body="Are you sure you want to delete this product?"
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

const EditProduct = ({
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
    <UpdatePosProduct.Component onCompleted={onEditSuccess} onError={onError}>
      {(updatePosProduct, { loading }) => (
        <DeletePosProduct.Component
          onCompleted={onDeleteSuccess}
          onError={onError}
        >
          {(deletePosProduct, { loading: deleteLoading }) => {
            const { loading: dataLoading, posProduct } = data;

            if (loading || dataLoading || deleteLoading) {
              return <Loader />;
            }

            return (
              <Fragment>
                <Container>
                  <Row className="header">
                    <Col md={6} className="header__item">
                      <Breadcrumb
                        crumbs={[
                          { text: "Product", path: "/product/list" },
                          { text: posProduct.name }
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
                          to="/product/list"
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
                        <ProductForm
                          posProduct={preparePosProduct(posProduct)}
                          handleSubmit={updatePosProduct}
                        />
                      </Card>
                    </Col>
                  </Row>
                </Container>
                <DeleteModal
                  toggle={deleteToggle}
                  isOpen={isOpen}
                  confirm={() => deleteConfirm(deletePosProduct)}
                />
              </Fragment>
            );
          }}
        </DeletePosProduct.Component>
      )}
    </UpdatePosProduct.Component>
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
  PosProduct.HOC({
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
        message: "Product updated successfully",
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
      deletePosProduct,
      id
    ) => {
      const { deleteId } = deleteState;
      const vals = {
        id: deleteId || id
      };

      setDeleteState(defaultDeleteState);
      deletePosProduct({
        context: {
          clientName: "pos"
        },
        variables: {
          input: vals
        }
      });
    },
    onDeleteSuccess: ({ triggerNotif, history }) => () => {
      const message = "Product successfully deleted";

      history.push(`/product/list`);
      triggerNotif({
        message,
        type: "success"
      });
    }
  }),
  getContext(ErrorHandlerContext)
);

export default enhance(EditProduct);

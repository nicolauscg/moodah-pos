import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, getContext } from "recompose";

import { Col, Container, Row, Card } from "reactstrap";
import { Link } from "react-router-dom";
import { CreatePosProduct } from "../../generated-pos-models";
import BlockUi from "react-block-ui";
import { ErrorHandlerContext } from "../../utils/transformers/general";
import { addNotif } from "../../redux/modules/general";

import Breadcrumb from "../../shared/components/Breadcrumb";
import ProductForm from "./components/ProductForm";

const enhance = compose(
  getContext(ErrorHandlerContext),
  connect(
    null,
    dispatch => ({
      triggerNotif: notif => dispatch(addNotif(notif))
    })
  ),
  withHandlers({
    onCreateSuccess: ({ history, triggerNotif }) => () => {
      history.push(`/product/list`);
      triggerNotif({
        message: "Product successfully created",
        type: "success"
      });
    }
  }),
  WrappedComp => props => (
    <CreatePosProduct.Component
      onCompleted={props.onCreateSuccess}
      onError={props.onError}
    >
      {(createPosProduct, { loading }) => (
        <WrappedComp
          createPosProduct={createPosProduct}
          loadingCreate={loading}
          {...props}
        />
      )}
    </CreatePosProduct.Component>
  )
);

const CreateProductPage = enhance(({ createPosProduct, loadingCreate }) => {
  return (
    <BlockUi blocking={loadingCreate}>
      <Container className="product__form">
        <Row className="header">
          <Col md={6} className="header__item">
            <Breadcrumb
              crumbs={[
                { text: "Product", path: "/product/list" },
                { text: "Buat Baru" }
              ]}
            />
          </Col>
          <Col
            md={6}
            className="header__item d-flex justify-content-end align-items-center"
          >
            <div>
              <Link to="/product/list" className="btn btn-info btn-sm">
                Back
              </Link>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Card>
              <ProductForm handleSubmit={createPosProduct} />
            </Card>
          </Col>
        </Row>
      </Container>
    </BlockUi>
  );
});

export { ProductForm };

export default CreateProductPage;

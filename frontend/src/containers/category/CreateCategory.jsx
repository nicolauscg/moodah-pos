import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, getContext } from "recompose";

import { Col, Container, Row, Card } from "reactstrap";
import { Link } from "react-router-dom";
import { CreatePosCategory } from "../../generated-pos-models";
import BlockUi from "react-block-ui";
import { ErrorHandlerContext } from "../../utils/transformers/general";
import { addNotif } from "../../redux/modules/general";

import Breadcrumb from "../../shared/components/Breadcrumb";
import CategoryForm from "./components/CategoryForm";

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
      history.push(`/category/list`);
      triggerNotif({
        message: "Category successfully created",
        type: "success"
      });
    }
  }),
  WrappedComp => props => (
    <CreatePosCategory.Component
      onCompleted={props.onCreateSuccess}
      onError={props.onError}
    >
      {(createPosCategory, { loading }) => (
        <WrappedComp
          createPosCategory={createPosCategory}
          loadingCreate={loading}
          {...props}
        />
      )}
    </CreatePosCategory.Component>
  )
);

const CreateCategoryPage = enhance(({ createPosCategory, loadingCreate }) => {
  return (
    <BlockUi blocking={loadingCreate}>
      <Container className="category__form">
        <Row className="header">
          <Col md={6} className="header__item">
            <Breadcrumb
              crumbs={[
                {
                  text: "Category",
                  path: "/category/list"
                },
                { text: "Buat Baru" }
              ]}
            />
          </Col>
          <Col
            md={6}
            className="header__item d-flex justify-content-end align-items-center"
          >
            <div>
              <Link to="/category/list" className="btn btn-info btn-sm">
                Back
              </Link>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Card>
              <CategoryForm handleSubmit={createPosCategory} />
            </Card>
          </Col>
        </Row>
      </Container>
    </BlockUi>
  );
});

export { CategoryForm };

export default CreateCategoryPage;

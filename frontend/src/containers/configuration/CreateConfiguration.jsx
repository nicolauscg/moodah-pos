import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, getContext } from "recompose";

import { Col, Container, Row, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import BlockUi from "react-block-ui";

import { addNotif } from "../../redux/modules/general";
import { ErrorHandlerContext } from "../../utils/transformers/general";
import ConfigurationForm from "./components/ConfigurationForm";
import Breadcrumb from "../../shared/components/Breadcrumb";
import { CreatePosConfig } from "../../generated-pos-models";

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
      history.push(`/configuration/list`);
      triggerNotif({
        message: "Configuration successfully created",
        type: "success"
      });
    }
  }),
  WrappedComp => props => (
    <CreatePosConfig.Component
      onCompleted={props.onCreateSuccess}
      onError={props.onError}
    >
      {(createPosConfig, { loading }) => (
        <WrappedComp
          createPosConfig={createPosConfig}
          loadingCreate={loading}
          {...props}
        />
      )}
    </CreatePosConfig.Component>
  )
);

const CreateConfigurationPage = enhance(
  ({ createPosConfig, loadingCreate }) => {
    return (
      <BlockUi blocking={loadingCreate}>
        <Container className="configuration__form">
          <Row className="header">
            <Col md={6} className="header__item">
              <Breadcrumb
                crumbs={[
                  { text: "Configuration", path: "/configuration/list" },
                  { text: "Buat Baru" }
                ]}
              />
            </Col>
            <Col
              md={6}
              className="header__item d-flex justify-content-end align-items-center"
            >
              <div>
                <Link to="/configuration/list" className="btn btn-info btn-sm">
                  Back
                </Link>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Card>
                <CardBody>
                  <ConfigurationForm handleSubmit={createPosConfig} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </BlockUi>
    );
  }
);

export { ConfigurationForm };

export default CreateConfigurationPage;

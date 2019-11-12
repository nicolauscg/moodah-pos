import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { compose, withHandlers, lifecycle, getContext } from 'recompose'

import { Col, Container, Row, Button, Card, CardBody } from 'reactstrap'
import { Link } from 'react-router-dom'
import BlockUi from 'react-block-ui'

import { ErrorHandlerContext } from '../../utils/transformers/general'
import { addNotif } from '../../redux/modules/general'

import ConfigurationForm from './components/ConfigurationForm'
import Breadcrumb from '../../shared/components/Breadcrumb'


// =============================================================================
// Create Res Configuration Full Page
// =============================================================================

const enhance = compose(
  withHandlers({
    onCreateSuccess: ({ history }) => () => history.push(`/configuration/list`),
  })
)

const CreateConfigurationPage = enhance(({ onCreateSuccess }) => {
  return (
    <Container className="configuration__form">
      <Row className="header">
        <Col md={6} className="header__item">
          <Breadcrumb
            crumbs={[
              { text: 'Configuration', path: '/configuration/list' },
              { text: 'Buat Baru' },
            ]}
          />
        </Col>
        <Col
          md={6}
          className="header__item d-flex justify-content-end align-items-center"
        >
          <div className="mr-3">
            <Link to="/configuration/list" className="btn btn-primary btn-sm">
              Save
            </Link>
          </div>
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
               <ConfigurationForm />
             </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  )
})

export { ConfigurationForm }

export default CreateConfigurationPage

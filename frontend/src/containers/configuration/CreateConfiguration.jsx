import React from 'react'
import { compose, withHandlers } from 'recompose'

import { Col, Container, Row, Card, CardBody } from 'reactstrap'
import { Link } from 'react-router-dom'

import ConfigurationForm from './components/ConfigurationForm'
import Breadcrumb from '../../shared/components/Breadcrumb'

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

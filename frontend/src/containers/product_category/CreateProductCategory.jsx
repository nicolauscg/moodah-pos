import React from 'react'
import { compose, withHandlers } from 'recompose'

import { Col, Container, Row, Card } from 'reactstrap'
import { Link } from 'react-router-dom'

import Breadcrumb from '../../shared/components/Breadcrumb'
import ProductCategoryForm from './components/ProductCategoryForm'

const enhance = compose(
  withHandlers({
    onCreateSuccess: ({ history }) => () => history.push(`/product_category/list`),
  })
)

const CreateProductCategoryPage = enhance(({ onCreateSuccess }) => {
  return (
    <Container className="productcategory__form">
      <Row className="header">
        <Col md={6} className="header__item">
          <Breadcrumb
            crumbs={[
              { text: 'Product Category', path: '/product_category/list' },
              { text: 'Buat Baru' },
            ]}
          />
        </Col>
        <Col
          md={6}
          className="header__item d-flex justify-content-end align-items-center"
        >
          <div className="mr-3">
            <Link to="/product_category/list" className="btn btn-info btn-sm">
            Save
            </Link>
          </div>
          <div>
            <Link to="/product_category/list" className="btn btn-info btn-sm">
            Back
            </Link>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card>
            <ProductCategoryForm/>
          </Card>
        </Col>
      </Row>
    </Container>
  )
})

export {ProductCategoryForm}

export default CreateProductCategoryPage
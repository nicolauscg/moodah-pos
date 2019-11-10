import React from 'react'
import { compose } from 'recompose'

import { Col, Container, Row, Card } from 'reactstrap'
import { Link } from 'react-router-dom'
import Loader from '../../shared/components/Loader'
import { PosCategory } from '../../generated-pos-models'

import Breadcrumb from '../../shared/components/Breadcrumb'
import ProductCategoryForm from './components/ProductCategoryForm'

const EditProductCategory = ({ data }) => {
  const { loading: dataLoading, posCategory } = data;

  if (dataLoading) {
    return <Loader />
  }

  return (
    <Container className="productcategory__form">
      <Row className="header">
        <Col md={6} className="header__item">
          <Breadcrumb
            crumbs={[
              { text: 'Category', path: '/product_category/list' },
              { text: posCategory.displayName },
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
            <ProductCategoryForm productcategory={posCategory} />
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

const enhance = compose(
  PosCategory.HOC({
    options: ({ match }) => ({
      context: {
        clientName: "pos"
      },
      variables: {
        input: {
          id: match.params.id
        }
      }
    }),
  })
)

export default enhance(EditProductCategory)
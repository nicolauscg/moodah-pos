import React from 'react'
import { connect } from 'react-redux'
import { compose, withHandlers, getContext } from 'recompose'

import { Col, Container, Row, Card } from 'reactstrap'
import { Link } from 'react-router-dom'
import { CreatePosCategory } from '../../generated-pos-models'
import BlockUi from 'react-block-ui'
import { ErrorHandlerContext } from '../../utils/transformers/general'
import { addNotif } from '../../redux/modules/general'

import Breadcrumb from '../../shared/components/Breadcrumb'
import ProductCategoryForm from './components/ProductCategoryForm'

const enhance = compose(
  getContext(ErrorHandlerContext),
  connect(
    null,
    dispatch => ({
      triggerNotif: notif => dispatch(addNotif(notif)),
    })
  ),
  withHandlers({
    onCreateSuccess: ({ history, triggerNotif }) => () => {
      history.push(`/product_category/list`)
      triggerNotif({
        message: 'Product category successfully created',
        type: 'success'
      })
    }
  })
)

const CreateProductCategoryPage = enhance(({
  onCreateSuccess,
  onError
}) => {
  return (
    <CreatePosCategory.Component onCompleted={onCreateSuccess} onError={onError}>
      {(createPosCategory, { loading }) => {
        
        return (
          <BlockUi blocking={ loading }>
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
                    <ProductCategoryForm handleSubmit={createPosCategory} />
                  </Card>
                </Col>
              </Row>
            </Container>
          </BlockUi>
        )
      }}
    </CreatePosCategory.Component>
  )
})

export {ProductCategoryForm}

export default CreateProductCategoryPage
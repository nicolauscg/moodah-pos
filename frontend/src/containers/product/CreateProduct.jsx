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
import ProductForm from './components/ProductForm'

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
      history.push(`/product/list`)
      triggerNotif({
        message: 'Product successfully created',
        type: 'success'
      })
    }
  })
)

const CreateProductPage = enhance(({
  onCreateSuccess,
  onError
}) => {
        return (
            <Container className="product__form">
              <Row className="header">
                <Col md={6} className="header__item">
                  <Breadcrumb
                    crumbs={[
                      { text: 'Product', path: '/product/list' },
                      { text: 'Buat Baru' },
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
                    <ProductForm />
                  </Card>
                </Col>
              </Row>
            </Container>
        )
      }
  )


export {ProductForm}

export default CreateProductPage
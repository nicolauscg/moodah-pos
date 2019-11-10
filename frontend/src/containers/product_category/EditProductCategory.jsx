import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { compose, withHandlers, getContext, withState } from 'recompose'

import { Col, Container, Row, Card, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import Loader from '../../shared/components/Loader'
import { PosCategory, UpdatePosCategory, DeletePosCategory } from '../../generated-pos-models'
import { ErrorHandlerContext } from '../../utils/transformers/general'
import { addNotif } from '../../redux/modules/general'

import Breadcrumb from '../../shared/components/Breadcrumb'
import ProductCategoryForm from './components/ProductCategoryForm'
import Modal from '../../shared/components/form-custom/Modal'

const DeleteModal = ({ toggle, isOpen, confirm }) => {
  return (
    <Modal
      type="dialog"
      title="Delete Product Category"
      body="Are you sure you want to delete this product category?"
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
  )
}

const EditProductCategory = ({
  data,
  match,
  deleteState,
  onEditSuccess,
  onDeleteSuccess,
  deleteToggle,
  deleteConfirm,
  onError,
}) => {
  const { isOpen } = deleteState
  const id = match.params.id

  return (
    <UpdatePosCategory.Component onCompleted={onEditSuccess} onError={onError}>
      {(updatePosCategory, { loading }) => (
        <DeletePosCategory.Component
          onCompleted={onDeleteSuccess}
          onError={onError}
        >
          {(deleteResPartner, { loading: deleteLoading }) => {
            const { loading: dataLoading, posCategory } = data;

            if (loading || dataLoading || deleteLoading) {
              return <Loader />
            }

            return (
              <Fragment>
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
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => deleteToggle(id)}
                      >
                        Delete
                      </Button>
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
                        <ProductCategoryForm
                          productcategory={posCategory}
                          handleSubmit={updatePosCategory}
                        />
                      </Card>
                    </Col>
                  </Row>
                </Container>
                <DeleteModal
                  toggle={deleteToggle}
                  isOpen={isOpen}
                  confirm={() => deleteConfirm(deleteResPartner)}
                />
              </Fragment>
            )
          }}
        </DeletePosCategory.Component>
      )}
    </UpdatePosCategory.Component>
  )
}

const defaultDeleteState = {
  isOpen: false,
  deleteId: null,
}

const enhance = compose(
  withState('deleteState', 'setDeleteState', defaultDeleteState),
  connect(
    null,
    dispatch => ({
      triggerNotif: notif => dispatch(addNotif(notif)),
    })
  ),
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
  }),
  withHandlers({
    onEditSuccess: ({ triggerNotif }) => () =>
      triggerNotif({
        message: 'Product category updated successfully',
        type: 'success',
      }),
    deleteToggle: ({ deleteState, setDeleteState }) => id => {
      const isOpen = !deleteState.isOpen
      const deleteId = id

      setDeleteState({
        isOpen,
        deleteId,
      })
    },
    deleteConfirm: ({ deleteState, setDeleteState }) => (
      deleteResPartner,
      id
    ) => {
      const { deleteId } = deleteState
      const vals = {
        id: deleteId || id
      }

      setDeleteState(defaultDeleteState)
      deleteResPartner({
        context: {
          clientName: "pos"
        },
        variables: {
          input: vals
        }
      })
    },
    onDeleteSuccess: ({ triggerNotif, history }) => () => {
      const message = "Product category successfully deleted"

      history.push(`/product_category/list`)
      triggerNotif({
        message,
        type: 'success',
      })
    },
  }),
  getContext(ErrorHandlerContext)
)

export default enhance(EditProductCategory)
import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { compose, withHandlers, withState, getContext } from 'recompose'
import { Col, Container, Row, Button } from 'reactstrap'
import { Link } from 'react-router-dom'

import { preparePartner } from '../../utils/transformers/partner'
import { ErrorHandlerContext } from '../../utils/transformers/general'
import { addNotif } from '../../redux/modules/general'
import { ResPartner, EditResPartner } from '../../generated-models'

import PartnerForm from './components/PartnerForm'
import PartnerDetails from './components/PartnerDetails'
import Breadcrumb from '../../shared/components/Breadcrumb'
import Loader from '../../shared/components/Loader'
import Modal from '../../shared/components/form-custom/Modal'

const DeleteModal = ({ active, toggle, isOpen, confirm }) => {
  return (
    <Modal
      type="dialog"
      title={`${active ? 'Arsipkan' : 'Aktifkan'} Mitra`}
      body={`Apakah anda yakin mau ${
        active ? 'mengarsipkan' : 'mengaktifkan'
      } mitra ini ?`}
      action={
        <Fragment>
          <Button color="primary" size="sm" onClick={confirm}>
            Iya
          </Button>
          <Button color="danger" size="sm" onClick={toggle}>
            Tidak
          </Button>
        </Fragment>
      }
      toggle={toggle}
      isOpen={isOpen}
      centered
    />
  )
}

const EditPartner = ({
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
    <EditResPartner.Component onCompleted={onEditSuccess} onError={onError}>
      {(editResPartner, { loading }) => (
        <EditResPartner.Component
          onCompleted={onDeleteSuccess}
          onError={onError}
        >
          {(deleteResPartner, { loading: deleteLoading }) => {
            const { loading: dataLoading, resPartner } = data

            if (loading || dataLoading || deleteLoading) {
              return <Loader />
            }

            const { active } = resPartner

            return (
              <Fragment>
                <Container className="partners__form">
                  <Row className="header">
                    <Col md={6} className="header__item">
                      <Breadcrumb
                        crumbs={[
                          { text: 'Kontak', path: '/partners/list' },
                          { text: resPartner.name },
                        ]}
                      />
                    </Col>
                    <Col
                      md={6}
                      className="header__item d-flex justify-content-end align-items-center"
                    >
                      {active ? (
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => deleteToggle(id)}
                        >
                          Arsipkan Kontak
                        </Button>
                      ) : (
                        <Button
                          color="notification"
                          size="sm"
                          onClick={() =>
                            deleteConfirm(deleteResPartner, active, id)
                          }
                        >
                          Aktifkan Kontak
                        </Button>
                      )}
                      <Link to="/partners/list" className="btn btn-info btn-sm">
                        Batal
                      </Link>
                      <Button
                        color="help"
                        size="sm"
                        tag="a"
                        href="mailto:support@rubyh.co"
                      >
                        Bantuan
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    {/* <PartnerForm
                      partner={preparePartner(resPartner)}
                      handleSubmit={editResPartner}
                    /> */}
                    <PartnerDetails
                      partner={preparePartner(resPartner)}
                      handleSubmit={editResPartner}
                    />
                  </Row>
                </Container>
                <DeleteModal
                  active={active}
                  toggle={deleteToggle}
                  isOpen={isOpen}
                  confirm={() => deleteConfirm(deleteResPartner, active)}
                />
              </Fragment>
            )
          }}
        </EditResPartner.Component>
      )}
    </EditResPartner.Component>
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
  ResPartner.HOC({
    options: ({ match }) => ({ variables: { id: match.params.id } }),
  }),
  withHandlers({
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
      active,
      id
    ) => {
      const { deleteId } = deleteState

      const vals = {
        id: deleteId || id,
        active: !active,
      }

      setDeleteState(defaultDeleteState)
      deleteResPartner({ variables: { vals } })
    },
    onDeleteSuccess: ({ triggerNotif, history, data }) => () => {
      const { resPartner } = data
      const { active } = resPartner
      const message = !active
        ? 'Kontak berhasil diarsipkan'
        : 'Kontak berhasil diaktifkan'

      history.push(`/partners/list`)

      triggerNotif({
        message,
        type: 'success',
      })
    },
  }),
  withHandlers({
    onEditSuccess: ({ triggerNotif }) => () =>
      triggerNotif({
        message: 'Detail kontak berhasil diubah',
        type: 'success',
      }),
  }),
  getContext(ErrorHandlerContext)
)

export default enhance(EditPartner)

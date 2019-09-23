import React from 'react'
import { connect } from 'react-redux'
import { compose, withHandlers, lifecycle, getContext } from 'recompose'

import { Col, Container, Row, Button, Card, CardBody } from 'reactstrap'
import { Link } from 'react-router-dom'
import BlockUi from 'react-block-ui'

import { prepareDefaultPartner } from '../../utils/transformers/partner'
import { ErrorHandlerContext } from '../../utils/transformers/general'
import { addNotif } from '../../redux/modules/general'
import { GetDefaultPartner, CreateResPartner } from '../../generated-models'

import PartnerForm from './components/PartnerForm'
import Breadcrumb from '../../shared/components/Breadcrumb'

// =============================================================================
// Create Res Partner Form
// =============================================================================

const enhanceCreate = compose(
  getContext(ErrorHandlerContext),
  WrappedComp => props => (
    <GetDefaultPartner.Component onError={props.onError}>
      {(getDefaultPartner, result) => (
        <WrappedComp
          getDefaultPartner={getDefaultPartner}
          result={result}
          {...props}
        />
      )}
    </GetDefaultPartner.Component>
  ),
  connect(
    null,
    dispatch => ({
      triggerNotif: notif => dispatch(addNotif(notif)),
    })
  ),
  withHandlers({
    onCompleted: ({ triggerNotif, onCreateSuccess }) => data => {
      onCreateSuccess && onCreateSuccess(data)
      triggerNotif({ message: 'Kontak berhasil dibuat', type: 'success' })
    },
  }),
  lifecycle({
    componentDidMount() {
      this.props.getDefaultPartner()
    },
  })
)

const CreatePartnerForm = enhanceCreate(
  ({ result, onCompleted, onError, hideHelp }) => {
    const { loading: defaultLoading, data: defaultData } = result

    return (
      <CreateResPartner.Component onCompleted={onCompleted} onError={onError}>
        {(createResPartner, { loading }) => {
          return (
            <BlockUi blocking={loading || defaultLoading || !defaultData}>
              <PartnerForm
                defaultPartner={prepareDefaultPartner(
                  defaultData ? defaultData.initResPartner : null
                )}
                handleSubmit={createResPartner}
                hideHelp={hideHelp}
              />
            </BlockUi>
          )
        }}
      </CreateResPartner.Component>
    )
  }
)

// =============================================================================
// Create Res Partner Full Page
// =============================================================================

const enhance = compose(
  withHandlers({
    onCreateSuccess: ({ history }) => () => history.push(`/partners/list`),
  })
)

const CreatePartnerPage = enhance(({ onCreateSuccess }) => {
  return (
    <Container className="partners__form">
      <Row className="header">
        <Col md={6} className="header__item">
          <Breadcrumb
            crumbs={[
              { text: 'Kontak', path: '/partners/list' },
              { text: 'Buat Baru' },
            ]}
          />
        </Col>
        <Col
          md={6}
          className="header__item d-flex justify-content-end align-items-center"
        >
          <div className="mr-3">
            <Link to="/partners/list" className="btn btn-info btn-sm">
              Batal
            </Link>
          </div>
          <div>
            <Button
              color="help"
              size="sm"
              tag="a"
              href="mailto:support@rubyh.co"
            >
              Bantuan
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <CreatePartnerForm onCreateSuccess={onCreateSuccess} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  )
})

export { CreatePartnerForm }

export default CreatePartnerPage

import React, { Fragment } from 'react'
import { withState } from 'recompose'
import classnames from 'classnames'

import { Button, Col, Container, Row } from 'reactstrap'

import AccountSettingsForm from './components/AccountSettingsForm'
import Breadcrumb from '../../shared/components/Breadcrumb'
import Loader from '../../shared/components/Loader'

const AccountSettings = withState('loading', 'setLoading', false)(
  ({ loading, setLoading }) => {
    return (
      <Fragment>
        {loading ? <Loader /> : null}
        <Container
          className={classnames('journals__form', { 'white-overlay': loading })}
        >
          <Row className="header">
            <Col md={8} className="header__item">
              <Breadcrumb
                crumbs={[
                  {
                    text: 'Account Settings',
                  },
                ]}
              />
            </Col>
            <Col
              md={4}
              className="header__item d-flex align-items-center justify-content-end"
            >
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
            <AccountSettingsForm setLoading={setLoading} />
          </Row>
        </Container>
      </Fragment>
    )
  }
)

export default AccountSettings

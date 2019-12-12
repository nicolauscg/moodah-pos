import React, { Fragment } from 'react'
import classnames from 'classnames'
import { withRouter } from 'react-router-dom'

import { Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import { compose, withState, withHandlers } from 'recompose'

import PartnerForm from './PartnerForm'
import PartnerContacts from './PartnerContacts'

const PartnerDetails = ({ activeTab, toggle, ...props }) => (
  <Fragment>
    <Col xs={12}>
      <div className="main-tabs">
        <Nav tabs>
          <NavItem className={classnames({ active: activeTab === '#details' })}>
            <NavLink onClick={toggle('#details')}>Informasi Perusahaan</NavLink>
          </NavItem>
          <NavItem
            className={classnames({ active: activeTab === '#contacts' })}
          >
            <NavLink onClick={toggle('#contacts')}>Kontak</NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab} className="p-3">
          <TabPane tabId="#details">
            <PartnerForm {...props} />
          </TabPane>
          <TabPane tabId="#contacts">
            <PartnerContacts {...props} />
          </TabPane>
        </TabContent>
      </div>
    </Col>
  </Fragment>
)

const enhance = compose(
  withRouter,
  withState('activeTab', 'setActiveTab', ({ location }) =>
    location.hash ? location.hash : '#details'
  ),
  withHandlers({
    toggle: ({ activeTab, setActiveTab }) => tab => () => {
      if (activeTab !== tab) {
        setActiveTab(tab)
      }
    },
  })
)

export default enhance(PartnerDetails)

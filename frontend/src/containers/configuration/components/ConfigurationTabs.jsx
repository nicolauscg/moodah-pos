/*import React, { Fragment } from 'react'
import classnames from 'classnames'
import { compose, withHandlers, withStateHandlers, withState } from 'recompose'
import { withRouter } from 'react-router-dom'

import Skeleton from 'react-loading-skeleton'
import NumberFormat from 'react-number-format'
import {
  Col,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap'

import { PartnerColumns } from '../../../utils/transformers/partner'
import {
  ResPartners,
  TotalListCustomer,
  TotalListSupplier,
  TotalListCustomerNonActive,
  TotalListSupplierNonActive,
} from '../../../generated-models'
import {
  transformPartners,
  ImportVals,
} from '../../../utils/transformers/partner'
import offsetToCursor from '../../../utils/offsetToCursor'

import DataTable from '../../../shared/components/DataTable'
*/

/* 

const PartnerTable = compose(
  TotalListCustomer.HOC({
    name: 'totalCustomer',
    options: () => ({
      fetchPolicy: 'network-only',
    }),
  }),
  TotalListSupplier.HOC({
    name: 'totalSupplier',
    options: () => ({
      fetchPolicy: 'network-only',
    }),
  }),
  TotalListCustomerNonActive.HOC({
    name: 'totalCustomerNonActive',
    options: () => ({
      fetchPolicy: 'network-only',
    }),
  }),
  TotalListSupplierNonActive.HOC({
    name: 'totalSupplierNonActive',
    options: () => ({
      fetchPolicy: 'network-only',
    }),
  }),
  withRouter,
  withHandlers({
    onClickRow: ({ history }) => row => {
      history.push(`/partners/details/${row.id}`)
    },
  })
)(Table)


const PartnerTabs = ({
    filters,
    offset,
    toggle,
    activeTab,
    handlePageChange,
    data,
  }) => {
    const tableProps = {
      filters,
      offset,
      limit: 10,
      handlePageChange,
      data,
    }
  
    return (
      <Col xs={12}>
        <div className="main-tabs">
          <Nav tabs>
            <NavItem className={classnames({ active: activeTab === '#all' })}>
              <NavLink href="#all" onClick={toggle}>
                Semua
              </NavLink>
            </NavItem>
            <NavItem
              className={classnames({ active: activeTab === '#customer' })}
            >
              <NavLink href="#customer" onClick={toggle}>
                Customer
              </NavLink>
            </NavItem>
            <NavItem
              className={classnames({ active: activeTab === '#supplier' })}
            >
              <NavLink href="#supplier" onClick={toggle}>
                Supplier
              </NavLink>
            </NavItem>
            <NavItem
              className={classnames({ active: activeTab === '#inactive' })}
            >
              <NavLink href="#inactive" onClick={toggle}>
                Tidak Aktif
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="#all">
              <Card>
                <CardBody>
                  <PartnerTable {...tableProps} />
                </CardBody>
              </Card>
            </TabPane>
            <TabPane tabId="#customer">
              <Card>
                <CardBody>
                  <PartnerTable {...tableProps} />
                </CardBody>
              </Card>
            </TabPane>
            <TabPane tabId="#supplier">
              <Card>
                <CardBody>
                  <PartnerTable {...tableProps} />
                </CardBody>
              </Card>
            </TabPane>
            <TabPane tabId="#inactive">
              <Card>
                <CardBody>
                  <PartnerTable {...tableProps} />
                </CardBody>
              </Card>
            </TabPane>
          </TabContent>
        </div>
      </Col>
    )
  }*/

  import React, { Fragment } from 'react'
  import classnames from 'classnames'
  import { compose, withHandlers, withStateHandlers, withState } from 'recompose'
  import { withRouter } from 'react-router-dom'

  import Skeleton from 'react-loading-skeleton'
  import NumberFormat from 'react-number-format'

  import { ConfigurationColumns } from '../../../utils/transformers/configuration'
  import {
    Col,
    Card,
    CardBody,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane,
  } from 'reactstrap'

  import DataTable from '../../../shared/components/DataTable'

/*   const Table = ({
    data,
    offset,
    limit,
    location,
    handlePageChange,
    onClickRow,
  }) => {

    const tableColumnExtensions = ConfigurationColumns.map(col => ({
      columnName: col.name,
      wordWrapEnabled: true,
    }))
    return (
      <Fragment>
        <Col className="general__info">
          <Row>
          </Row>
        </Col>
        <DataTable
          // rows={rows}
          //columns={PartnerColumns}
          // totalCount={totalCount}
          //rows={rows}
          columns={ConfigurationColumns}
          defaultSorting={[{ columnName: 'name', direction: 'asc' }]}
          offset={offset}
          limit={limit}
          handlePageChange={handlePageChange}
          // tableColumnExtensions={tableColumnExtensions}
          tableColumnExtensions={tableColumnExtensions}
          clickableRow
          onClickRow={onClickRow}
          // loading={loading}
          //loading={loading}
        />
      </Fragment>
    )
  }


  const ConfigurationTable = compose(
    withRouter,
    withHandlers({
      onClickRow: ({ history }) => row => {
        history.push(`/configuration/details/${row.id}`)
      },
    })
  )(Table)*/

/*  const ConfigurationTabs = ({
      filters,
      offset,
      toggle,
      activeTab,
      handlePageChange,
      data,
    }) => {
      const tableProps = {
        filters,
        offset,
        limit: 10,
        handlePageChange,
        data,
      }

      return (
        <Col xs={12}>
          <div className="main-tabs">
            <TabContent activeTab={activeTab}>
              <TabPane tabId="#all">
                <Card>
                  <CardBody>
                    <ConfigurationTable {...tableProps} />
                  </CardBody>
                </Card>
              </TabPane>
            </TabContent>
          </div>
        </Col>
      )
    }
*/


  // export default enhance(ConfigurationTabs)

// export default(ConfigurationTable)

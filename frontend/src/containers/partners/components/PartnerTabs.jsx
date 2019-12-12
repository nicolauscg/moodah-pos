import React, { Fragment } from 'react'
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

const ValueFormat = ({ value, prefix, suffix }) => {
  return (
    <NumberFormat
      value={parseFloat(value.toFixed(3))}
      thousandSeparator="."
      decimalSeparator=","
      prefix={prefix}
      suffix={suffix}
      displayType="text"
    />
  )
}

const Table = ({
  data,
  offset,
  limit,
  location,
  handlePageChange,
  onClickRow,
  totalCustomer,
  totalSupplier,
  totalCustomerNonActive,
  totalSupplierNonActive,
}) => {
  const { hash } = location
  const { loading, resPartners } = data
  const {
    loading: customerActiveLoading,
    resPartners: customerActive,
  } = totalCustomer
  const {
    loading: supplierActiveLoading,
    resPartners: supplierActive,
  } = totalSupplier
  const {
    loading: customerNonLoading,
    resPartners: customerNon,
  } = totalCustomerNonActive
  const {
    loading: supplierNonLoading,
    resPartners: supplierNon,
  } = totalSupplierNonActive

  const tableColumnExtensions = PartnerColumns.map(col => ({
    columnName: col.name,
    wordWrapEnabled: true,
  }))

  const rows =
    loading || !resPartners ? [] : transformPartners(resPartners.partners)
  const totalCount = loading || !resPartners ? 0 : resPartners.totalCount

  const customerActiveTotal =
    customerActiveLoading || !customerActive ? 0 : customerActive.totalCount
  const supplierActiveTotal =
    supplierActiveLoading || !supplierActive ? 0 : supplierActive.totalCount
  const customerNonTotal =
    customerNonLoading || !customerNon ? 0 : customerNon.totalCount
  const supplierNonTotal =
    supplierNonLoading || !supplierNon ? 0 : supplierNon.totalCount

  const customerLoading =
    hash === '#inactive' ? customerNonLoading : customerActiveLoading
  const supplierLoading =
    hash === '#inactive' ? supplierNonLoading : supplierActiveLoading
  const customerTotal =
    hash === '#inactive' ? customerNonTotal : customerActiveTotal
  const supplierTotal =
    hash === '#inactive' ? supplierNonTotal : supplierActiveTotal

  return (
    <Fragment>
      <Col
        xs={hash === '#supplier' || hash === '#customer' ? 6 : 12}
        className="general__info"
      >
        <Row>
          {hash === '#supplier' ? null : (
            <Col
              xs={12}
              md={hash === '#supplier' || hash === '#customer' ? 12 : 6}
              className="info__block"
            >
              <p className="info__title">TOTAL CUSTOMER</p>
              <p className="info__value">
                {customerLoading ? (
                  <Skeleton />
                ) : (
                  <ValueFormat value={customerTotal} />
                )}
              </p>
            </Col>
          )}
          {hash === '#customer' ? null : (
            <Col
              xs={12}
              md={hash === '#supplier' || hash === '#customer' ? 12 : 6}
              className="info__block"
            >
              <p className="info__title">TOTAL SUPPLIER</p>
              <p className="info__value">
                {supplierLoading ? (
                  <Skeleton />
                ) : (
                  <ValueFormat value={supplierTotal} />
                )}
              </p>
            </Col>
          )}
        </Row>
      </Col>
      <DataTable
        rows={rows}
        columns={PartnerColumns}
        totalCount={totalCount}
        defaultSorting={[{ columnName: 'name', direction: 'asc' }]}
        offset={offset}
        limit={limit}
        handlePageChange={handlePageChange}
        tableColumnExtensions={tableColumnExtensions}
        clickableRow
        onClickRow={onClickRow}
        loading={loading}
      />
    </Fragment>
  )
}

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
}

const enhance = compose(
  withRouter,
  ResPartners.HOC({
    options: ({ filters, offset, limit }) => ({
      variables: {
        filters,
        limit,
        ...(offset > 0 ? { offset: offsetToCursor(offset) } : {}),
      },
      fetchPolicy: 'network-only',
    }),
  }),
  withStateHandlers(
    ({ location, setFilters, filters, setOffset }) => {
      const { hash } = location
      let activeTab = '#all'

      if (hash === '#inactive') {
        activeTab = hash

        setFilters({
          ...filters,
          name_contains: '',
          type: 'contact',
          active: false,
          OR: [{ supplier: true }, { customer: true }],
        })
      } else if (hash === '#customer') {
        activeTab = hash

        setFilters({
          ...filters,
          name_contains: '',
          type: 'contact',
          customer: true,
        })
      } else if (hash === '#supplier') {
        activeTab = hash

        setFilters({
          ...filters,
          name_contains: '',
          type: 'contact',
          supplier: true,
        })
      } else {
        setFilters({
          ...filters,
          name_contains: '',
          type: 'contact',
          OR: [{ supplier: true }, { customer: true }],
        })
      }

      setOffset(0)

      return {
        activeTab,
      }
    },
    {
      handlePageChange: (_, { setOffset }) => offset => setOffset(offset),
      toggle: (_, { activeTab, setFilters, filters, setOffset }) => e => {
        const {
          target: { hash },
        } = e
        switch (hash) {
          case '#customer':
            setFilters({
              ...filters,
              name_contains: '',
              type: 'contact',
              customer: true,
            })

            break
          case '#supplier':
            setFilters({
              ...filters,
              name_contains: '',
              type: 'contact',
              supplier: true,
            })

            break
          case '#all':
            setFilters({
              ...filters,
              name_contains: '',
              type: 'contact',
              OR: [{ supplier: true }, { customer: true }],
            })

            break
          default:
            setFilters({
              ...filters,
              name_contains: '',
              type: 'contact',
              OR: [{ supplier: true }, { customer: true }],
            })

            break
        }

        if (activeTab !== hash) {
          setOffset(0)
          return {
            activeTab: hash,
          }
        }
      },
    }
  )
)

export default enhance(PartnerTabs)

import React, { Fragment } from 'react'
import { compose, withState, withPropsOnChange, withHandlers } from 'recompose'

import { Col, Container, Row, Button } from 'reactstrap'

import { ResPartners } from '../../generated-models'
import offsetToCursor from '../../utils/offsetToCursor'

import Breadcrumb from '../../shared/components/Breadcrumb'

const ConfigurationIndex = (
) => {
  return (
    <Container className="configuration__list">
      <Row className="header">
        <Col md={4} className="header__item">
          <Breadcrumb crumbs={[{ text: 'Configuration' }]} />
        </Col>
        <Col
          md={8}
          className="header__item d-flex align-items-center justify-content-end"
        >

          <Button size="sm" color="help" tag="a" href="mailto:support@rubyh.co">
            Bantuan
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

const defaultFilters = {
    name_contains: '',
    type: 'configuration',
  }

/*const enhance = compose(
    withState('filters', 'setFilters', defaultFilters),
    withState('offset', 'setOffset', 0),
    withHandlers({
      handleSetValue: ({ filters, setFilters, setOffset }) => value => {
        setFilters({
          ...filters,
          name_contains: value,
        })
        setOffset(0)
      },
      refetchQueries: ({ filters, offset }) => () => [
        {
          query: ResPartners.Document,
          variables: {
            filters,
            ...(offset > 0 ? { offset: offsetToCursor(offset) } : {}),
          },
        },
      ],
    })
  )*/
  
  export default(ConfigurationIndex)

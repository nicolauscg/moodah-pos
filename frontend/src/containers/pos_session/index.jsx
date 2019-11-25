import React from 'react'
import { debounce } from 'lodash'
import { compose, withState, withPropsOnChange, withHandlers } from 'recompose'

import { Col, Container, Row, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import SearchIcon from 'mdi-react/SearchIcon'
import { withFormik, Form, Field } from 'formik'

import offsetToCursor from '../../utils/offsetToCursor'

import Breadcrumb from '../../shared/components/Breadcrumb'

const SearchInput = ({ field, form, handleSetValue, ...props }) => {
  const { onChange, ...restField } = field
  return (
    <input
      {...restField}
      {...props}
      onChange={e => {
        form.setFieldValue(field.name, e.target.value)

        if (handleSetValue) {
          handleSetValue(e.target.value)
        }
      }}
      type="text"
    />
  )
}

const SearchForm = ({ handleSetValue }) => {
  return (
    <Form className="search">
      <Field
        name="keyword"
        className="search-field"
        placeholder="Search for items to order ..."
        handleSetValue={handleSetValue}
        component={SearchInput}
      />
      <button className="search-btn" type="submit">
        <SearchIcon />
      </button>
    </Form>
  )
}

const FormikSearch = compose(
  withFormik({
    mapPropsToValues: ({ filters }) => ({
      keyword: filters.name_contains,
    }),
    handleSubmit: () => {},
    enableReinitialize: true,
  }),
  withPropsOnChange(['handleSetValue'], ({ handleSetValue }) => ({
    handleSetValue: debounce(handleSetValue, 1000),
  }))
)(SearchForm)

const Pos_SessionIndex = ({
  filters,
  setFilters,
  offset,
  setOffset,
  handleSetValue,
}) => {
  return (
    <Container className="configuration__list">
      <Row className="header">
        <Col md={4} className="header__item">
          <Breadcrumb crumbs={[{ text: 'Pos Session' }]} />
        </Col>
        <Col
          md={8}
          className="header__item d-flex align-items-center justify-content-end"
        >
           <FormikSearch
            filters={filters}
            setFilters={setFilters}
            setOffset={setOffset}
            handleSetValue={handleSetValue}
           />

          <Link
          to={`/configuration/create`}
          className="btn btn-primary btn-sm"
          >
          Buat Baru
          </Link>

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

export default (Pos_SessionIndex)

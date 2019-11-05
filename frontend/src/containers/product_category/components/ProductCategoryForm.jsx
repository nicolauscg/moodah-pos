import React, {Fragment} from 'react'
import {withRouter} from 'react-router-dom'
import {prop} from 'ramda'
import {connect} from 'react-redux'

import {Row, Col, Button} from 'reactstrap'
import {withFormik, Form, FastField, Field} from 'formik'
import {
    compose,
    withState,
    withHandlers,
    withStateHandlers,
    withPropsOnChange,
  } from 'recompose'

import Panel from '../../../shared/components/Panel'
import FormikInput from '../../../shared/components/formik/TextInput'
import FormCheckbox from '../../../shared/components/form-custom/FormCheckbox'
import FormikCheckbox from '../../../shared/components/formik/Checkbox'
import Select from '../../../shared/components/form-custom/DynamicSelect'

const FormContent = ({
  onInputFocus,
  handleSubmit,
}) => {
  return(
    <Form>
      <Row>
        <Panel
        xs ={12}
        title="Product Category"
        subhead="Buat baru kategori product"
        isForm
        >
          <div className="material-form">
            <Row>
              <Col xs={12} md={6}>
                <div className = "image-field">
                </div>
              </Col>
              <Col>
              <FastField
              label = "Product Category Name"
              name = "product_category_name"
              onFocus = {onInputFocus}
              // component={FormikInput}
              />
              <FastField
              label = "Parent Category"
              name = "parent_product_category"
              onFocus = {onInputFocus}
              // component={FormikInput}
              />
              <FastField
              label = "Sequence"
              name = "sequence"
              onFocus = {onInputFocus}
              // component={FormikInput}
              />
              </Col>
            </Row>
          </div>
        </Panel>
      </Row>
    </Form>
  )
}

const ProductCategoryForm = compose(
  withRouter,
)(FormContent)

export default ProductCategoryForm


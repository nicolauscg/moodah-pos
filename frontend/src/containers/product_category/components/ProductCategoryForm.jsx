import React from 'react'
import {withRouter} from 'react-router-dom'

import { Row, Col } from 'reactstrap'
import { withFormik, Form, FastField } from 'formik'
import { compose } from 'recompose'

import { PosCategories } from '../../../generated-pos-models'
import Panel from '../../../shared/components/Panel'
import FormikInput from '../../../shared/components/formik/TextInput'
import Select from '../../../shared/components/form-custom/DynamicSelect'

const FormContent = ({
  onInputFocus,
  handleSubmit,
  parents,
  productcategory
}) => {

  return(
    <Form
      onSubmit={e => {
        e.stopPropagation()
        handleSubmit(e)
      }}
    >
      <Row>
        <Panel
          xs ={12}
          title="Product Category"
          isForm
        >
          <div className="material-form">
            <Row>
              <Col xs={12} md={3}>
                <div className="dropzone-image-field">
                  { productcategory.image && (
                    <img 
                      src={`data:image/png;base64,${productcategory.image}`}
                      className=".image-field"
                      alt="category-pic"
                    />
                  )}
                </div>
              </Col>
              <Col xs={12} md={5}>
                <FastField
                  required
                  label = "Product Category Name"
                  name="name"
                  onFocus = {onInputFocus}
                  component={FormikInput}
                />
                <Select
                  dataState={!parents.loading ? 
                    parents.posCategories.records.map(({id, displayName})=>(
                      {label: displayName, value: id}
                    )) : 
                    []
                  }
                  field="parent"
                  label="Parent Category"
                  onFocus={onInputFocus}
                  queryKey={[]}
                  hasMoreKey={[]}
                />
                <FastField
                  label = "Sequence"
                  name="sequence"
                  onFocus = {onInputFocus}
                  component={FormikInput}
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
  PosCategories.HOC({
    name: "parents",
    options: () => ({
      context: {
        clientName: "pos"
      },
      variables: {
        filters: {},
        offset: 0,
        limit: 20
      }
    })
  }),
  withFormik({
    mapPropsToValues: props => {
      const { productcategory } = props;
      if (productcategory) {
        return {
          ...productcategory,
          parent: productcategory.parent ?
            ({
              ...productcategory.parent,
              label: productcategory.parent.displayName,
              value: productcategory.parent.id
            }) :
            null
        };
      }

      return {
        name: '',
        parent: null,
        sequence: '',
      }
    },
  })
)(FormContent)

export default ProductCategoryForm


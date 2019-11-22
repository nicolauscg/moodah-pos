import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'

import { DropzoneGQL } from '../../../shared/components/Dropzone.jsx'
import { Row, Col, Button } from 'reactstrap'
import { withFormik, Form, FastField } from 'formik'
import { compose, withState, withHandlers } from 'recompose'

import Panel from '../../../shared/components/Panel'
import FormikInput from '../../../shared/components/formik/TextInput'
import FormInput from '../../../shared/components/form-custom/FormInput'
import Select from '../../../shared/components/form-custom/DynamicSelect'
import Modal from '../../../shared/components/form-custom/Modal'
import FormCheckbox from '../../../shared/components/form-custom/FormCheckbox'

const RemoveImageModal = ({ toggle, isOpen, confirm }) => {
  return (
    <Modal
      type='dialog'
      title='Remove Product Image'
      body='Are you sure you want to remove this image?'
      action={
        <Fragment>
          <Button color='primary' size='sm' onClick={confirm}>
            Yes
          </Button>
          <Button color='danger' size='sm' onClick={toggle}>
            No
          </Button>
        </Fragment>
      }
      toggle={toggle}
      isOpen={isOpen}
      centered
    />
  )
}

const ImageField = ({
  imageField,
  setImageField,
  isInUpdateImage,
  toggleRemoveImage,
  setIsInUpdateImage
}) => {
  if (!isInUpdateImage && imageField) {
    return (
      <Fragment>
          <img
            src={`data:image/png;base64,${imageField}`}
            className='.image-field'
            alt='category-pic'
          />
          <Button color='warning' size='sm' onClick={() => setIsInUpdateImage(true)}>
            Change
          </Button>
          <Button color='danger' size='sm' onClick={toggleRemoveImage}>
            Remove
          </Button>
      </Fragment>
    )
  } else {
    return (
      <Fragment>
        <DropzoneGQL
          loading={false}
          uploader={(encodedImage) => {
            setImageField(encodedImage);
            setIsInUpdateImage(false);
          }}
        />
        {isInUpdateImage && (
          <Button color='danger' size='sm' onClick={() => setIsInUpdateImage(false)}>
            Cancel
          </Button>
        )}
      </Fragment>
    )
  }
}

const FormContent = ({
  onInputFocus,
  handleSubmit,
  toggleRemoveImage,
  removeImageModalIsOpen,
  removeImageConfirm,
  copySold,
  setGeneralAsSold,
  copyPurchased,
  setGeneralAsPurchased,
  copyExpensed,
  setGeneralAsExpensed,
  ...props
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
          title='Product'
          isForm
        >
          <div className='material-form'>
            <Row>
              <Col xs={12} md={3}>
                <ImageField toggleRemoveImage={toggleRemoveImage} {...props} />
              </Col>

              <Col xs={12} md={5}>
                <FastField
                  required
                  label = 'Product Name'
                  name = 'name'
                  onFocus = {onInputFocus}
                  component = {FormikInput}
                  variant = 'outlined'
                />
                <FormCheckbox
                  className="material-form"
                  FormLabelProps={{
                    label: 'Can be sold',
                  }}
                  name="copySold"
                  CheckboxProps={{
                    checked: copySold,
                    onChange: setGeneralAsSold,
                  }}
                />
                <div>
                  <FormCheckbox
                    className="material-form"
                    FormLabelProps={{
                      label: 'Can be purchased',
                    }}
                    name="copyPurchased"
                    CheckboxProps={{
                      checked: copyPurchased,
                      onChange: setGeneralAsPurchased,
                    }}
                    />
                </div>
                <FormCheckbox
                  className="material-form"
                  FormLabelProps={{
                    label: 'Can be Expensed',
                  }}
                  name="copyExpensed"
                  CheckboxProps={{
                    checked: copyExpensed,
                    onChange: setGeneralAsExpensed,
                  }}
                />
              </Col>
            </Row>
          </div>

          <br />

          <Row>
            <Col md={4}>
              <div>
                <FastField
                  label = 'Product Name'
                  name = 'name'
                  onFocus = {onInputFocus}
                  component = {FormikInput}
                  variant = 'outlined'
                 />
              </div>

              <br />

              <div>
                <FastField
                  label = 'Barcode'
                  name = 'name'
                  onFocus = {onInputFocus}
                  component = {FormikInput}
                  variant = 'outlined'
                />
              </div>

              <br />

            <div>
              <FastField
                label = 'Cost'
                name = 'name'
                onFocus = {onInputFocus}
                component = {FormikInput}
                variant = 'outlined'
              />
            </div>

              <br />

            <div>
              <FastField
                label = 'Purchase Unit of Measure'
                name = 'name'
                onFocus = {onInputFocus}
                component = {FormikInput}
                variant = 'outlined'
              />
            </div>

              <br />

            </Col>

            <Col md={4}>
              <div>
                <FastField
                  label = 'Category'
                  name = 'name'
                  onFocus = {onInputFocus}
                  component = {FormikInput}
                  variant = 'outlined'
                />
              </div>

              <br />

              <div>
                <FastField
                  label = 'HS Code'
                  name = 'name'
                  onFocus = {onInputFocus}
                  component = {FormikInput}
                  variant = 'outlined'
                />
              </div>

              <br />

              <div>
                <FastField
                  label = 'Company'
                  name = 'name'
                  onFocus = {onInputFocus}
                  component = {FormikInput}
                  variant = 'outlined'
                />
              </div>

              <br />

            </Col>

            <Col md={4}>
              <div>
                <FastField
                  label = 'Internal Reference'
                  name = 'name'
                  onFocus = {onInputFocus}
                  component = {FormikInput}
                  variant = 'outlined'
                />
              </div>

              <br />

              <div>
                <FastField
                  label = 'Sales Price'
                  name = 'name'
                  onFocus = {onInputFocus}
                  component = {FormikInput}
                  variant = 'outlined'
                />
              </div>

              <br />

             <div>
               <FastField
                 label = 'Unit of Measure'
                 name = 'name'
                 onFocus = {onInputFocus}
                 component = {FormikInput}
                 variant = 'outlined'
               />
             </div>

             <br />

             <div>
               <FastField
                 label = 'Purchase Unit of Measure'
                 name = 'name'
                 onFocus = {onInputFocus}
                 component = {FormikInput}
                 variant = 'outlined'
               />
             </div>

             <br />
            </Col>
          </Row>
        </Panel>
      </Row>
      <Button color='primary' size='sm' type='submit'>
        Save
      </Button>
      <RemoveImageModal
        toggle={toggleRemoveImage}
        isOpen={removeImageModalIsOpen}
        confirm={removeImageConfirm}
      />
    </Form>
  )
}

const ProductForm = compose(
  withRouter,
  withFormik({
      mapsPropsToValue: props => {
        return{
          name:'',
        }
      },
    })

)(FormContent)

export default ProductForm


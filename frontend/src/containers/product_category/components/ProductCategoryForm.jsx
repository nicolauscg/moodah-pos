import React, { Fragment } from 'react'
import {withRouter} from 'react-router-dom'

import { DropzoneGQL } from '../../../shared/components/Dropzone.jsx'
import { Row, Col, Button } from 'reactstrap'
import { withFormik, Form, FastField } from 'formik'
import { compose, withState, withHandlers, withPropsOnChange } from 'recompose'
import { prop } from 'ramda'

import { PosCategories } from '../../../generated-pos-models'
import Panel from '../../../shared/components/Panel'
import FormikInput from '../../../shared/components/formik/TextInput'
import Select from '../../../shared/components/form-custom/DynamicSelect'
import Modal from '../../../shared/components/form-custom/Modal'
import { prepareParents } from '../../../utils/transformers/productcategory'

const RemoveImageModal = ({ toggle, isOpen, confirm }) => {
  return (
    <Modal
      type='dialog'
      title='Remove Product Category Image'
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
  parents,
  productcategory,
  toggleRemoveImage,
  removeImageModalIsOpen,
  removeImageConfirm,
  refetchParents,
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
          title='Product Category'
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
                  label = 'Product Category Name'
                  name='name'
                  onFocus = {onInputFocus}
                  component={FormikInput}
                />
                <Select
                  dataState={parents}
                  field='parent'
                  label='Parent Category'
                  refetch={refetchParents}
                  onFocus={onInputFocus}
                  queryKey={['posCategories', 'records']}
                />
                <FastField
                  label = 'Sequence'
                  name='sequence'
                  onFocus = {onInputFocus}
                  component={FormikInput}
                />
              </Col>
            </Row>
          </div>
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

const ProductCategoryForm = compose(
  withRouter,
  withState('isInUpdateImage', 'setIsInUpdateImage', false),
  withState(
    'imageField',
    'setImageField',
    ({ productcategory }) => productcategory !== undefined && !productcategory.loading ? 
      productcategory.posCategory.image :
      null
  ),
  withState('removeImageModalIsOpen', 'setRemoveImageModalIsOpen', false),
  withState('parentFilters', 'setParentFilters', {}),
  withHandlers({
    toggleUpdatingImageState: ({ isInUpdateImage, setIsInUpdateImage }) => 
      () => setIsInUpdateImage(!isInUpdateImage),
    toggleRemoveImage: ({ removeImageModalIsOpen, setRemoveImageModalIsOpen }) =>
      () => setRemoveImageModalIsOpen(!removeImageModalIsOpen)
  }),
  withHandlers({
    removeImageConfirm: ({ setImageField, toggleRemoveImage }) => () => {
      setImageField(null);
      toggleRemoveImage();
    },
    refetchParents: ({ setParentFilters }) => input => {
      setParentFilters({
        OR: [{ 'name': input }]
      })
    },
  }),
  PosCategories.HOC({
    name: 'parents',
    options: ({
      parentFilters
    }) => ({
      context: {
        clientName: 'pos'
      },
      variables: {
        filters: parentFilters,
        offset: 0,
        limit: 10
      }
    })
  }),
  withPropsOnChange(['parents'], ({ parents: oldParents }) => {
    let parents = oldParents;

    if (!parents.loading) {
      parents = {
        ...parents,
        ...prepareParents(prop('posCategories', parents)),
      }
    }

    return { parents }
  }),
  withFormik({
    mapPropsToValues: props => {
      const { productcategory } = props;
      const posCategory = productcategory !== undefined && !productcategory.loading ? 
        productcategory.posCategory : null

      if (posCategory) {
        return {
          ...posCategory,
          parent: posCategory.parent ?
            ({
              ...posCategory.parent,
              label: posCategory.parent.displayName,
              value: posCategory.parent.id
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
    handleSubmit: (values, { props }) => {
      if (values.name) {
        props.handleSubmit({
          context: {
            clientName: 'pos'
          },
          variables: {
            input: {
              id: values.id,
              name: values.name,
              image: props.imageField,
              parentId: values.parent ? values.parent.value : null,
              sequence: parseInt(values.sequence)
            }
          }
        })
      } else {
        props.triggerNotif({
          message: 'Product Category Name is required!',
          type: 'warning',
        })
      }
    },
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
  })
)(FormContent)

export default ProductCategoryForm


import React, { Fragment } from 'react'
import { debounce } from 'lodash'
import { compose, withState, withPropsOnChange, withHandlers } from 'recompose'
import { withRouter } from 'react-router-dom'

import { Col, Container, Row, Button, Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, } from 'reactstrap'
import { Link } from 'react-router-dom'
import SearchIcon from 'mdi-react/SearchIcon'
import { withFormik, Form, Field } from 'formik'

import { PosCategories } from '../../generated-pos-models'
import ChartDatePicker from '../../shared/components/ChartDatePicker'
import offsetToCursor from '../../utils/offsetToCursor'
import Breadcrumb from '../../shared/components/Breadcrumb'

import DropzoneGQL from '../../shared/components/Dropzone'
import Modal from '../../shared/components/form-custom/Modal'
import AddButton from '../../shared/components/form-custom/AddButton'
import MinusButton from '../../shared/components/form-custom/MinusButton'
import RightArrowButton from '../../shared/components/form-custom/RightArrowButton'
import NakedInput from '../../shared/components/form-custom/NakedInput'

const RemoveImageModal = ({ toggle, isOpen, confirm }) => {
  return (
    <Modal
      type='dialog'
      title='Remove Profile Picture Image'
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

const Pos_SessionIndex = ({
  filters,
  setFilters,
  offset,
  setOffset,
  handleSetValue,
  productcategory,
  toggleRemoveImage,
  removeImageModalIsOpen,
  removeImageConfirm,
  refetchParents,
  ...props
}) => {
  return (
    <Container className="configuration__list">
       <Row className="header">
        <Col md={4} className="header__item">
        </Col>
         <Col
           md={8}
           className="header_item d-flex align-items-center justify-content-end"
         >
           <ChartDatePicker />
         </Col>
       </Row>

       <hr />

        <Row className="header">
          <Col md={9}>
           <Card>
             <div className="example1">
                <Col md={8} className="header__item">
                  <Breadcrumb crumbs={[{ text: 'POS Session' }]} />
                </Col>
                <Col >
                  <ImageField toggleRemoveImage={toggleRemoveImage} {...props} />
                </Col>
                <Col>
                  <NakedInput />
                </Col>
                <Col>
                  <NakedInput />
                </Col>
                <Col>
                  <Button color='primary' size='sm' type='submit'>
                    Close Session
                  </Button>
                </Col>
                <Col>
                  <Breadcrumb crumbs={[{ text: '2019 All Rights Reserved' }]} />
                </Col>
             </div>
           </Card>
          </Col>

          <Col md={3}>
           <Col>
            <div className="example2 form-inline">
             <Button className="btn btn-primary" size='lg'>
               Orders#4509
             </Button>

             <AddButton  />
             &nbsp;&nbsp;
             <MinusButton  />

            </div>
           </Col>

           <br />

           <Col>
            <div className="example3 form-inline">
             <Col>
              <Breadcrumb crumbs={[{ text: 'Customer' }]} />
              <div className="form-inline">
                <NakedInput />
                <RightArrowButton  />
              </div>
             </Col>
            </div>
           </Col>

           <br />

           <Col>
             <div className="example4">
             </div>
           </Col>

           <br />

           <Col>
             <div className="example2 form-inline">
               <Breadcrumb crumbs={[{ text: 'Discount' }]} />
               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<RightArrowButton  />
             </div>
           </Col>

           <br />

           <Col>
            <div>
             <Button color="primary" size="lg" block>Payment</Button>
            </div>
           </Col>
          </Col>
        </Row>

      <RemoveImageModal
              toggle={toggleRemoveImage}
              isOpen={removeImageModalIsOpen}
              confirm={removeImageConfirm}
      />
    </Container>
  )
}

const Pos_SessionIndex2 = compose(
    withRouter,
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
)(Pos_SessionIndex)

export default (Pos_SessionIndex2)

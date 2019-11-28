import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";

import { DropzoneGQL } from "../../../shared/components/Dropzone.jsx";
import { Row, Col, Button } from "reactstrap";
import { withFormik, Form, FastField } from "formik";
import { compose, withState, withHandlers, withPropsOnChange } from "recompose";
import { prop, propOr } from "ramda";

import { PosCategories } from "../../../generated-pos-models";
import Panel from "../../../shared/components/Panel";
import FormikInput from "../../../shared/components/formik/TextInput";
import Select from "../../../shared/components/form-custom/DynamicSelect";
import Modal from "../../../shared/components/form-custom/Modal";
import { prepareParents } from "../../../utils/transformers/category";

const RemoveImageModal = ({ toggle, isOpen, confirm }) => {
  return (
    <Modal
      type="dialog"
      title="Remove Category Image"
      body="Are you sure you want to remove this image?"
      action={
        <Fragment>
          <Button color="primary" size="sm" onClick={confirm}>
            Yes
          </Button>
          <Button color="danger" size="sm" onClick={toggle}>
            No
          </Button>
        </Fragment>
      }
      toggle={toggle}
      isOpen={isOpen}
      centered
    />
  );
};

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
          className="image-field mb-2"
          alt="category-pic"
        />
        <div className="d-flex justify-content-center">
          <Button
            color="warning"
            size="sm"
            onClick={() => setIsInUpdateImage(true)}
          >
            Change
          </Button>
          <Button color="danger" size="sm" onClick={toggleRemoveImage}>
            Remove
          </Button>
        </div>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <div className="mb-2">
          <DropzoneGQL
            loading={false}
            uploader={encodedImage => {
              setImageField(encodedImage);
              setIsInUpdateImage(false);
            }}
          />
        </div>
        {isInUpdateImage && (
          <div className="d-flex justify-content-center">
            <Button
              color="danger"
              size="sm"
              onClick={() => setIsInUpdateImage(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </Fragment>
    );
  }
};

const FormContent = ({
  onInputFocus,
  handleSubmit,
  parents,
  posCategory,
  toggleRemoveImage,
  removeImageModalIsOpen,
  removeImageConfirm,
  refetchParents,
  ...props
}) => {
  return (
    <Form
      onSubmit={e => {
        e.stopPropagation();
        handleSubmit(e);
      }}
    >
      <Row>
        <Panel xs={12} title="Category" isForm>
          <div className="material-form">
            <Row>
              <Col sm={12} md={4}>
                <ImageField toggleRemoveImage={toggleRemoveImage} {...props} />
              </Col>
              <Col sm={12} md={5}>
                <FastField
                  required
                  label="Category Name"
                  name="name"
                  onFocus={onInputFocus}
                  component={FormikInput}
                />
                <Select
                  dataState={parents}
                  field="parent"
                  label="Parent Category"
                  refetch={refetchParents}
                  onFocus={onInputFocus}
                  queryKey={["posCategories", "records"]}
                />
                <FastField
                  label="Sequence"
                  name="sequence"
                  onFocus={onInputFocus}
                  component={FormikInput}
                />
              </Col>
            </Row>
          </div>
        </Panel>
      </Row>
      <Button color="primary" size="sm" type="submit">
        Save
      </Button>
      <RemoveImageModal
        toggle={toggleRemoveImage}
        isOpen={removeImageModalIsOpen}
        confirm={removeImageConfirm}
      />
    </Form>
  );
};

const CategoryForm = compose(
  withRouter,
  withState("isInUpdateImage", "setIsInUpdateImage", false),
  withState("imageField", "setImageField", ({ posCategory }) =>
    propOr(null, "image", posCategory)
  ),
  withState("removeImageModalIsOpen", "setRemoveImageModalIsOpen", false),
  withState("parentFilters", "setParentFilters", {}),
  withHandlers({
    toggleUpdatingImageState: ({ isInUpdateImage, setIsInUpdateImage }) => () =>
      setIsInUpdateImage(!isInUpdateImage),
    toggleRemoveImage: ({
      removeImageModalIsOpen,
      setRemoveImageModalIsOpen
    }) => () => setRemoveImageModalIsOpen(!removeImageModalIsOpen)
  }),
  withHandlers({
    removeImageConfirm: ({ setImageField, toggleRemoveImage }) => () => {
      setImageField(null);
      toggleRemoveImage();
    },
    refetchParents: ({ setParentFilters }) => input => {
      setParentFilters({
        OR: [{ name: input }]
      });
    }
  }),
  PosCategories.HOC({
    name: "parents",
    options: ({ parentFilters }) => ({
      context: {
        clientName: "pos"
      },
      variables: {
        filters: parentFilters,
        offset: 0,
        limit: 10
      }
    })
  }),
  withPropsOnChange(["parents"], ({ parents: oldParents }) => {
    let parents = oldParents;

    if (!parents.loading) {
      parents = {
        ...parents,
        ...prepareParents(prop("posCategories", parents))
      };
    }

    return { parents };
  }),
  withFormik({
    mapPropsToValues: props => {
      const { posCategory } = props;
      if (posCategory) {
        return posCategory;
      }

      return {
        name: "",
        parent: null,
        sequence: "0"
      };
    },
    handleSubmit: (values, { props }) => {
      if (values.name) {
        props.handleSubmit({
          context: {
            clientName: "pos"
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
        });
      } else {
        props.triggerNotif({
          message: "Category Name is required!",
          type: "warning"
        });
      }
    },
    validate: values => {
      let errors = {};
      if (!values.name) {
        errors.name = "Name is required";
      }
      if (!isNonNegativeInteger(values.sequence)) {
        errors.sequence = "Sequence should be a non negative integer";
      }

      return errors;
    },
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true
  })
)(FormContent);

export default CategoryForm;

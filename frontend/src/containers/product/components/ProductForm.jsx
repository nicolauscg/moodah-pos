import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";

import { prop, propOr } from "ramda";
import { Row, Col, Button } from "reactstrap";
import { withFormik, Form, FastField } from "formik";
import { compose, withState, withHandlers, withPropsOnChange } from "recompose";

import { DropzoneGQL } from "../../../shared/components/Dropzone.jsx";
import {
  prepareCategories,
  transformPosProductForm
} from "../../../utils/transformers/product";
import { CategoriesSelect } from "../../../generated-pos-models";
import Panel from "../../../shared/components/Panel";
import FormikInput from "../../../shared/components/formik/TextInput";
import FormikCheckbox from "../../../shared/components/formik/Checkbox";
import Select from "../../../shared/components/form-custom/DynamicSelect";
import Modal from "../../../shared/components/form-custom/Modal";

const RemoveImageModal = ({ toggle, isOpen, confirm }) => {
  return (
    <Modal
      type="dialog"
      title="Remove Product Image"
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
  toggleRemoveImage,
  removeImageModalIsOpen,
  removeImageConfirm,
  productTypes,
  refetchProductTypes,
  categories,
  refetchCategories,
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
        <Panel xs={12} title="Product" isForm>
          <div className="material-form">
            <Row className="mb-2">
              <Col sm={12} md={4}>
                <ImageField toggleRemoveImage={toggleRemoveImage} {...props} />
              </Col>
              <Col sm={12} md={5}>
                <FastField
                  required
                  label="Product Name"
                  name="name"
                  onFocus={onInputFocus}
                  component={FormikInput}
                  variant="outlined"
                />
                <div>
                  <FastField
                    name="canBeSold"
                    FormLabelProps={{
                      label: "Can be sold"
                    }}
                    component={FormikCheckbox}
                  />
                </div>
                <div>
                  <FastField
                    name="canBePurchased"
                    FormLabelProps={{
                      label: "Can be purchased"
                    }}
                    component={FormikCheckbox}
                  />
                </div>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col sm={12} md={4}>
                <Select
                  dataState={productTypes}
                  field="productType"
                  label="Product Type"
                  refetch={refetchProductTypes}
                  onFocus={onInputFocus}
                  queryKey={[]}
                />
              </Col>
              <Col sm={12} md={4}>
                <Select
                  dataState={categories}
                  field="category"
                  label="Category"
                  refetch={refetchCategories}
                  onFocus={onInputFocus}
                  queryKey={["categories", "records"]}
                />
              </Col>
              <Col sm={12} md={4}>
                <FastField
                  label="Internal Reference"
                  name="internalReference"
                  onFocus={onInputFocus}
                  component={FormikInput}
                  variant="outlined"
                />
              </Col>
            </Row>
            <Row className="mb-2">
              <Col sm={12} md={4}>
                <FastField
                  label="Barcode"
                  name="barcode"
                  onFocus={onInputFocus}
                  component={FormikInput}
                  variant="outlined"
                />
              </Col>
              <Col sm={12} md={4}>
                <FastField
                  label="HS Code"
                  name="HSCode"
                  onFocus={onInputFocus}
                  component={FormikInput}
                  variant="outlined"
                />
              </Col>
              <Col sm={12} md={4}>
                <FastField
                  label="Sales Price"
                  name="salesPrice"
                  onFocus={onInputFocus}
                  component={FormikInput}
                  variant="outlined"
                />
              </Col>
            </Row>
            <Row className="mb-2">
              <Col sm={12} md={4}>
                <FastField
                  label="Cost"
                  name="cost"
                  onFocus={onInputFocus}
                  component={FormikInput}
                  variant="outlined"
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

const initialProductTypes = [
  { label: "consumable", value: "consu" },
  { label: "service", value: "service" },
  { label: "stockable product", value: "product" }
];

const ProductForm = compose(
  withRouter,
  withState("isInUpdateImage", "setIsInUpdateImage", false),
  withState("imageField", "setImageField", ({ posProduct }) =>
    propOr(null, "image", posProduct)
  ),
  withState("removeImageModalIsOpen", "setRemoveImageModalIsOpen", false),
  withState("productTypes", "setProductTypes", initialProductTypes),
  withState("categoryFilters", "setCategoryFilters", {}),
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
    refetchProductTypes: ({ setProductTypes, productTypes }) => input => {
      setProductTypes(
        productTypes.filter(
          type => type.label.indexOf(input.toLowerCase()) !== -1
        )
      );
    },
    refetchCategories: ({ setCategoryFilters }) => input => {
      setCategoryFilters({
        OR: [{ name: input }]
      });
    }
  }),
  CategoriesSelect.HOC({
    name: "categories",
    options: ({ categoryFilters }) => ({
      context: {
        clientName: "pos"
      },
      variables: {
        filters: categoryFilters,
        limit: 10
      }
    })
  }),
  withPropsOnChange(["categories"], ({ categories: oldCategories }) => {
    let categories = oldCategories;

    if (!categories.loading) {
      categories = {
        ...categories,
        ...prepareCategories(prop("categories", categories))
      };
    }

    return { categories };
  }),
  withFormik({
    mapPropsToValues: props => {
      const { posProduct } = props;
      if (posProduct) {
        return posProduct;
      }

      return {
        name: "",
        canBeSold: false,
        canBePurchased: false,
        productType: null,
        category: null,
        internalReference: "",
        barcode: "",
        HSCode: "",
        salesPrice: 1.0,
        cost: 0.0
      };
    },
    handleSubmit: (values, { props }) => {
      props.handleSubmit({
        context: {
          clientName: "pos"
        },
        variables: {
          input: transformPosProductForm(values, props.imageField)
        }
      });
    },
    validate: values => {
      let erros = {};
      if (!values.name) {
        errors.name = "Name is required";
      }
      if (isPositiveFloat(values.salesPrice)) {
        errors.salesPrice = "Sale Price should be positive number";
      }
      if (isPositiveFloat(values.cost)) {
        errors.salesPrice = "Cost should be positive number";
      }

      return errors;
    }
  })
)(FormContent);

export default ProductForm;

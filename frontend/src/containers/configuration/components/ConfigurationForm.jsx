import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { prop, includes } from "ramda";

import { Row, Col, Button } from "reactstrap";
import { withFormik, Form, FastField } from "formik";
import { compose, withState, withHandlers, withPropsOnChange } from "recompose";

import {
  prepareAvailablePricelists,
  prepareDiscountProducts,
  preparePaymentMethods,
  prepareStockLocations,
  transformPosConfigForm
} from "../../../utils/transformers/configuration";
import {
  DiscountProductsSelect,
  StockLocationsSelect,
  PaymentMethodsSelect,
  AvailablePriceListsSelect
} from "../../../generated-pos-models";

import Panel from "../../../shared/components/Panel";
import FormikInput from "../../../shared/components/formik/TextInput";
import FormCheckbox from "../../../shared/components/form-custom/FormCheckbox";
import FormikCheckbox from "../../../shared/components/formik/Checkbox";
import Select from "../../../shared/components/form-custom/DynamicSelect";
import RadioSelect from "../../../shared/components/form-custom/RadioSelect";

const FormContent = ({
  onInputFocus,
  handleSubmit,
  values,
  setFieldValue,
  discountProducts,
  refetchProducts,
  availablePricelists,
  refetchAvailablePricelists,
  stockLocations,
  refetchStockLocations,
  paymentMethods,
  refetchPaymentMethods
}) => (
  <Form
    onSubmit={event => {
      event.stopPropagation();
      handleSubmit(event);
    }}
  >
    <Row>
      <Panel xs={12} title="Product Category" isForm>
        <div className="material-form">
          <Row>
            <Col xs={6}>
              <FastField
                required
                label="Point of Sale Name"
                name="name"
                onFocus={onInputFocus}
                component={FormikInput}
                variant="outlined"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <FormCheckbox
                FormLabelProps={{
                  label: (
                    <div className="text-muted">
                      Category Products
                      <br />
                      Display pictures of product categories
                    </div>
                  )
                }}
                CheckboxProps={{
                  disabled: true,
                  checked: true
                }}
              />
            </Col>
            <Col xs={4}>
              <RadioSelect
                name="ifaceTaxIncluded"
                label={
                  <div>
                    Product Price
                    <br />
                    Product prices on receipts
                  </div>
                }
                options={[
                  {
                    label: "Tax Included",
                    value: "subtotal"
                  },
                  {
                    label: "Tax Excluded",
                    value: "total"
                  }
                ]}
              />
            </Col>
            <Col md={4}>
              <FastField
                name="globalDiscount"
                FormLabelProps={{
                  label: (
                    <div>
                      Global Discount
                      <br />
                      Allow global discounts on orders
                    </div>
                  )
                }}
                component={FormikCheckbox}
              />
              {values.globalDiscount && (
                <Fragment>
                  <Select
                    dataState={discountProducts}
                    field="discountProduct"
                    label="Discount Product"
                    refetch={refetchProducts}
                    onFocus={onInputFocus}
                    queryKey={["discountProducts", "records"]}
                  />
                  <FastField
                    label="Discount"
                    name="discountPc"
                    onFocus={onInputFocus}
                    component={FormikInput}
                  />
                </Fragment>
              )}
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <FastField
                name="usePricelist"
                FormLabelProps={{
                  label: (
                    <div>
                      Pricelist
                      <br />
                      Set shop-specific prices, seasonal discounts, etc.
                    </div>
                  )
                }}
                component={FormikCheckbox}
              />
              {values.usePricelist && (
                <Fragment>
                  <Select
                    dataState={availablePricelists}
                    refetch={refetchAvailablePricelists}
                    field="availablePricelist"
                    label="Available Pricelists"
                    onFocus={onInputFocus}
                    queryKey={["availablePriceLists", "records"]}
                    multiple={true}
                    handleSetValue={(_0, selectedAvailablePricelistIds) => {
                      setFieldValue(
                        "availablePricelist",
                        selectedAvailablePricelistIds
                      );
                      if (
                        !includes(
                          values.pricelist,
                          selectedAvailablePricelistIds
                        )
                      ) {
                        setFieldValue("pricelist", null);
                      }
                    }}
                  />
                  <Select
                    dataState={values.availablePricelist}
                    field="pricelist"
                    label="Default Pricelist"
                    onFocus={onInputFocus}
                    queryKey={[]}
                  />
                </Fragment>
              )}
            </Col>
            <Col xs={4}>
              <FastField
                FormLabelProps={{
                  label: (
                    <div>
                      Price Control
                      <br />
                      Restrict price modification to managers
                    </div>
                  )
                }}
                name="restrictPriceControl"
                component={FormikCheckbox}
              />
            </Col>
            <Col xs={4}>
              <Select
                dataState={paymentMethods}
                refetch={refetchPaymentMethods}
                field="paymentMethods"
                label="Payment Methods"
                onFocus={onInputFocus}
                queryKey={["paymentMethods", "records"]}
                multiple={true}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <FormCheckbox
                FormLabelProps={{
                  label: (
                    <div className="text-muted">
                      Prefill Cash Payment
                      <br />
                      Prefill amount paid with exact due amount
                    </div>
                  )
                }}
                CheckboxProps={{
                  disabled: true,
                  checked: true
                }}
              />
            </Col>
            <Col xs={4}>
              <FastField
                name="isHeaderOrFooter"
                FormLabelProps={{
                  label: (
                    <div>
                      Header and Footer
                      <br />
                      Add a custom message to header and footer
                    </div>
                  )
                }}
                component={FormikCheckbox}
              />
              {values.isHeaderOrFooter && (
                <Fragment>
                  <FastField
                    label="Header"
                    name="receiptHeader"
                    onFocus={onInputFocus}
                    component={FormikInput}
                    variant="outlined"
                  />
                  <FastField
                    label="Footer"
                    name="receiptFooter"
                    onFocus={onInputFocus}
                    component={FormikInput}
                    variant="outlined"
                  />
                </Fragment>
              )}
            </Col>

            <Col xs={4}>
              <FormCheckbox
                FormLabelProps={{
                  label: (
                    <div className="text-muted">
                      Automatic Receipt Printing
                      <br />
                      Print receipts automatically once the payment registered
                    </div>
                  )
                }}
                CheckboxProps={{
                  disabled: true,
                  checked: true
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <FormCheckbox
                FormLabelProps={{
                  label: (
                    <div className="text-muted">
                      Operation Type
                      <br />
                      Prefill amount paid with exact due amount
                    </div>
                  )
                }}
                CheckboxProps={{
                  disabled: true,
                  checked: true
                }}
              />
            </Col>
            <Col xs={4}>
              <Select
                dataState={stockLocations}
                refetch={refetchStockLocations}
                field="stockLocation"
                label="Stock Locations"
                onFocus={onInputFocus}
                queryKey={["stockLocations", "records"]}
              />
            </Col>
          </Row>
        </div>
      </Panel>
    </Row>
    <Button color="primary" size="sm" type="submit">
      Save
    </Button>
  </Form>
);

const ConfigurationForm = compose(
  withRouter,
  withState("discountProductFilters", "setDiscountProductFilters", {}),
  withState("availablePricelistsFilters", "setAvailablePricelistsFilters", {}),
  withState("stockLocationFilters", "setStockLocationFilters", {}),
  withState("paymentMethodFilters", "setPaymentMethodFilters", {}),
  withState("globalDiscount", "setGlobalDiscount", false),
  withHandlers({
    refetchDiscountProducts: ({ setDiscountProductFilters }) => input => {
      setDiscountProductFilters({
        OR: [{ name: input }]
      });
    },
    refetchAvailablePricelists: ({
      setAvailablePricelistsFilters
    }) => input => {
      setAvailablePricelistsFilters({
        OR: [{ name: input }]
      });
    },
    refetchStockLocations: ({ setStockLocationFilters }) => input => {
      setStockLocationFilters({
        OR: [{ name: input }]
      });
    },
    refetchPaymentMethods: ({ setPaymentMethodFilters }) => input => {
      setPaymentMethodFilters({
        OR: [{ name: input }]
      });
    }
  }),
  DiscountProductsSelect.HOC({
    name: "discountProducts",
    options: ({ discountProductFilters }) => ({
      context: {
        clientName: "pos"
      },
      variables: {
        filters: discountProductFilters,
        limit: 10
      }
    })
  }),
  AvailablePriceListsSelect.HOC({
    name: "availablePricelists",
    options: ({ availablePricelistsFilters }) => ({
      context: {
        clientName: "pos"
      },
      variables: {
        filters: availablePricelistsFilters,
        limit: 10
      }
    })
  }),
  StockLocationsSelect.HOC({
    name: "stockLocations",
    options: ({ stockLocationFilters }) => ({
      context: {
        clientName: "pos"
      },
      variables: {
        filters: stockLocationFilters,
        limit: 10
      }
    })
  }),
  PaymentMethodsSelect.HOC({
    name: "paymentMethods",
    options: ({ paymentMethodFilters }) => ({
      context: {
        clientName: "pos"
      },
      variables: {
        filters: paymentMethodFilters,
        limit: 10
      }
    })
  }),
  withPropsOnChange(
    ["discountProducts"],
    ({ discountProducts: oldDiscountProducts }) => {
      let discountProducts = oldDiscountProducts;

      if (!discountProducts.loading) {
        discountProducts = {
          ...discountProducts,
          ...prepareDiscountProducts(prop("discountProducts", discountProducts))
        };
      }

      return { discountProducts };
    }
  ),
  withPropsOnChange(
    ["availablePricelists"],
    ({ availablePricelists: oldAvailablePricelists }) => {
      let availablePricelists = oldAvailablePricelists;

      if (!availablePricelists.loading) {
        availablePricelists = {
          ...availablePricelists,
          ...prepareAvailablePricelists(
            prop("availablePriceLists", availablePricelists)
          )
        };
      }

      return { availablePricelists };
    }
  ),
  withPropsOnChange(
    ["stockLocations"],
    ({ stockLocations: oldStockLocations }) => {
      let stockLocations = oldStockLocations;

      if (!stockLocations.loading) {
        stockLocations = {
          ...stockLocations,
          ...prepareStockLocations(prop("stockLocations", stockLocations))
        };
      }

      return { stockLocations };
    }
  ),
  withPropsOnChange(
    ["paymentMethods"],
    ({ paymentMethods: oldPaymentMethods }) => {
      let paymentMethods = oldPaymentMethods;

      if (!paymentMethods.loading) {
        paymentMethods = {
          ...paymentMethods,
          ...preparePaymentMethods(prop("paymentMethods", paymentMethods))
        };
      }

      return { paymentMethods };
    }
  ),
  withFormik({
    mapPropsToValues: props => {
      const { posConfig } = props;
      const posConfigValues =
        posConfig !== undefined && !posConfig.loading
          ? posConfig.posConfig
          : null;

      if (posConfigValues) {
        return posConfigValues;
      }

      return {
        name: "",
        ifaceTaxIncluded: ["subtotal"],
        globalDiscount: true,
        discountProduct: null,
        discountPc: 0.0,
        usePricelist: true,
        availablePricelist: [],
        pricelist: null,
        restrictPriceControl: false,
        paymentMethods: [],
        isHeaderOrFooter: true,
        receiptHeader: "",
        receiptFooter: "",
        stockLocation: null
      };
    },
    handleSubmit: (values, { props }) => {
      props.handleSubmit({
        context: {
          clientName: "pos"
        },
        variables: {
          input: transformPosConfigForm(values)
        }
      });
    },
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true
  })
)(FormContent);

export default ConfigurationForm;

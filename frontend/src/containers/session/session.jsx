import React from "react";
import { Row, Container, Col } from "reactstrap";
import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles
} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Modal from "@material-ui/core/Modal";
import { compose, withHandlers, withState } from "recompose";
import * as R from "ramda";

import {
  SessionCategories,
  SessionProducts,
  CloseSession
} from "../../generated-pos-models";
import Loader from "../../shared/components/Loader";
import ProductCard from "../../shared/components/ProductCard";
import Carousel from "../../shared/components/Carousel";
import Card from "@material-ui/core/Card";
import Order from "./components/Order";
import IconButton from "../../shared/components/IconButton";
import NumberKeypad from "../../shared/components/form-custom/NumberKeypad";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    primary: {
      main: "#289FD7",
      constrastText: "#FFFFFF"
    },
    secondary: {
      main: "#FFFFFF",
      constrastText: "#646777"
    }
  }
});

const styles = theme => ({
  primaryColor: {
    color: theme.palette.secondary.constrastText
  },
  secondaryColor: {
    color: `${theme.palette.primary.constrastText} !important`
  },
  primaryBg: {
    backgroundColor: theme.palette.primary.main
  },
  secondaryBg: {
    backgroundColor: "#EFFAFF"
  },
  primaryContainedButton: {
    backgroundColor: "#289FD7",
    color: "#FFFFFF",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: "#1e77a1"
    }
  },
  secondaryContainedButton: {
    backgroundColor: "#FFFFFF",
    color: "#646777",
    textTransform: "capitalize"
  },
  parentWidthHeight: {
    width: "100%",
    height: "100%"
  },
  parentWidth: {
    width: "100%"
  },
  profileImage: {
    borderRadius: "25%"
  },
  productCol: {
    maxHeight: "100%",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    height: "1px"
  },
  gridContainer: {
    overflowY: "scroll",
    flexGrow: 1,
    "&::-webkit-scrollbar": {
      display: "none"
    },
    msOverflowStyle: "none"
  },
  currentItemInOrderContainer: {
    padding: "1rem",
    overflowY: "scroll",
    height: "1px",
    flexWrap: "unset",
    "&::-webkit-scrollbar": {
      display: "none"
    },
    msOverflowStyle: "none"
  },
  validationContainer: {
    padding: "1rem",
    height: "1px",
    flexWrap: "unset"
  },
  gridItem: {
    flexBasis: "33.33%",
    [theme.breakpoints.down("sm")]: {
      flexBasis: "50%"
    }
  },
  mainRow: {
    height: "100vh"
  },
  padRight: {
    paddingRight: "45px"
  },
  receiptImage: {
    objectFit: "contain"
  },
  overflowYScroll: {
    overflowY: "scroll",
    "&::-webkit-scrollbar": {
      display: "none"
    },
    msOverflowStyle: "none"
  }
});

const DiscountModal = ({
  discountModalOpen,
  setDiscountModalOpen,
  classes,
  discountValue,
  setDiscountValue
}) => {
  return (
    <Modal
      className="d-flex justify-content-center align-items-center"
      open={discountModalOpen}
      onClose={() => setDiscountModalOpen(false)}
    >
      <Card className="p-4">
        <div className="d-flex flex-column">
          <Paper className={`${classes.secondaryBg} mb-2 p-2`}>
            <Typography variant="h6" component="h3">
              {discountValue}
            </Typography>
          </Paper>
          <NumberKeypad number={discountValue} setNumber={setDiscountValue} />
          <Button
            variant="contained"
            className={`${classes.primaryContainedButton} mt-2 py-2`}
            onClick={() => setDiscountModalOpen(false)}
          >
            <Typography
              variant="h6"
              component="h3"
              className={classes.secondaryColor}
            >
              Okay
            </Typography>
          </Button>

          <Button
            variant="contained"
            className={`${classes.secondaryContainedButton} mt-2 py-2`}
            onClick={() => setDiscountModalOpen(false)}
          >
            <Typography variant="h6" component="h3">
              Cancel
            </Typography>
          </Button>
        </div>
      </Card>
    </Modal>
  );
};

const ProfileColumn = ({ classes, onCloseSession }) => {
  return (
    <Card
      className={`${classes.parentWidthHeight} ${
        classes.primaryBg
      } text-center p-3`}
    >
      <div
        className={`${
          classes.parentWidthHeight
        } d-flex flex-column justify-content-between`}
      >
        <div>
          <img
            className={`${classes.profileImage} p-4`}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR7ULXhTjsUrfpFmzCzUo8T_dMjCwwshvugIVID97Y_5KYouGDJ"
          />
          <Typography
            classes={{ root: classes.secondaryColor }}
            variant="h5"
            component="h2"
          >
            Samuel
          </Typography>
          <Typography
            classes={{ root: classes.secondaryColor }}
            className="font-weight-light"
            variant="subtitle1"
            component="h3"
          >
            front cashier
          </Typography>
        </div>
        <div className="d-flex flex-column">
          <Button
            variant="contained"
            className={`${classes.secondaryContainedButton} mb-2 py-2`}
            onClick={onCloseSession}
          >
            <Typography variant="h6" component="h3">
              Close session
            </Typography>
          </Button>
          <Typography
            classes={{ root: classes.secondaryColor }}
            className="font-weight-light"
            variant="subtitle2"
            component="p"
          >
            2019 all rights
          </Typography>
        </div>
      </div>
    </Card>
  );
};

const ProductColumn = ({
  classes,
  className,
  categoryRecords,
  productRecords,
  addItemToOrder,
  getIdCounter
}) => {
  return (
    <div className={className}>
      <Typography variant="h6">Product Category</Typography>
      <Carousel>
        {categoryRecords.map(category => (
          <ProductCard name={category.name} image={category.image} />
        ))}
      </Carousel>
      <hr className={classes.parentWidth} />
      <Typography variant="h6" className="mb-2">
        Product List
      </Typography>
      <Grid container xs={12} className={classes.gridContainer} spacing={8}>
        {productRecords.map(product => (
          <Grid
            key={product.id}
            container
            className={classes.gridItem}
            justify="center"
          >
            <ProductCard
              name={product.name}
              image={product.image}
              price={product.salesPrice}
              className="mb-3"
              onPress={() => {
                addItemToOrder({
                  qty: 1,
                  priceUnit: product.salesPrice,
                  productId: product.id,
                  name: product.name,
                  id: getIdCounter()
                });
              }}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

const CurrentItemsInOrderSection = ({
  classes,
  discountModalOpen,
  setDiscountModalOpen,
  toPaymentMenu,
  discountValue,
  setDiscountValue,
  incrementItemInOrder,
  decrementItemInOrder,
  removeItemInOrder,
  itemsToOrder
}) => {
  return (
    <>
      <Paper
        classes={{ root: classes.secondaryBg }}
        elevation={1}
        className="mb-3 d-flex align-items-stretch flex-grow"
      >
        <Col xs={12} className="px-5 py-2 d-flex flex-column">
          <Row className="justify-content-between mb-2 pr-3">
            <Typography variant="h6" component="h3">
              Items
            </Typography>
            <Typography
              variant="h6"
              component="h3"
              className={classes.padRight}
            >
              Price
            </Typography>
          </Row>
          <Row
            className={`d-flex flex-column align-items-stretch flex-grow pb-2 ${
              classes.currentItemInOrderContainer
            }`}
          >
            {itemsToOrder.map(item => (
              <Order
                quantity={item.qty}
                name={item.name}
                price={item.qty * item.priceUnit}
                handleMinus={() => decrementItemInOrder(item.productId)}
                handlePlus={() => incrementItemInOrder(item.productId)}
                handleCross={() => removeItemInOrder(item.productId)}
              />
            ))}
          </Row>
          <Row className="justify-content-between mb-2 pr-3">
            <Typography variant="body1" component="p">
              Subtotal
            </Typography>
            <Typography
              variant="body1"
              component="p"
              className={`${classes.padRight} text-right`}
            >
              Rp 14.400
            </Typography>
          </Row>
          <Row className="justify-content-between mb-2 pr-3">
            <Typography variant="body1" component="p">
              Discount
            </Typography>
            <Typography
              variant="body1"
              component="p"
              className={classes.padRight}
            >
              Rp 0
            </Typography>
          </Row>
          <Row className="justify-content-between pr-3">
            <Typography
              variant="body1"
              component="p"
              className="font-weight-bold"
            >
              Total
            </Typography>
            <Typography
              variant="body1"
              component="p"
              className={`font-weight-bold  ${classes.padRight}`}
            >
              Rp 134.000
            </Typography>
          </Row>
        </Col>
      </Paper>
      <Paper
        classes={{ root: classes.secondaryBg }}
        elevation={1}
        className="mb-3 px-5 py-2"
      >
        <Row className="d-flex justify-content-between">
          <Typography variant="h6" component="h3">
            Discount
          </Typography>
          <IconButton
            icon={<ArrowForwardIcon />}
            onPress={() => setDiscountModalOpen(true)}
          />
          <DiscountModal
            classes={classes}
            discountModalOpen={discountModalOpen}
            setDiscountModalOpen={setDiscountModalOpen}
            discountValue={discountValue}
            setDiscountValue={setDiscountValue}
          />
        </Row>
      </Paper>
      <Button
        variant="contained"
        className={`${classes.primaryContainedButton} mt-3 py-2`}
        onClick={toPaymentMenu}
      >
        <Typography
          variant="h5"
          component="h3"
          className={classes.secondaryColor}
        >
          Payment
        </Typography>
      </Button>
    </>
  );
};

const ValidationSection = ({ classes, toReceiptMenu }) => {
  return (
    <>
      <Row className="justify-content-between mb-2 pr-3">
        <div className="mb-4">
          <Typography variant="body1" component="p" className="flex-grow">
            Due
          </Typography>
          <Typography variant="h6">Rp 140.000</Typography>
        </div>
        <div>
          <Typography variant="body1" component="p" className="flex-grow">
            Tendered
          </Typography>
          <Typography variant="h6">Rp 140.000</Typography>
        </div>
        <div>
          <Typography variant="body1" component="p" className="flex-grow">
            Change
          </Typography>
          <Typography variant="h6">Rp 140.000</Typography>
        </div>
        <div>
          <Typography variant="body1" component="p" className="flex-grow">
            Method
          </Typography>
          <Typography variant="h6">Cash (IDR)</Typography>
        </div>
      </Row>
      <div className="mb-3 d-flex align-items-stretch flex-grow">
        <Col xs={12} className="px-3 py-2 d-flex flex-column">
          <Row
            className={`d-flex align-items-stretch flex-grow pb-2 px-0 ${
              classes.validationContainer
            }`}
          >
            <Col xs={5} className={`px-0 ${classes.overflowYScroll}`}>
              {[...Array(10).keys()].map(() => (
                <Paper
                  classes={{ root: classes.secondaryBg }}
                  elevation={1}
                  className="mb-3 d-flex align-items-stretch flex-grow p-4"
                >
                  <Typography variant="h6">Cash (IDR)</Typography>
                </Paper>
              ))}
            </Col>
            <Col xs={7}>
              <NumberKeypad />
            </Col>
          </Row>
        </Col>
      </div>
      <Button
        variant="contained"
        className={`${classes.primaryContainedButton} mt-3 py-2`}
        onClick={toReceiptMenu}
      >
        <Typography
          variant="h5"
          component="h3"
          className={classes.secondaryColor}
        >
          Validate
        </Typography>
      </Button>
    </>
  );
};

const ReceiptSection = ({ classes, toNextOrder }) => {
  return (
    <>
      <Paper classes={{ root: classes.secondaryBg }} className="mb-4 px-5">
        <Row className="justify-content-between mb-2 pr-3">
          <Row>
            <Col xs={12}>
              <Typography variant="body1" component="p" className="flex-grow">
                Due
              </Typography>
              <Typography variant="h6">Rp 140.000</Typography>
            </Col>
          </Row>
        </Row>
      </Paper>
      <Paper
        classes={{ root: classes.secondaryBg }}
        className={`mb-3 d-flex align-items-stretch flex-grow ${
          classes.currentItemInOrderContainer
        }`}
      >
        <Col xs={12} className={`px-5 py-2 d-flex flex-column`}>
          <img
            className={classes.receiptImage}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTKjC_nfT9D-owMFBIsMXLfMOfNU5CDdt2bwyoAdufXpgXQuRJW"
          />
        </Col>
      </Paper>
      <Button
        variant="contained"
        className={`${classes.secondaryContainedButton} mt-3 py-2`}
      >
        <Typography variant="h5" component="h3">
          Print Receipt
        </Typography>
      </Button>
      <Button
        variant="contained"
        className={`${classes.primaryContainedButton} mt-3 py-2`}
        onClick={toNextOrder}
      >
        <Typography
          variant="h5"
          component="h3"
          className={classes.secondaryColor}
        >
          Next Order
        </Typography>
      </Button>
    </>
  );
};

const OrderColumn = props => {
  const { classes, className, sequenceNumber, orderState } = props;

  return (
    <div className={className}>
      <Paper
        classes={{ root: classes.secondaryBg }}
        elevation={1}
        className="px-5 mb-3 py-2"
      >
        <Row>
          <Typography variant="h6" component="h3">
            Order {sequenceNumber}
          </Typography>
        </Row>
      </Paper>
      {orderState == Menu.ORDER ? (
        <CurrentItemsInOrderSection {...props} />
      ) : orderState == Menu.PAYMENT ? (
        <ValidationSection {...props} />
      ) : (
        <ReceiptSection {...props} />
      )}
    </div>
  );
};

const Session = props => {
  const { classes, categories, products, orderState, backToOrderMenu } = props;
  const { loading: loadingCategories, posCategories } = categories;
  const { loading: loadingProducts, posProducts } = products;
  if (loadingCategories || loadingProducts) {
    return <Loader />;
  }

  const categoryRecords = posCategories.records;
  const productRecords = posProducts.records;

  return (
    <Container>
      <Row className={classes.mainRow}>
        <Col xs={2} className="pl-0">
          <ProfileColumn classes={classes} {...props} />
        </Col>
        <Col xs={10} className="d-flex flex-column">
          <Row className="d-flex pt-4">
            {orderState == Menu.PAYMENT && (
              <div
                className="align-self-end d-flex align-items-center ml-3"
                onClick={backToOrderMenu}
              >
                <IconButton icon={<ArrowBackIcon />} />
                <Typography variant="h6" component="h3" className="ml-3">
                  Back
                </Typography>
              </div>
            )}
            <div className="text-right mr-2 flex-grow">
              <h3>Thursday 24 July 2019, 09.00 AM</h3>
              <h4>Shift Started at 08.00AM ( 1 :00 Hours )</h4>
            </div>
          </Row>
          <hr className={classes.parentWidth} />
          <Row className="flex-grow">
            <Col xs={6} xl={5} className="d-flex flex-column">
              {orderState == Menu.ORDER && (
                <ProductColumn
                  className={classes.productCol}
                  categoryRecords={categoryRecords}
                  productRecords={productRecords}
                  {...props}
                />
              )}
            </Col>
            <Col xs={6} xl={7} className="d-flex flex-column pb-3">
              <OrderColumn
                className="d-flex flex-column flex-grow"
                productRecords={productRecords}
                sequenceNumber={1}
                {...props}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

const Menu = {
  ORDER: 0,
  PAYMENT: 1,
  RECEIPT: 2
};

const SessionPage = compose(
  WrappedComp => props => (
    <MuiThemeProvider theme={theme}>
      <WrappedComp {...props} theme={theme} />
    </MuiThemeProvider>
  ),
  withStyles(styles),
  withState("idCounter", "setIdCounter", 1),
  withState("orderState", "setOrderState", Menu.ORDER),
  withState("itemsToOrder", "setItemsToOrder", []),
  withState("discountValue", "setDiscountValue", "0"),
  withState("discountModalOpen", "setDiscountModalOpen", false),
  WrappedComp => props => (
    <CloseSession.Component onError={props.onError}>
      {(closeSession, { loading }) => (
        <WrappedComp
          closeSession={closeSession}
          loadingClose={loading}
          {...props}
        />
      )}
    </CloseSession.Component>
  ),
  withHandlers({
    incrementQuantityOfItem: () => item => R.evolve({ qty: R.add(1) }, item),
    decrementQuantityOfItem: () => item => R.evolve({ qty: R.add(-1) }, item),
    getIdCounter: ({ idCounter, setIdCounter }) => () => {
      const id = idCounter;
      setIdCounter(idCounter + 1);
      return id;
    },
    removeItemInOrder: ({ itemsToOrder, setItemsToOrder }) => productId => {
      setItemsToOrder(
        R.remove(
          R.findIndex(R.propEq("productId", productId), itemsToOrder),
          1,
          itemsToOrder
        )
      );
    }
  }),
  withHandlers({
    onCloseSession: ({ match, closeSession, history }) => () =>
      closeSession({
        context: {
          clientName: "pos"
        },
        variables: {
          id: match.params.id
        }
      }).then(() => history.push("/dashboard/list")),
    toPaymentMenu: ({ orderState, setOrderState }) => () => {
      if (orderState == Menu.ORDER) {
        setOrderState(Menu.PAYMENT);
      }
    },
    backToOrderMenu: ({ orderState, setOrderState }) => () => {
      if (orderState == Menu.PAYMENT) {
        setOrderState(Menu.ORDER);
      }
    },
    toReceiptMenu: ({ orderState, setOrderState }) => () => {
      if (orderState == Menu.PAYMENT) {
        setOrderState(Menu.RECEIPT);
      }
    },
    toNextOrder: ({ orderState, setOrderState }) => () => {
      if (orderState == Menu.RECEIPT) {
        setOrderState(Menu.ORDER);
      }
    },
    addItemToOrder: ({
      itemsToOrder,
      setItemsToOrder,
      incrementQuantityOfItem
    }) => newItem => {
      const index = R.findIndex(
        R.propEq("productId", newItem.productId),
        itemsToOrder
      );
      if (index === -1) {
        setItemsToOrder([...itemsToOrder, newItem]);
      } else {
        setItemsToOrder(R.adjust(index, incrementQuantityOfItem, itemsToOrder));
      }
    },
    incrementItemInOrder: ({
      itemsToOrder,
      setItemsToOrder,
      incrementQuantityOfItem
    }) => productId => {
      setItemsToOrder(
        R.adjust(
          R.findIndex(R.propEq("productId", productId), itemsToOrder),
          incrementQuantityOfItem,
          itemsToOrder
        )
      );
    },
    decrementItemInOrder: ({
      itemsToOrder,
      setItemsToOrder,
      decrementQuantityOfItem,
      removeItemInOrder
    }) => productId => {
      const index = R.findIndex(R.propEq("productId", productId), itemsToOrder);

      if (itemsToOrder[index].qty > 1) {
        setItemsToOrder(R.adjust(index, decrementQuantityOfItem, itemsToOrder));
      } else {
        removeItemInOrder(productId);
      }
    }
  })
)(Session);

export default SessionPage;

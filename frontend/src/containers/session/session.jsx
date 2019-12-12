import React from "react";
import { connect } from "react-redux";
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
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {
  compose,
  withHandlers,
  withState,
  withPropsOnChange,
  getContext
} from "recompose";
import * as R from "ramda";
var moment = require("moment");

import { addNotif } from "../../redux/modules/general";
import { UserInfoContext } from "../../utils/transformers/general";
import {
  SessionCategories,
  SessionProducts,
  CloseSession,
  SessionPosConfig,
  AccountBankStatements,
  CreateOrder,
  SessionInfo,
  UserInfo,
  SessionSummary
} from "../../generated-pos-models";
import Loader from "../../shared/components/Loader";
import ProductCard from "../../shared/components/ProductCard";
import Carousel from "../../shared/components/Carousel";
import Card from "@material-ui/core/Card";
import Order from "./components/Order";
import IconButton from "../../shared/components/IconButton";
import NumberKeypad from "../../shared/components/form-custom/NumberKeypad";
import SessionSummaryCard from "../../shared/components/Report";

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
  },
  flexBasis25: {
    flexBasis: "25%"
  },
  wordBreakAll: {
    wordBreak: "break-all"
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
          <NumberKeypad
            number={discountValue}
            setNumber={setDiscountValue}
            maxValue={100}
          />
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

const SessionSummaryModal = props => {
  const {
    summaryModalOpen,
    setSummaryModalOpen,
    posSessionSummary,
    loadingSessionSummary,
    classes
  } = props;

  return (
    <Modal
      className="d-flex justify-content-center align-items-center"
      open={summaryModalOpen}
      onClose={() => setSummaryModalOpen(false)}
    >
      {!loadingSessionSummary && posSessionSummary ? (
        <SessionSummaryCard
          {...props}
          totalNetSales={posSessionSummary.totalNetSale}
          transactions={posSessionSummary.transactions}
          averageValue={posSessionSummary.averageOrderValue}
          parentClasses={classes}
        />
      ) : (
        <Loader />
      )}
    </Modal>
  );
};

const ProfileColumn = ({
  classes,
  onCloseSession,
  profileInfo,
  summaryModalOpen,
  setSummaryModalOpen,
  posSession,
  posSessionSummary,
  loadingSessionSummary,
  getSessionSummary
}) => {
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
            src={`data:image/png;base64,${profileInfo.image}`}
          />
          <Typography
            classes={{ root: classes.secondaryColor }}
            variant="h5"
            component="h2"
            className={classes.wordBreakAll}
          >
            {profileInfo.name}
          </Typography>
          <Typography
            classes={{ root: classes.secondaryColor }}
            className="font-weight-light"
            variant="subtitle1"
            component="h3"
          >
            {profileInfo.function}
          </Typography>
        </div>
        <div className="d-flex flex-column">
          <Button
            variant="contained"
            className={`${classes.secondaryContainedButton} mb-2 py-2`}
            onClick={() => {
              getSessionSummary();
              setSummaryModalOpen(true);
            }}
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
        <SessionSummaryModal
          summaryModalOpen={summaryModalOpen}
          setSummaryModalOpen={setSummaryModalOpen}
          base64Image={profileInfo.image}
          name={profileInfo.name}
          currentDate={moment(new Date()).format("dddd D MMMM YYYY, H.mm")}
          startOfShift={moment(new Date(posSession.startSession))
            .add(7, "h")
            .format("H.mm")}
          onDone={onCloseSession}
          posSessionSummary={posSessionSummary}
          loadingSessionSummary={loadingSessionSummary}
          classes={classes}
        />
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
  itemsToOrder,
  getSubtotal,
  getTotal,
  getDiscount
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
                price={Math.round(item.qty * item.priceUnit)}
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
              Rp {getSubtotal()}
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
              Rp {getDiscount()}
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
              Rp {getTotal()}
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

const ValidationSection = ({
  classes,
  toReceiptMenu,
  getTotal,
  bankStatementRecords,
  tenderedValue,
  setTenderedValue,
  bankStatement,
  setBankStatement,
  createOrderFromState,
  sequenceNumber,
  triggerNotif
}) => {
  return (
    <>
      <Row className="justify-content-between mb-2 pr-3">
        <div className="mb-4" className={classes.flexBasis25}>
          <Typography variant="body1" component="p">
            Due
          </Typography>
          <Typography variant="h6">Rp {getTotal()}</Typography>
        </div>
        <div className={classes.flexBasis25}>
          <Typography variant="body1" component="p">
            Tendered
          </Typography>
          <Typography variant="h6">Rp {tenderedValue}</Typography>
        </div>
        <div className={classes.flexBasis25}>
          <Typography variant="body1" component="p">
            Change
          </Typography>
          <Typography variant="h6">
            Rp {Math.max(tenderedValue - getTotal(), 0)}
          </Typography>
        </div>
        <div className={classes.flexBasis25}>
          <Typography variant="body1" component="p">
            Method
          </Typography>
          <Typography variant="h6">
            {R.pathOr("-", ["journal", "name"], bankStatement)}
          </Typography>
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
              {bankStatementRecords.map(statement => (
                <Paper
                  classes={{ root: classes.secondaryBg }}
                  elevation={1}
                  className="mb-3 d-flex align-items-stretch flex-grow p-4"
                  onClick={() => setBankStatement(statement)}
                >
                  <Typography variant="h6">{statement.journal.name}</Typography>
                </Paper>
              ))}
            </Col>
            <Col xs={7}>
              <NumberKeypad
                number={tenderedValue}
                setNumber={setTenderedValue}
              />
            </Col>
          </Row>
        </Col>
      </div>
      <Button
        variant="contained"
        className={`${classes.primaryContainedButton} mt-3 py-2`}
        onClick={() => {
          if (bankStatement === null) {
            triggerNotif({
              message: "Method not selected",
              type: "warning"
            });
          } else if (parseInt(tenderedValue) < getTotal()) {
            triggerNotif({
              message: "Tendered value lower than Due",
              type: "warning"
            });
          } else {
            createOrderFromState(sequenceNumber);
          }
        }}
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

const ReceiptSection = ({ classes, toNextOrder, tenderedValue, getTotal }) => {
  return (
    <>
      <Paper classes={{ root: classes.secondaryBg }} className="mb-4 px-5 pt-2">
        <Row className="justify-content-between mb-2 pr-3">
          <Row>
            <Col xs={12}>
              <Typography variant="body1" component="p" className="flex-grow">
                Change
              </Typography>
              <Typography variant="h6">
                Rp {Math.max(tenderedValue - getTotal(), 0)}
              </Typography>
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
            Order #{sequenceNumber}
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
  const {
    classes,
    categories,
    products,
    orderState,
    backToOrderMenu,
    bankStatements,
    sessionInfo,
    userInfo,
    loadingCreateOrder,
    loadingClose,
    sessionSummary
  } = props;
  const { loading: loadingCategories, posCategories } = categories;
  const { loading: loadingProducts, posProducts } = products;
  const {
    loading: loadingBankStatements,
    accountBankStatement
  } = bankStatements;
  const { loading: loadingSession, posSession } = sessionInfo;
  const { loading: loadingUserInfo, getUserInfo } = userInfo;
  const { loading: loadingSessionSummary, posSessionSummary } = sessionSummary;

  if (
    loadingCategories ||
    loadingProducts ||
    loadingBankStatements ||
    loadingSession ||
    loadingUserInfo ||
    loadingCreateOrder ||
    loadingClose ||
    getUserInfo === undefined
  ) {
    return <Loader />;
  }

  const categoryRecords = posCategories.records;
  const productRecords = posProducts.records;
  const bankStatementRecords = accountBankStatement.records;

  return (
    <Container>
      <Row className={classes.mainRow}>
        <Col xs={2} className="pl-0">
          <ProfileColumn
            classes={classes}
            profileInfo={getUserInfo}
            posSession={posSession}
            posSessionSummary={posSessionSummary}
            loadingSessionSummary={loadingSessionSummary}
            {...props}
          />
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
              <h3>{moment(new Date()).format("dddd D MMMM YYYY, H.mm")}</h3>
              <h4>
                Shift Started at{" "}
                {moment(new Date(posSession.startSession))
                  .add(7, "h")
                  .format("H.mm")}
              </h4>
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
                bankStatementRecords={bankStatementRecords}
                sequenceNumber={posSession.sequenceNumber}
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
  getContext(UserInfoContext),
  connect(
    null,
    dispatch => ({
      triggerNotif: notif => dispatch(addNotif(notif))
    })
  ),
  withState("idCounter", "setIdCounter", 1),
  withState("orderState", "setOrderState", Menu.ORDER),
  withState("itemsToOrder", "setItemsToOrder", []),
  withState("discountValue", "setDiscountValue", "0"),
  withState("discountModalOpen", "setDiscountModalOpen", false),
  withState("summaryModalOpen", "setSummaryModalOpen", false),
  withState("tenderedValue", "setTenderedValue", "0"),
  withState("bankStatement", "setBankStatement", null),
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
  WrappedComp => props => (
    <CreateOrder.Component onError={props.onError}>
      {(posOrder, { loading }) => (
        <WrappedComp
          createOrder={posOrder}
          loadingCreateOrder={loading}
          {...props}
        />
      )}
    </CreateOrder.Component>
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
    },
    getSubtotal: ({ itemsToOrder }) => () =>
      Math.round(
        itemsToOrder.reduce((acc, item) => acc + item.qty * item.priceUnit, 0)
      ),
    getTotal: ({ itemsToOrder, discountValue }) => () =>
      Math.round(
        itemsToOrder.reduce((acc, item) => acc + item.qty * item.priceUnit, 0) *
          (1 - discountValue / 100)
      ),
    getDiscount: ({ itemsToOrder, discountValue }) => () =>
      Math.round(
        itemsToOrder.reduce((acc, item) => acc + item.qty * item.priceUnit, 0) *
          (discountValue / 100)
      )
  }),
  withHandlers({
    onCloseSession: ({ match, closeSession, history }) => () =>
      closeSession({
        context: {
          clientName: "pos"
        },
        variables: {
          id: match.params.sessionId
        }
      }).then(() => history.push("/dashboard/list")),
    toPaymentMenu: ({
      orderState,
      setOrderState,
      itemsToOrder,
      triggerNotif
    }) => () => {
      if (itemsToOrder.length === 0) {
        triggerNotif({
          message: "No items in order",
          type: "warning"
        });

        return;
      }
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
    toNextOrder: ({
      orderState,
      setOrderState,
      setItemsToOrder,
      setDiscountValue,
      setTenderedValue,
      setBankStatement
    }) => () => {
      if (orderState == Menu.RECEIPT) {
        setOrderState(Menu.ORDER);
      }
      setItemsToOrder([]);
      setDiscountValue("0");
      setTenderedValue("0");
      setBankStatement(null);
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
  }),
  SessionCategories.HOC({
    name: "categories",
    options: () => ({
      context: {
        clientName: "pos"
      },
      fetchPolicy: "network-only"
    })
  }),
  SessionProducts.HOC({
    name: "products",
    options: () => ({
      context: {
        clientName: "pos"
      },
      fetchPolicy: "network-only"
    })
  }),
  SessionPosConfig.HOC({
    name: "config",
    options: ({ match }) => ({
      context: {
        clientName: "pos"
      },
      variables: {
        id: match.params.configId
      },
      fetchPolicy: "network-only"
    })
  }),
  AccountBankStatements.HOC({
    name: "bankStatements",
    options: ({ match }) => ({
      context: {
        clientName: "pos"
      },
      variables: {
        id: match.params.sessionId
      },
      fetchPolicy: "network-only"
    })
  }),
  SessionInfo.HOC({
    name: "sessionInfo",
    options: ({ match }) => ({
      context: {
        clientName: "pos"
      },
      variables: {
        id: match.params.sessionId
      },
      fetchPolicy: "network-only"
    })
  }),
  UserInfo.HOC({
    name: "userInfo",
    options: () => ({
      context: {
        clientName: "pos"
      },
      fetchPolicy: "network-only"
    })
  }),
  SessionSummary.HOC({
    name: "sessionSummary",
    options: ({ match }) => ({
      context: {
        clientName: "pos"
      },
      variables: {
        id: match.params.sessionId
      },
      fetchPolicy: "network-only"
    })
  }),
  withPropsOnChange(["config"], ({ config }) => {
    const defaultPricelistId = R.pathOr(
      false,
      ["posConfig", "pricelist", "id"],
      config
    );
    if (defaultPricelistId) {
      return { pricelistId: defaultPricelistId };
    }
    return {};
  }),
  withHandlers({
    getUserInfo: ({ userInfo, uid }) => () => {
      return {
        userInfo: userInfo.refetch({
          context: {
            clientName: "pos"
          },
          id: uid
        })
      };
    },
    createOrderFromState: ({
      createOrder,
      getTotal,
      tenderedValue,
      itemsToOrder,
      match,
      uid,
      pricelistId,
      bankStatement,
      toReceiptMenu,
      triggerNotif
    }) => sequenceNumber => {
      createOrder({
        context: {
          clientName: "pos"
        },
        variables: {
          id: `${moment(new Date()).format(
            "DD/MM/YY HH.mm"
          )} ${sequenceNumber}`,
          amountPaid: parseInt(tenderedValue),
          amountTotal: getTotal(),
          amountReturn: tenderedValue - getTotal(),
          items: R.map(
            R.pipe(
              R.evolve({ discount: 0 }),
              R.dissoc("name")
            ),
            itemsToOrder
          ),
          statementId: bankStatement.id,
          accountId: bankStatement.account.id,
          journalId: bankStatement.journal.id,
          sessionId: match.params.sessionId,
          pricelistId: pricelistId,
          userId: uid,
          sequenceNumber: sequenceNumber
        }
      }).then(result => {
        if (R.pathOr(false, ["data", "posOrder", "result"], result)) {
          triggerNotif({
            message: "Order created successfuly",
            type: "success"
          });
          toReceiptMenu();
        } else {
          triggerNotif({
            message: "Failed to create order",
            type: "error"
          });
        }
      });
    },
    getSessionSummary: ({ match, sessionSummary }) => () => {
      sessionSummary.refetch({
        id: match.params.sessionId
      });
    }
  }),
  withPropsOnChange(["uid", "userInfo"], ({ uid, userInfo, getUserInfo }) => {
    if (typeof uid === "number" && userInfo.getUserInfo === undefined) {
      return getUserInfo();
    }
    return {};
  })
)(Session);

export default SessionPage;

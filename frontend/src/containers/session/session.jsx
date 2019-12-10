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
import { compose, withHandlers } from "recompose";

import {
  SessionCategories,
  SessionProducts,
  CloseSession
} from "../../generated-pos-models";
import Loader from "../../shared/components/Loader";
import ProductCard from "../../shared/components/ProductCard";
import Carousel from "../../shared/components/Carousel";
import Card from "@material-ui/core/Card";

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
    color: "#FFFFFF"
  },
  secondaryContainedButton: {
    backgroundColor: "#FFFFFF",
    color: "#646777"
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
    flexGrow: 1
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
  paper: {
    backgroundColor: theme.palette.primary.secondary
  },
  padRight: {
    paddingRight: "30px"
  }
});

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
            size="small"
            className={`${classes.secondaryContainedButton} mb-2 py-2`}
            onClick={onCloseSession}
          >
            Close session
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
  onCloseSession
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
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

const OrderColumn = ({ classes, className }) => {
  return (
    <div className={className}>
      <Paper classes={{ root: classes.secondaryBg }} elevation={1}>
        <Col xs={12} className="px-5 py-2">
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
          <Row className="d-flex flex-column align-items-stretch">
            <Order quantity={5} name={"brazilian"} price={14000} />
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
      <Button
        variant="contained"
        className={`${classes.primaryContainedButton} mt-3`}
      >
        Payment
      </Button>
    </div>
  );
};

const Session = ({ classes, categories, products, onCloseSession }) => {
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
          <ProfileColumn classes={classes} onCloseSession={onCloseSession} />
        </Col>
        <Col xs={10} className="d-flex flex-column">
          <Row className="d-flex flex-column align-items-stretch pt-4">
            <div className="text-right mr-2">
              <h3>Thursday 24 July 2019, 09.00 AM</h3>
              <h4>Shift Started at 08.00AM ( 1 :00 Hours )</h4>
            </div>
          </Row>
          <hr className={classes.parentWidth} />
          <Row className="flex-grow">
            <Col xs={6} xl={5} className="d-flex flex-column">
              <ProductColumn
                classes={classes}
                className={classes.productCol}
                categoryRecords={categoryRecords}
                productRecords={productRecords}
              />
            </Col>
            <Col xs={6} xl={7}>
              <OrderColumn classes={classes} className="d-flex flex-column" />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

const SessionPage = compose(
  WrappedComp => props => (
    <MuiThemeProvider theme={theme}>
      <WrappedComp {...props} theme={theme} />
    </MuiThemeProvider>
  ),
  withStyles(styles),
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
    onCloseSession: ({ match, closeSession, history }) => () =>
      closeSession({
        context: {
          clientName: "pos"
        },
        variables: {
          id: match.params.id
        }
      }).then(() => history.push("/dashboard/list"))
  }),
  SessionCategories.HOC({
    name: "categories",
    options: ({ filters, offset, limit }) => ({
      context: {
        clientName: "pos"
      },
      variables: {
        filters,
        offset,
        limit
      },
      fetchPolicy: "network-only"
    })
  }),
  SessionProducts.HOC({
    name: "products",
    options: ({ filters, offset, limit }) => ({
      context: {
        clientName: "pos"
      },
      variables: {
        filters,
        offset,
        limit
      },
      fetchPolicy: "network-only"
    })
  })
)(Session);

export default SessionPage;

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
import { compose } from "recompose";

import { SessionCategories, SessionProducts } from "../../generated-pos-models";
import Loader from "../../shared/components/Loader";
import ProductCard from "../../shared/components/ProductCard";
import Carousel from "../../shared/components/Carousel";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#289FD7",
      secondary: "#EFFAFF"
    },
    text: {
      primary: "#646777",
      secondary: "#FFFFFF"
    }
  }
});

const styles = theme => ({
  productCol: {
    maxHeight: "100%",
    display: "flex",
    flexDirection: "column"
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
    height: "calc(100vh - 80px)"
  },
  paper: {
    backgroundColor: theme.palette.primary.secondary
  },
  containedButton: {
    color: theme.palette.text.secondary
  }
});

const Session = ({ classes, categories, products }) => {
  const { loading: loadingCategories, posCategories } = categories;
  const { loading: loadingProducts, posProducts } = products;

  if (loadingCategories || loadingProducts) {
    return <Loader />;
  }

  const categoryRecords = posCategories.records;
  const productRecords = posProducts.records;

  return (
    <Container className={classes.container}>
      <Row className={classes.mainRow}>
        <Col xs={2} />
        <Col xs={5} xl={4} className={classes.productCol}>
          <Typography variant="h6">Product Category</Typography>
          <Carousel>
            {categoryRecords.map(category => (
              <ProductCard name={category.name} image={category.image} />
            ))}
          </Carousel>
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
        </Col>
        <Col xs={5} xl={6} className="d-flex flex-column">
          <Paper classes={{ root: classes.paper }} elevation={1}>
            <Col xs={12} className="px-5 py-2">
              <Row className="justify-content-between mb-2">
                <Typography variant="h6" component="h3" color="textPrimary">
                  Items
                </Typography>
                <Typography variant="h6" component="h3" color="textPrimary">
                  Price
                </Typography>
              </Row>
              <Row className="justify-content-between mb-2">
                <Typography variant="body1" component="p" color="textPrimary">
                  Subtotal
                </Typography>
                <Typography variant="body1" component="p" color="textPrimary">
                  Rp 14.400
                </Typography>
              </Row>
              <Row className="justify-content-between mb-2">
                <Typography variant="body1" component="p" color="textPrimary">
                  Discount
                </Typography>
                <Typography variant="body1" component="p" color="textPrimary">
                  Rp 0
                </Typography>
              </Row>
              <Row className="justify-content-between">
                <Typography
                  variant="body1"
                  component="p"
                  color="textPrimary"
                  className="font-weight-bold"
                >
                  Total
                </Typography>
                <Typography
                  variant="body1"
                  component="p"
                  color="textPrimary"
                  className="font-weight-bold"
                >
                  Rp 134.000
                </Typography>
              </Row>
            </Col>
          </Paper>
          <Button
            variant="contained"
            color="primary"
            classes={{ contained: classes.containedButton }}
            className="mt-3"
          >
            Payment
          </Button>
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

import React from "react";
import { Row, Container, Col } from "reactstrap";
import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { compose } from "recompose";

import { SessionCategories, SessionProducts } from "../../generated-pos-models";
import Loader from "../../shared/components/Loader";
import ProductCard from "../../shared/components/ProductCard";
import Carousel from "../../shared/components/Carousel";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#289FD7"
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
    <MuiThemeProvider theme={theme}>
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
            <Grid
              container
              xs={12}
              className={classes.gridContainer}
              spacing={8}
            >
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
          <Col xs={5} xl={6} />
        </Row>
      </Container>
    </MuiThemeProvider>
  );
};

const SessionPage = compose(
  withStyles(styles, { withTheme: true }),
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

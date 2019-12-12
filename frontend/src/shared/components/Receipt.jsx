import React from "react";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const styles = {
  outterBox: {
    padding: "1rem"
  },
  leftDescription: {
    textAlign: "left"
  },
  rightDescription: {
    textAlign: "right"
  },
  gridContainer: {
    textAlign: "center",
    backgroundColor: "white",
    border: "0.1rem solid lightGrey",
    maxWidth: "20rem"
  },
  gridRow: {
    padding: "0.5rem",
    flexDirection: "column",
    padding: "1rem"
  }
};

const Receipt = ({
  classes,
  date,
  orderName,
  companyName,
  userName,
  header,
  footer,
  items,
  subtotal,
  total,
  paymentMethodName,
  tendered,
  change
}) => (
  <div>
    <Grid
      container
      className={classes.outterBox}
      alignItems="center"
      justify="center"
      maxWidth="sm"
      spacing={8}
    >
      <Grid
        container
        className={classes.gridContainer}
        alignItems="center"
        justify="center"
        maxWidth="sm"
        spacing={8}
      >
        <Grid
          container
          className={`${classes.gridRow}  py-2`}
          alignItems="center"
          justify="center"
          maxWidth="sm"
          spacing={8}
        >
          <Typography variant="span">
            {date} {orderName}
          </Typography>
        </Grid>
        <Grid
          container
          className={`${classes.gridRow}  py-2`}
          alignItems="start"
          justify="center"
          maxWidth="sm"
          spacing={8}
        >
          <Typography variant="span" className={classes.leftDescription}>
            {companyName}
          </Typography>
          <Typography variant="span" className={classes.leftDescription}>
            User: {userName}
          </Typography>
        </Grid>
        <Grid
          container
          className={classes.gridRow}
          alignItems="center"
          justify="center"
          maxWidth="sm"
          spacing={8}
        >
          <Typography variant="span">{header}</Typography>
        </Grid>

        {items.map(item => (
          <>
            <Grid
              container
              xs={6}
              sm={6}
              className={`${classes.gridRow}  py-0 px-1`}
              alignItems="start"
              justify="start"
              spacing={30}
            >
              <Typography variant="span" className={classes.leftDescription}>
                {item.name}
              </Typography>
            </Grid>

            <Grid
              container
              xs={2}
              sm={2}
              className={`${classes.gridRow}  py-0 px-1`}
              alignItems="end"
              justify="start"
              spacing={8}
            >
              <Typography variant="span">{item.qty}</Typography>
            </Grid>
            <Grid
              container
              xs={4}
              sm={4}
              className={`${classes.gridRow}  py-0 px-1`}
              alignItems="end"
              justify="start"
              spacing={8}
            >
              <Typography variant="span" className={classes.rightDescription}>
                Rp
                {item.qty * item.priceUnit}
              </Typography>
            </Grid>
          </>
        ))}

        <Grid
          container
          xs={6}
          sm={6}
          className={`${classes.gridRow}  py-2 px-2`}
          alignItems="start"
          justify="start"
          spacing={30}
        >
          <Typography variant="span" className={classes.leftDescription}>
            SubTotal:
          </Typography>
        </Grid>
        <Grid
          container
          xs={6}
          sm={6}
          className={`${classes.gridRow}  py-2 px-2`}
          alignItems="end"
          justify="start"
          spacing={8}
        >
          <Typography variant="span" className={classes.rightDescription}>
            Rp {subtotal}
          </Typography>
        </Grid>
        <Grid
          container
          xs={6}
          sm={6}
          className={`${classes.gridRow}  py-2 px-2`}
          alignItems="start"
          justify="start"
          spacing={30}
        >
          <Typography variant="h6" className={classes.leftDescription}>
            Total:
          </Typography>
        </Grid>
        <Grid
          container
          xs={6}
          sm={6}
          className={`${classes.gridRow}  py-2 px-2`}
          alignItems="end"
          justify="start"
          spacing={8}
        >
          <Typography variant="h6" className={classes.rightDescription}>
            Rp {total}
          </Typography>
        </Grid>
        <Grid
          container
          xs={6}
          sm={6}
          className={`${classes.gridRow}  py-2 px-2`}
          alignItems="start"
          justify="start"
          spacing={30}
        >
          <Typography variant="span" className={classes.leftDescription}>
            {paymentMethodName}
          </Typography>
        </Grid>
        <Grid
          container
          xs={6}
          sm={6}
          className={`${classes.gridRow}  py-2 px-2`}
          alignItems="end"
          justify="start"
          spacing={8}
        >
          <Typography variant="span" className={classes.rightDescription}>
            Rp {tendered}
          </Typography>
        </Grid>
        <Grid
          container
          xs={6}
          sm={6}
          className={`${classes.gridRow}  py-2 px-2`}
          alignItems="start"
          justify="start"
          spacing={30}
        >
          <Typography variant="span" className={classes.leftDescription}>
            Change:
          </Typography>
        </Grid>
        <Grid
          container
          xs={6}
          sm={6}
          className={`${classes.gridRow}  py-2 px-2`}
          alignItems="end"
          justify="start"
          spacing={8}
        >
          <Typography variant="span" className={classes.rightDescription}>
            Rp {change}
          </Typography>
        </Grid>
        <Grid
          container
          className={classes.gridRow}
          alignItems="center"
          justify="center"
          maxWidth="sm"
          spacing={8}
        >
          <Typography variant="span">{footer}</Typography>
        </Grid>
      </Grid>
    </Grid>
  </div>
);

export default withStyles(styles)(Receipt);

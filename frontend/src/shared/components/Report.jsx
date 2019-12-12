import React from "react";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const styles = {
  outterBox: {
    padding: "1rem"
  },
  gridContainer: {
    textAlign: "center",
    backgroundColor: "white",
    borderRadius: "1rem",
    border: "0.1rem solid lightGrey",
    maxWidth: "30rem"
  },
  upperBorder: {
    borderBottom: "0.05rem solid lightBlue",
    paddingTop: "1rem"
  },
  bottomBorder: {
    borderTop: "0.05rem solid lightBlue",
    paddingBottom: "1rem"
  },
  gridRow: {
    padding: "0.5rem",
    flexDirection: "column",
    padding: "1rem"
  },
  name: {
    paddingBottom: "0.5rem"
  },
  date: {
    fontWeight: "1rem"
  },
  shift: {
    fontWeight: "0.5rem"
  },
  media: {
    height: "6rem",
    width: "6rem",
    borderRadius: "0.5rem"
  },
  button: {
    minWidth: "10rem"
  },
  border: {
    width: "parent",
    borderTop: "1rem solid grey"
  }
};

const Report = ({
  classes,
  parentClasses,
  base64Image,
  name,
  currentDate,
  startOfShift,
  totalNetSales,
  transactions,
  averageValue,
  onDone
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
          xs={12}
          sm={12}
          className={classes.gridRow}
          alignItems="center"
          justify="center"
          spacing={8}
        >
          <img
            className={classes.media}
            src={`data:image/png;base64,${base64Image}`}
          />
        </Grid>
        <Grid
          container
          xs={12}
          className={classes.gridRow}
          alignItems="center"
          justify="center"
          spacing={8}
        >
          <Typography variant="h6" className={classes.name}>
            {name}
          </Typography>
          <Typography variant="subtitle1" className={classes.date}>
            {currentDate}
          </Typography>
          <Typography variant="subtitle2" className={classes.shift}>
            Shift Started at {startOfShift}
          </Typography>
        </Grid>
        <Grid
          container
          xs={11}
          sm={11}
          className={classes.upperBorder}
          spacing={0}
        />
        <Grid
          container
          xs={12}
          sm={4}
          className={classes.gridRow}
          alignItems="center"
          justify="center"
          spacing={8}
        >
          <Typography variant="h6">{totalNetSales}</Typography>
          <Typography variant="body1">Total Net Sales</Typography>
        </Grid>
        <Grid
          container
          xs={12}
          sm={4}
          className={classes.gridRow}
          alignItems="center"
          justify="center"
          spacing={8}
        >
          <Typography variant="h6">{transactions}</Typography>
          <Typography variant="body1">Transactions</Typography>
        </Grid>
        <Grid
          container
          xs={12}
          sm={4}
          className={classes.gridRow}
          alignItems="center"
          justify="center"
          spacing={8}
        >
          <Typography variant="h6">{averageValue}</Typography>
          <Typography variant="body1">Avg Order Value</Typography>
        </Grid>
        <Grid
          container
          xs={11}
          sm={11}
          className={classes.bottomBorder}
          spacing={0}
        />
        <Grid
          container
          xs={12}
          sm={12}
          className={classes.gridRow}
          alignItems="center"
          justify="center"
          spacing={8}
        >
          <Button
            variant="contained"
            className={`${classes.button} ${
              parentClasses.primaryContainedButton
            } mt-3 py-2`}
            color="primary"
            onClick={onDone}
          >
            <Typography
              variant="h5"
              component="h3"
              className={parentClasses.secondaryColor}
            >
              Done
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Grid>
  </div>
);

export default withStyles(styles)(Report);

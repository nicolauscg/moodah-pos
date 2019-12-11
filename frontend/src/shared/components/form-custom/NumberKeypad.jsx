import React, { Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";

import { Grid, Button } from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/Backspace";

const styles = theme => ({
  button: {
    backgroundColor: "#EFFAFF",
    color: "#289FD7",
    size: "large"
  }
});

function NumberKeypad(props) {
  const { classes } = props;

  return (
    <Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid item>
            <Button className={classes.button} color="#EFFAFF">
              1
            </Button>
            <Button className={classes.button}>2</Button>
            <Button className={classes.button}>3</Button>
            <Button className={classes.button}>+</Button>
          </Grid>
          <Grid item>
            <Button className={classes.button}>4</Button>
            <Button className={classes.button}>5</Button>
            <Button className={classes.button}>6</Button>
            <Button className={classes.button}>-</Button>
          </Grid>
          <Grid item>
            <Button className={classes.button}>7</Button>
            <Button className={classes.button}>8</Button>
            <Button className={classes.button}>9</Button>
            <Button className={classes.button}>×</Button>
          </Grid>
          <Grid item>
            <Button className={classes.button}>0</Button>
            <Button className={classes.button}>000</Button>
            <Button className={classes.button}>
              <DeleteIcon fontSize="small" />
            </Button>
            <Button className={classes.button}>÷</Button>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default withStyles(styles)(NumberKeypad);

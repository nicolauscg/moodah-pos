import React, { Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";

import { Grid, Button } from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/Backspace";

const styles = () => ({
  button: {
    backgroundColor: "#EFFAFF",
    color: "#289FD7",
    size: "large"
  }
});

const NumberKeypad = props => {
  const { classes, number, setNumber, maxValue } = props;
  const append = stringToAppend => () => {
    if (number === "0") {
      setNumber(stringToAppend);
    } else {
      const next = number + stringToAppend;
      if (maxValue && parseInt(next) > maxValue) {
        setNumber(maxValue.toString());
      } else {
        setNumber(next);
      }
    }
  };
  const deleteLastDigit = () => {
    if (number === "0") {
      return;
    }
    if (number.length === 1 && number !== "0") {
      setNumber("0");
    } else {
      setNumber(number.slice(0, number.length - 1));
    }
  };

  return (
    <Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid item className="d-flex">
            <Button
              className={`${classes.button} flex-grow py-3`}
              onClick={append("1")}
            >
              1
            </Button>
            <Button
              className={`${classes.button} flex-grow py-3`}
              onClick={append("2")}
            >
              2
            </Button>
            <Button
              className={`${classes.button} flex-grow py-3`}
              onClick={append("3")}
            >
              3
            </Button>
          </Grid>
          <Grid item className="d-flex">
            <Button
              className={`${classes.button} flex-grow py-3`}
              onClick={append("4")}
            >
              4
            </Button>
            <Button
              className={`${classes.button} flex-grow py-3`}
              onClick={append("5")}
            >
              5
            </Button>
            <Button
              className={`${classes.button} flex-grow py-3`}
              onClick={append("6")}
            >
              6
            </Button>
          </Grid>
          <Grid item className="d-flex">
            <Button
              className={`${classes.button} flex-grow py-3`}
              onClick={append("7")}
            >
              7
            </Button>
            <Button
              className={`${classes.button} flex-grow py-3`}
              onClick={append("8")}
            >
              8
            </Button>
            <Button
              className={`${classes.button} flex-grow py-3`}
              onClick={append("9")}
            >
              9
            </Button>
          </Grid>
          <Grid item className="d-flex">
            <Button
              className={`${classes.button} flex-grow py-3`}
              onClick={append("0")}
            >
              0
            </Button>
            <Button
              className={`${classes.button} flex-grow py-3`}
              onClick={append("000")}
            >
              000
            </Button>
            <Button
              className={`${classes.button} flex-grow py-3`}
              onClick={deleteLastDigit}
            >
              <DeleteIcon fontSize="small" />
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(NumberKeypad);

import React from "react";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button"

const styles = {
  greyBox: {
    background: "lightGrey",
    padding: "1rem"
  },
  gridContainer: {
    textAlign: "center",
    backgroundColor: "white",
    borderRadius: "1rem",
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
    backgroundColor: "lightGrey",
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

const Report = ({ classes }) => (
  <div>
    {/* <div className={classes.greyBox}> */}
    
    <Grid container className={classes.greyBox} alignItems="center" justify="center" maxWidth="sm" spacing={8}>
      <Grid container className={classes.gridContainer} alignItems="center" justify="center" maxWidth="sm" spacing={8}>
        <Grid container xs={12} sm={12} className={classes.gridRow} alignItems="center" justify="center" spacing={8}>
          <img
            className={classes.media}
            src="https://www.materialui.co/materialIcons/action/face_black_192x192.png"
          />
        </Grid>
        <Grid container xs={12} className={classes.gridRow} alignItems="center" justify="center" spacing={8}>
          <Typography variant="h6" className={classes.name}>Samuel Adi Prasetyo</Typography>
          <Typography variant="subtitle1" className={classes.date}>Thursday 24 July 2019, 09.00</Typography>
          <Typography variant="subtitle2" className={classes.shift}>
            Shift Started at 08.00AM(1:00 Hours)
          </Typography>
        </Grid>
        {/* {`${classes.card} ${className}`} */}
        {/* <Grid container className={`${classes.gridContainer} ${classes.gridBorder}`} alignItems="center" justify="center" maxWidth="sm" spacing={8}> */}
        
        <Grid container xs={11} sm={11} className={classes.upperBorder} spacing={0}/>
        <Grid container xs={12} sm={4} className={classes.gridRow} alignItems="center" justify="center" spacing={8}>
          <Typography variant="h6">2750.00</Typography>
          <Typography variant="body1">Total Net Sales</Typography>
        </Grid>
        <Grid container xs={12} sm={4} className={classes.gridRow} alignItems="center" justify="center" spacing={8}>
          <Typography variant="h6">67</Typography>
          <Typography variant="body1">Transactions</Typography>
        </Grid>
        <Grid container xs={12} sm={4} className={classes.gridRow} alignItems="center" justify="center" spacing={8}>
          <Typography variant="h6">2750.00</Typography>
          <Typography variant="body1">Avg Order Value</Typography>
        </Grid>
        <Grid container xs={11} sm={11} className={classes.bottomBorder} spacing={0}/>
        {/* </Grid> */}
        {/* <Grid container xs={11} sm={11} className={classes.gridBorder} spacing={0}>
          <hr className={classes.border}/>
        </Grid> */}
        
        <Grid container xs={12} sm={12} className={classes.gridRow} alignItems="center" justify="center" spacing={8}>
          <Button variant="contained" className={classes.button} color="primary">Done</Button>
        </Grid>
      </Grid>
    </Grid>
  </div>
);

export default withStyles(styles)(Report);

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

const Receipt = ({ classes }) => (
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
            12/11.9/2019 11:51:24 Order 00501-000-0005
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
            Moodah id
          </Typography>
          <Typography variant="span" className={classes.leftDescription}>
            Phone:
          </Typography>
          <Typography variant="span" className={classes.leftDescription}>
            User: Administrator
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
          <Typography variant="span">head</Typography>
        </Grid>
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
            Coffee
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
          <Typography variant="span">1.00</Typography>
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
            Rp 6,000.00
          </Typography>
        </Grid>
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
            Chocolate Cake
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
          <Typography variant="span">1.00</Typography>
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
            Rp 15,000.00
          </Typography>
        </Grid>
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
            Miscellaneous
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
          <Typography variant="span">1.00</Typography>
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
            Rp 18.00
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
            Rp 21,018.00
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
            Rp 21,018.00
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
            Kas (IDR)
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
            Rp 30,000.00
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
            Rp 8,982.00
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
          <Typography variant="span">foot</Typography>
        </Grid>
      </Grid>
    </Grid>
  </div>
);

export default withStyles(styles)(Receipt);

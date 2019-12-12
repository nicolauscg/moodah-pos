import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";

const styles = () => ({
  icon: {
    color: "white"
  },
  red: {
    backgroundColor: "#C55454",
    "&:hover": {
      backgroundColor: "#9d3535"
    }
  },
  sizeSmall: {
    width: "30px",
    height: "30px",
    minHeight: "30px"
  }
});

const IconButton = ({ classes, icon, onPress, red }) => {
  return (
    <Fab
      size="small"
      aria-label="remove"
      color="primary"
      className={classes.icon}
      onClick={onPress}
      classes={{ sizeSmall: classes.sizeSmall, root: red && classes.red }}
    >
      {icon}
    </Fab>
  );
};

export default withStyles(styles)(IconButton);

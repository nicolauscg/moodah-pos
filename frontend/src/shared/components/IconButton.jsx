import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";

const styles = () => ({
  icon: {
    color: "white"
  }
});

const IconButton = ({ classes, icon, onPress }) => {
  return (
    <Fab
      size="small"
      aria-label="remove"
      color="primary"
      className={classes.icon}
      onClick={onPress}
    >
      {icon}
    </Fab>
  );
};

export default withStyles(styles)(IconButton);

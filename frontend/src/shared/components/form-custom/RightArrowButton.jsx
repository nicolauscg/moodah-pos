import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

const styles = withStyles(theme => ({
      margin: {
        margin: theme.spacing(1),
      },
      extendedIcon: {
        marginRight: theme.spacing(1),
      },
}));

function RightArrowButton(props) {
  const {classes} = props;

  return (
    <div>
      <div>
        <Fab size="small" color="primary" aria-label="remove" className={classes.margin}>
          <ArrowRightAltIcon />
        </Fab>
      </div>
    </div>
  );
}

export default withStyles(styles)(RightArrowButton)
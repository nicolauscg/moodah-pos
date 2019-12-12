import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import RemoveIcon from '@material-ui/icons/Remove';

const styles = withStyles(theme => ({
      margin: {
        margin: theme.spacing(1),
      },
      extendedIcon: {
        marginRight: theme.spacing(1),
      },
}));

function MinusButton(props) {
  const {classes} = props;

  return (
    <div>
      <div>
        <Fab size="small" color="secondary" aria-label="remove" className={classes.margin}>
          <RemoveIcon />
        </Fab>
      </div>
    </div>
  );
}

export default withStyles(styles)(MinusButton)
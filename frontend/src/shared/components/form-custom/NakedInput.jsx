import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';

const styles = withStyles(theme => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

function NakedInput(props) {
  const {classes} = props;

  return (
        <InputBase
          className={classes.margin}
          defaultValue=""
          inputProps={{ 'aria-label': 'naked' }}
        />
  );

}

export default withStyles(styles)(NakedInput)
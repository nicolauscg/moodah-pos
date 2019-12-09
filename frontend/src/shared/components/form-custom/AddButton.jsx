import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';


const styles = withStyles(theme => ({
      margin: {
        margin: theme.spacing(1),
      },
      extendedIcon: {
        marginRight: theme.spacing(1),
      },
}));

function AddButton(props) {
  const {classes} = props;

  return (
    <div>
      <div>
        <Fab size="small" color="primary" aria-label="add" className={classes.margin}>
          <AddIcon />
        </Fab>
      </div>
    </div>
  );
}

export default withStyles(styles)(AddButton)

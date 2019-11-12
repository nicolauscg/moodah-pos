import React, { Component } from 'react'
import { fade, withStyles, makeStyles } from '@material-ui/core/styles'
import classnames from 'classnames'

import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import IconButton from '@material-ui/core/IconButton'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
// import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import CircularProgress from '@material-ui/core/CircularProgress'
import NumberFormat from 'react-number-format'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'

const styles = theme => ({
  labelShrink: {
    transform: 'translate(0, 1.5px) scale(1)',
  },
  inputPassword: {
    height: 'inherit',
  },
})

const stylesPOSName = theme => ({
  root: {
    border: '1px solid #e2e2e1',
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: '#fcfcfb',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover': {
      backgroundColor: '#fff',
    },
    '&$focused': {
      backgroundColor: '#fff',
     // boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
      borderColor: theme.palette.primary.main,
    },
  },
  focused: {},
});

function POSNameField(props){
	const { classes , ...others} = props;
	return <TextField  className={classes} {...props} />;
}

export default withStyles(stylesPOSName)(POSNameField)


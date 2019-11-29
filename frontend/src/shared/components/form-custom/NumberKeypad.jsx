import React, { Component, Fragment } from 'react'
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
import { MuiThemeProvider, createMuiTheme, Grid, Button } from '@material-ui/core'

const styles = theme => ({
    root: {
      color: '#4ce1b6',
    },
  })


const NumberKeypad = ({}) => 
{    
  return(
  <Fragment> 
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Grid item>
          <Button>1</Button>
          <Button>2</Button>
          <Button>3</Button>
          <Button>4</Button>
          </Grid>
        <Grid item>
          <Button>1</Button>
          <Button>2</Button>
          <Button>3</Button>
          <Button>4</Button>
        </Grid>
        <Grid item>
          <Button>1</Button>
          <Button>2</Button>
          <Button>3</Button>
          <Button>4</Button>
        </Grid>
        <Grid item>
          <Button>1</Button>
          <Button>2</Button>
          <Button>3</Button>
          <Button>4</Button>
        </Grid>
      </Grid>
    </Grid>
  </Fragment>
  )
}

export default withStyles(styles)(NumberKeypad)
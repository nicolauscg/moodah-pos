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

import DeleteIcon from '@material-ui/icons/Backspace'

const styles = theme => ({
    // root: {
    //   color: '#4ce1b6',
    // },
    button: {
      backgroundColor: '#EFFAFF', 
      color: '#289FD7', 
      size: 'large',
    },
  })


function NumberKeypad(props) {  
  const {classes} = props;  
  return(
  <Fragment> 
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Grid item>
          <Button className = {classes.button} color = "#EFFAFF">1</Button>
          <Button className = {classes.button}>2</Button>
          <Button className = {classes.button}>3</Button>
          <Button className = {classes.button}>+</Button>
          </Grid>
        <Grid item>
          <Button className = {classes.button}>4</Button>
          <Button className = {classes.button}>5</Button>
          <Button className = {classes.button}>6</Button>
          <Button className = {classes.button}>-</Button>
        </Grid>
        <Grid item>
          <Button className = {classes.button}>7</Button>
          <Button className = {classes.button}>8</Button>
          <Button className = {classes.button}>9</Button>
          <Button className = {classes.button}>×</Button>
        </Grid>
        <Grid item>
          <Button className = {classes.button}>0</Button>
          <Button className = {classes.button}>000</Button>
          <Button className = {classes.button}>
            <DeleteIcon fontSize = "small"/>
          </Button>
          <Button className = {classes.button}>÷</Button>
        </Grid>
      </Grid>
    </Grid>
  </Fragment>
  )
}

export default withStyles(styles)(NumberKeypad)
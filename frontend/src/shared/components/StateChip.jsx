import React from 'react'

import Chip from '@material-ui/core/Chip'

import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  status: {
    color: '#FFFFFF',
    height: 'unset',
    padding: '3px 5px',
    margin: 0
  },
  xs: {
    width: '100%'
  },
  s: {
    width: '60%'
  },
  m: {
    width: '50%'
  },
  l: {
    width: '40%'
  },
  xl: {
    width: '30%'
  },
  done: {
    background: '#0BBE77'
  },
  topbrand: {
    background: '#229CD6'
  },
  blue: {
    background: '#70BBFD'
  },
  orange: {
    background: '#F48240'
  },
  help: {
    background: '#E7E300'
  },
  gray: {
    background: '#D8D8D8'
  },
  greyish: {
    background: '#393E46'
  }
})

const StateChip = withStyles(styles)(({ classes, label, size, color }) => {
  const style = {
    root: `${classes.status} ${classes[size]} ${classes[color]}`
  }

  return <Chip classes={style} label={label} />
})

export default withStyles(styles)(StateChip)

import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
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

const renderNumberFormat = props => {
  const { inputRef, onChange, onFocus, ...other } = props
  const onValueChange =
    onChange &&
    (values => {
      onChange({
        target: {
          value: values.floatValue,
        },
      })
    })

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={onValueChange}
      onFocus={onFocus}
    />
  )
}

class FormInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showPassword: false,
      expanded: false,
    }
  }

  showPassword = e => {
    e.preventDefault()
    this.setState({
      showPassword: !this.state.showPassword,
    })
  }

  toggleExpansion = () => {
    this.props.onClickSelectIcon()
    this.setState({ expanded: !this.state.expanded })
  }

  render() {
    const {
      classes: classesProp,
      InputLabelProps,
      InputProps,
      inputProps,
      NumberProps,
      type,
      error,
      helperText,
      noVisible,
      onClickSelectIcon,
      loading,
      isTCell,
      className,
      ...rest
    } = this.props

    const { disabled } = rest

    const getShrinkClass = ({ shrink, ...others } = {}) => ({
      ...others,
      shrink: shrink
        ? `${shrink} ${classesProp.labelShrink}`
        : classesProp.labelShrink,
    })

    const getinputTypeClass = ({ inputType, ...others } = {}) => ({
      ...others,
      inputType: inputType
        ? `${inputType} ${classesProp.inputPassword}`
        : classesProp.inputPassword,
    })

    const getInputLabelClasses = ({ classes } = {}) => getShrinkClass(classes)
    const getInputClasses = ({ classes } = {}) => getinputTypeClass(classes)

    let TextFieldProps = {
      ...rest,
      InputLabelProps: {
        ...InputLabelProps,
        classes: getInputLabelClasses(InputLabelProps),
      },
      helperText: error && helperText,
      error,
      InputProps,
      inputProps,
      className: classnames(
        'material-form__field',
        { error: error },
        { disabled: disabled },
        { tcell: isTCell },
        className
      ),
    }

    if (NumberProps) {
      TextFieldProps = {
        ...TextFieldProps,
        InputProps: {
          ...InputProps,
          inputComponent: renderNumberFormat,
        },
        inputProps: {
          ...inputProps,
          ...NumberProps,
        },
      }
    }

    if (type) {
      let NewInputProps = {
        ...InputProps,
        classes: getInputClasses(InputProps),
      }

      switch (type.toLowerCase()) {
        case 'password':
          NewInputProps = noVisible
            ? NewInputProps
            : {
                ...NewInputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={e => this.showPassword(e)}
                      tabIndex={-1}
                    >
                      {this.state.showPassword ? (
                        <Visibility fontSize="small" />
                      ) : (
                        <VisibilityOff fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }

          TextFieldProps = {
            ...TextFieldProps,
            type: this.state.showPassword ? 'text' : 'password',
          }
          break
        case 'selection':
          NewInputProps = {
            ...NewInputProps,
            endAdornment: loading ? (
              <InputAdornment position="end">
                <CircularProgress size={20} color="inherit" />
              </InputAdornment>
            ) : (
              <InputAdornment position="end">
                <KeyboardArrowDown
                  fontSize="small"
                  onClick={
                    InputProps.disabled ? undefined : this.toggleExpansion
                  }
                  // className={`chevron${this.state.expanded ? ' rotate' : ''}`}
                  className="chevron"
                />
              </InputAdornment>
            ),
          }
          break
        default:
          break
      }

      TextFieldProps = {
        ...TextFieldProps,
        InputProps: NewInputProps,
      }
    }

    return <TextField {...TextFieldProps} />
  }
}

export default withStyles(styles)(FormInput)

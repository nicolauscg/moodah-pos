import React from 'react'
import PropTypes from 'prop-types'
import {
  DatePicker,
  InlineDatePicker,
  TimePicker,
  DateTimePicker,
} from 'material-ui-pickers'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import AccessTime from '@material-ui/icons/AccessTime'
import DateRange from '@material-ui/icons/DateRange'
import Event from '@material-ui/icons/Event'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'

import FormInput from './FormInput'

const materialTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: '#229CD6',
      },
    },
    MuiPickersCalendarHeader: {
      switchHeader: {
        // backgroundColor: lightBlue.A200,
        // color: 'white'
      },
    },
    MuiPickersDay: {
      day: {
        color: 'black',
      },
      isSelected: {
        backgroundColor: '#229CD6',

        '&:hover': {
          backgroundColor: '#33486D',
        },
      },
      current: {
        color: '#229CD6',
      },
    },
    MuiPickersYear: {
      root: {
        '&:focus': {
          color: '#229CD6',
        },
      },
    },
    MuiPickersModal: {
      dialogAction: {
        color: '#229CD6',
      },
    },
    MuiPickerDTTabs: {
      tabs: {
        backgroundColor: '#229CD6',
      },
    },
    MuiTabs: {
      indicator: {
        backgroundColor: '#e14c77',
      },
    },
    MuiPickersClock: {
      pin: {
        backgroundColor: '#229CD6',
      },
    },
    MuiPickersClockPointer: {
      pointer: {
        backgroundColor: '#229CD6',
      },
      thumb: {
        borderColor: '#229CD6',
      },
      noPoint: {
        backgroundColor: '#229CD6',
      },
    },
    MuiTypography: {
      colorPrimary: {
        color: '#229CD6',
      },
    },
    MuiModal: {
      root: {
        zIndex: 2100,
      },
    },
  },
})

const DateTimePickers = ({
  type,
  timeIcon,
  dateRangeIcon,
  showTabs,
  leftArrowIcon,
  rightArrowIcon,
  ...props
}) => {
  let Picker
  let dateTimeProps = {}

  switch (type) {
    case 'date':
      Picker = DatePicker
      dateTimeProps = {
        showTabs,
        leftArrowIcon,
        rightArrowIcon,
      }
      break
    case 'inline-date':
      Picker = InlineDatePicker
      dateTimeProps = {
        dateRangeIcon,
        showTabs,
        leftArrowIcon,
        rightArrowIcon,
      }
      break
    case 'time':
      Picker = TimePicker
      break
    default:
      Picker = DateTimePicker
      dateTimeProps = {
        timeIcon,
        dateRangeIcon,
        showTabs,
        leftArrowIcon,
        rightArrowIcon,
      }
      break
  }

  return (
    <MuiThemeProvider theme={materialTheme}>
      <Picker {...props} {...dateTimeProps} />
    </MuiThemeProvider>
  )
}

DateTimePickers.propTypes = {
  type: PropTypes.string.isRequired,
}

DateTimePickers.defaultProps = {
  type: 'datetime',
  leftArrowIcon: <KeyboardArrowLeft />,
  rightArrowIcon: <KeyboardArrowRight />,
  keyboardIcon: <Event fontSize="small" />,
  timeIcon: <AccessTime />,
  dateRangeIcon: <DateRange />,
  TextFieldComponent: FormInput,
  showTabs: false,
}

export default DateTimePickers

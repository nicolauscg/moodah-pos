import React from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import { FieldArray } from "formik";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { compose,withState } from 'recompose'

// source https://material-ui.com/components/radio-buttons/#customized-radios
const StyledRadio = withStyles({
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: '#137cbd',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3',
    },
  },
})(({classes, ...props})=>(
  <Radio
    className={classes}
    color="default"
    checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
    icon={<span className={classes.icon} />}
    {...props}
  />))

const RadioSelect = ({
  name,
  label,
  options,
  selected,
  setSelected
}) => {
  return (
    <FieldArray
      name={name}
      render={arrayHelpers => (
        <FormControl component="fieldset">
          <FormLabel component="legend">{label}</FormLabel>
          <RadioGroup defaultValue="female" aria-label="gender" name="customized-radios">
            {options.map(option => 
              <FormControlLabel
                label={option.label}
                value={option.value}
                control={
                  <StyledRadio
                    checked={selected === option.value}
                    onChange={event => {
                      arrayHelpers.pop();
                      if (event.target.checked) {
                        setSelected(option.value)
                        arrayHelpers.push(option.value);
                      }
                    }}
                  />
                }
              />
            )}
          </RadioGroup>
        </FormControl>
      )}
    />
  );
}

export default compose(
  withState('selected', 'setSelected', null),
)(RadioSelect);

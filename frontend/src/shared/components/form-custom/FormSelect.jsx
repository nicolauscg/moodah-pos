import React, { createElement } from 'react'
import PropTypes from 'prop-types'
import deburr from 'lodash/deburr'
import keycode from 'keycode'
import {
  pipe,
  findIndex,
  propEq,
  equals,
  isEmpty,
  addIndex,
  map,
  append,
  filter,
  ifElse,
  identity,
} from 'ramda'
import {
  compose,
  withHandlers,
  withPropsOnChange,
  withState,
  branch,
  renderComponent,
  withStateHandlers,
} from 'recompose'
import debounce from 'lodash/debounce'
import classnames from 'classnames'

import Downshift from 'downshift'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import Chip from '@material-ui/core/Chip'

import FormInput from './FormInput'
import Modal from './Modal'

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps

  return (
    <FormInput
      InputProps={{
        inputRef: ref,
        classes: {
          // root: classes.inputRoot,
          input: classes.inputInput,
        },
        ...InputProps,
      }}
      {...other}
    />
  )
}

function renderSuggestion({
  suggestion,
  index,
  itemProps,
  highlightedIndex,
  selectedItem,
}) {
  const isHighlighted = highlightedIndex === index
  // const isSelected = (selectedItem && selectedItem.value || '').indexOf(suggestion.value) > -1;
  const isSelected = selectedItem
    ? selectedItem.value === suggestion.value
    : false

  return (
    <MenuItem
      {...itemProps}
      className="material-form__option"
      key={suggestion.value}
      selected={isHighlighted || isSelected}
      component="div"
      style={{
        fontWeight: isSelected ? 600 : 400,
      }}
    >
      {suggestion.label}
    </MenuItem>
  )
}
renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ label: PropTypes.string, value: PropTypes.any })
    .isRequired,
}

function renderLoadMore({ fetchMore }) {
  return (
    <MenuItem
      className="material-form__option"
      key={'loadMore'}
      component="div"
      // style={{
      //   fontWeight: isSelected ? 600 : 400,
      // }}
      onClick={() => {
        if (fetchMore) {
          fetchMore()
        }
      }}
    >
      Load more
    </MenuItem>
  )
}

function renderHelp() {
  return (
    <MenuItem
      className="material-form__option disabled"
      key={'help'}
      component="div"
    >
      Opsi tidak ditemukan? Ketik untuk mencari
    </MenuItem>
  )
}

function renderAdd({ onClick }) {
  return (
    <MenuItem
      className="material-form__option add"
      key="add"
      component="div"
      onClick={onClick}
    >
      Buat Baru
    </MenuItem>
  )
}

function renderEmpty() {
  return (
    <MenuItem
      className="material-form__option disabled"
      key={'help'}
      component="div"
    >
      Opsi tidak ditemukan
    </MenuItem>
  )
}

function getSuggestions(
  value = '',
  suggestions,
  selectedItems,
  isMultiple,
  validateSuggestion
) {
  const inputValue = deburr(value.trim()).toLowerCase()

  return suggestions.filter(suggestion => {
    let keep

    if (isMultiple) {
      const selected = pipe(
        findIndex(propEq('value', suggestion.value)),
        equals(-1)
      )(selectedItems)
      if (inputValue) {
        if (selected && suggestion.label.toLowerCase().includes(inputValue)) {
          keep = true
        } else {
          keep = false
        }
      } else {
        if (selected) {
          keep = true
        } else {
          keep = false
        }
      }
    } else if (
      !inputValue ||
      suggestion.label.toLowerCase().includes(inputValue)
    ) {
      keep = true
    }

    if (keep && validateSuggestion) {
      keep = validateSuggestion(suggestion)
    }

    return keep
  })
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 20000,
    // marginTop: theme.spacing.unit,
    width: '100%',
    top: 55,
    maxHeight: 300,
    overflowY: 'auto',
  },
  paperMulti: {
    position: 'absolute',
    zIndex: 20000,
    // marginTop: theme.spacing.unit,
    minWidth: '100%',
    top: '63px',
    maxHeight: 300,
    overflowY: 'auto',
  },
  paperNoLabel: {
    position: 'absolute',
    zIndex: 2000,
    // marginTop: theme.spacing.unit,
    minWidth: '100%',
    top: '40px',
    maxHeight: 300,
    overflowY: 'auto',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    backgroundColor: '#4ce1b6',
    color: 'white',
    fontSize: '12px',
    height: `${32 - theme.spacing.unit}px`,
  },
  chipDelete: {
    fontSize: '20px',
  },
  // inputRoot: {
  //   flexWrap: 'wrap',
  // },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
})

class DownshiftMultiple extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      inputValue: '',
      selectedItem: props.selectedItem ? props.selectedItem : [],
    }
  }

  handleKeyDown = event => {
    const { inputValue, selectedItem } = this.state
    if (
      selectedItem.length &&
      !inputValue.length &&
      keycode(event) === 'backspace'
    ) {
      this.setState({
        selectedItem: selectedItem.slice(0, selectedItem.length - 1),
      })
    }
  }

  handleInputChange = event => {
    this.setState({ inputValue: event.target.value })
  }

  handleChange = item => {
    let { selectedItem } = this.state

    if (item && selectedItem.indexOf(item) === -1) {
      selectedItem = [...selectedItem, item]
    }

    this.setState(
      {
        inputValue: '',
        selectedItem,
      },
      () => {
        this.props.onChange(this.state.selectedItem)
      }
    )
  }

  handleDelete = item => () => {
    this.setState(
      state => {
        const selectedItem = [...state.selectedItem]
        selectedItem.splice(selectedItem.indexOf(item), 1)
        return { selectedItem }
      },
      () => {
        this.props.onChange(this.state.selectedItem)
      }
    )
  }

  render() {
    const {
      suggestions,
      placeholder,
      classes,
      label,
      required,
      disabled,
      isTCell,
      refetchDeb,
      resetSuggestion,
      loading,
      onFocus,
      name,
      addModalVisible,
      onClickAdd,
      toggleAdd,
      withAddButton, // must specify this props
      AddForm,
      className,
    } = this.props
    const { inputValue, selectedItem } = this.state
    const isMultiple = true
    const inputClassName = classnames(
      {
        'material-form__field': true,
        tcell: isTCell,
        disabled: disabled,
      },
      className
    )

    return (
      <Downshift
        id="downshift-multiple"
        inputValue={inputValue}
        onChange={this.handleChange}
        selectedItem={selectedItem}
        onOuterClick={resetSuggestion}
        onSelect={resetSuggestion}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue: inputValue2,
          selectedItem: selectedItem2,
          highlightedIndex,
          toggleMenu,
          clearSelection,
        }) => (
          <div className={classes.container}>
            {renderInput({
              fullWidth: true,
              classes,
              InputProps: getInputProps({
                inputProps: {
                  onClick: toggleMenu,
                },
                startAdornment: selectedItem.map(item => (
                  <Chip
                    key={item.value}
                    tabIndex={-1}
                    label={item.label}
                    className={classes.chip}
                    onDelete={this.handleDelete(item)}
                    classes={{ deleteIcon: classes.chipDelete }}
                  />
                )),
                onChange: e => {
                  this.handleInputChange(e)

                  if (e.target.value === '') {
                    clearSelection()
                    resetSuggestion()
                  } else {
                    if (refetchDeb) {
                      refetchDeb(e.target.value)
                    }
                  }
                },
                onKeyDown: this.handleKeyDown,
                disabled,
                onFocus,
                name,
                className: inputClassName,
              }),
              placeholder,
              label,
              required,
              onClickSelectIcon: toggleMenu,
              type: 'selection',
              loading,
              className: `material-form__field${isTCell ? ' tcell' : ''}`,
            })}
            {isOpen ? (
              <Paper
                className={label ? classes.paper : classes.paperNoLabel}
                square
              >
                {/* {getSuggestions(
                  inputValue2,
                  suggestions,
                  selectedItem2,
                  isMultiple
                ).map((suggestion, index) =>
                  renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: suggestion }),
                    highlightedIndex,
                    selectedItem: selectedItem2,
                    isMultiple,
                  })
                )} */}
                {isEmpty(
                  getSuggestions(
                    inputValue2,
                    suggestions,
                    selectedItem2,
                    isMultiple
                  )
                )
                  ? [
                      renderEmpty(),
                      ...(withAddButton
                        ? [renderAdd({ onClick: onClickAdd })]
                        : []),
                    ]
                  : pipe(
                      addIndex(map)((suggestion, index) =>
                        renderSuggestion({
                          suggestion,
                          index,
                          itemProps: getItemProps({ item: suggestion }),
                          highlightedIndex,
                          selectedItem: selectedItem2,
                          isMultiple,
                        })
                      ),
                      // ifElse(
                      //   always(hasMore),
                      //   append(renderLoadMore({ fetchMore })),
                      //   identity
                      // )
                      append(renderHelp())
                    )(
                      getSuggestions(
                        inputValue2,
                        suggestions,
                        selectedItem2,
                        isMultiple
                      )
                    )}
              </Paper>
            ) : null}

            {withAddButton && (
              <Modal
                isOpen={addModalVisible}
                type="form"
                toggle={toggleAdd}
                size="lg"
                title="Buat Baru"
                body={<div>{AddForm ? AddForm(toggleAdd) : <div />}</div>}
              />
            )}
          </div>
        )}
      </Downshift>
    )
  }
}

DownshiftMultiple.propTypes = {
  classes: PropTypes.object.isRequired,
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })
  ),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  itemToString: PropTypes.func,
  label: PropTypes.string,
  required: PropTypes.bool,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  validateSuggestion: PropTypes.func,
}

const FormSelect = compose(
  withState('options', 'setOptions', ({ suggestions, refetch }) =>
    refetch ? [] : suggestions
  ),
  withPropsOnChange(['suggestions'], ({ suggestions, setOptions }) =>
    setOptions(suggestions)
  ),
  withPropsOnChange(['refetch'], ({ refetch }) => ({
    refetchDeb: refetch ? debounce(refetch, 1000) : undefined,
  })),
  withPropsOnChange(['suggestions'], ({ suggestions }) => ({
    suggestions: suggestions ? suggestions : [],
  })),
  withHandlers({
    resetSuggestion: ({ refetch, setOptions, suggestions }) => () => {
      if (refetch) {
        refetch('')
      } else {
        setOptions(suggestions)
      }
    },
    filterOptions: ({ options, setOptions }) => input => {
      setOptions(
        options.filter(option => {
          if (!input || option.label.toLowerCase().includes(input)) {
            return true
          }

          return false
        })
      )
    },
  }),
  withStateHandlers(
    () => ({
      addModalVisible: false,
    }),
    {
      onClickAdd: () => () => ({ addModalVisible: true }),
      toggleAdd: state => () => ({ addModalVisible: !state.addModalVisible }),
    }
  ),
  branch(({ multiple }) => multiple, renderComponent(DownshiftMultiple))
)(props => {
  const {
    options,
    suggestions,
    filterOptions,
    placeholder,
    onChange,
    itemToString,
    classes,
    label,
    required,
    selectedItem,
    disabled,
    isTCell,
    onFocus,
    name,
    resetSuggestion,
    refetchDeb,
    loading,
    validateSuggestion,
    addModalVisible,
    onClickAdd,
    toggleAdd,
    withAddButton, // must specify this props
    AddForm,
    // fetchMore,
    // hasMore,
    className,
  } = props

  let toMap = refetchDeb ? suggestions : options
  if (validateSuggestion) {
    toMap = filter(validateSuggestion, toMap)
  }
  const inputClassName = classnames(
    {
      'material-form__field': true,
      tcell: isTCell,
      disabled: disabled,
    },
    className
  )

  return (
    <Downshift
      onChange={onChange}
      itemToString={itemToString}
      selectedItem={selectedItem}
      onOuterClick={resetSuggestion}
      onSelect={resetSuggestion}
      stateReducer={(state, changes) => {
        // if the user is opening the menu, then let's make sure
        // that the highlighted index is set to the selected index
        if (changes.hasOwnProperty('isOpen') && changes.isOpen) {
          return {
            ...changes,
            highlightedIndex: state.selectedItem
              ? findIndex(propEq('value', state.selectedItem.value), options)
              : -1,
          }
        }
        return changes
      }}
    >
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        highlightedIndex,
        isOpen,
        selectedItem,
        toggleMenu,
        clearSelection,
      }) => {
        return (
          <div className={classes.container}>
            {renderInput({
              classes,
              InputProps: getInputProps({
                inputProps: {
                  onClick: toggleMenu,
                },
                onChange: e => {
                  if (e.target.value === '') {
                    clearSelection()
                    resetSuggestion()
                  } else {
                    if (refetchDeb) {
                      refetchDeb(e.target.value)
                    } else {
                      filterOptions(e.target.value)
                    }
                  }
                },
                onFocus,
                fullWidth: true,
                placeholder,
                disabled,
                name,
              }),
              required,
              label,
              onClickSelectIcon: toggleMenu,
              type: 'selection',
              loading,
              className: inputClassName,
            })}
            <div {...getMenuProps()}>
              {isOpen ? (
                <Paper
                  className={label ? classes.paper : classes.paperNoLabel}
                  square
                >
                  {isEmpty(toMap)
                    ? [
                        renderEmpty(),
                        ...(withAddButton
                          ? [renderAdd({ onClick: onClickAdd })]
                          : []),
                      ]
                    : pipe(
                        addIndex(map)((suggestion, index) =>
                          renderSuggestion({
                            suggestion,
                            index,
                            itemProps: getItemProps({ item: suggestion }),
                            highlightedIndex,
                            selectedItem,
                          })
                        ),
                        // ifElse(
                        //   always(hasMore),
                        //   append(renderLoadMore({ fetchMore })),
                        //   identity
                        // )
                        append(renderHelp()),
                        ifElse(
                          _ => withAddButton,
                          append(renderAdd({ onClick: onClickAdd })),
                          identity
                        )
                      )(toMap)}
                </Paper>
              ) : null}
            </div>

            {withAddButton && (
              <Modal
                isOpen={addModalVisible}
                type="form"
                toggle={toggleAdd}
                size="lg"
                title="Buat Baru"
                body={<div>{AddForm ? AddForm(toggleAdd) : <div />}</div>}
              />
            )}
          </div>
        )
      }}
    </Downshift>
  )
})

FormSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })
  ),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  itemToString: PropTypes.func,
  label: PropTypes.string,
  required: PropTypes.bool,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  validateSuggestion: PropTypes.func,
}

export default withStyles(styles)(FormSelect)

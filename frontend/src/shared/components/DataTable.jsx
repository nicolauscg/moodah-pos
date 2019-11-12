import React, { Fragment } from 'react'
import {
  compose,
  withHandlers,
  withState,
  branch,
  withContext,
  getContext,
  defaultProps,
} from 'recompose'
import PropTypes from 'prop-types'
import { includes, assoc } from 'ramda'
import classnames from 'classnames'

import {
  SortingState,
  IntegratedSorting,
  PagingState,
  CustomPaging,
  EditingState,
  GroupingState,
  IntegratedGrouping,
  SelectionState,
  IntegratedSelection,
} from '@devexpress/dx-react-grid'
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  TableEditRow,
  TableEditColumn,
  TableGroupRow,
  TableSelection,
  TableBandHeader,
  TableFixedColumns,
} from '@devexpress/dx-react-grid-material-ui'
import { withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import Button from '@material-ui/core/Button'
import { Button as StrapButton } from 'reactstrap'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'

import { getValueOdooSelection } from '../../utils/transformers/general'

import Modal from './form-custom/Modal'

export const Cell = ({ value, style, formatValue, ...props }) => {
  return (
    <Table.Cell
      style={{
        color: '#393E46',
        fontFamily: 'Rubik, Roboto, sans-serif',
        ...style,
      }}
      value={formatValue ? formatValue(value, props.column) : value}
      {...props}
    />
  )
}

export const EditCell = props => {
  const { value, formatValue, renderEditComponent, ...rest } = props

  const formattedValue = formatValue ? formatValue(value, rest.column) : value

  if (renderEditComponent) {
    return renderEditComponent({
      ...props,
      value: formattedValue,
    })
  }

  return <TableEditRow.Cell value={formattedValue} {...rest} />
}

export const HeaderCell = ({ style, ...props }) => {
  return (
    <TableHeaderRow.Cell
      style={{
        fontFamily: 'Montserrat, Roboto, sans-serif',
        textTransform: 'uppercase',
        color: '#393E46',
        fontWeight: '600',
        // borderTop: '1px solid #E0E0E0',
        paddingTop: '9px',
        paddingBottom: '9px',
        ...style,
      }}
      {...props}
    />
  )
}

const styles = theme => ({
  tableCellRoot: {
    paddingLeft: '8px',
    paddingRight: '8px',
  },
  tableContainer: {
    overflow: 'unset',
  },
  tableRow: {
    '&:hover': {
      background: 'rgba(229, 229, 229, 0.5)',
    },
  },
  container: {
    position: 'relative',
    pointerEvents: 'none',
  },
  grid: {
    opacity: '0.1',
  },
  addRowCellRoot: {
    padding: '40px 0',
    textAlign: 'center',
  },
  commandBtn: {
    color: '#70bbfd',
  },
  deleteBtn: {
    color: '#E85667',
  },
})

const colorType = {
  done: {
    background: '#0BBE77',
  },
  topbrand: {
    background: '#229CD6',
  },
  blue: {
    background: '#70BBFD',
  },
  orange: {
    background: '#F48240',
  },
  help: {
    background: '#E7E300',
  },
  gray: {
    background: '#D8D8D8',
  },
  greyish: {
    background: '#393E46',
  },
}

const getColor = stateVals => {
  let state = String(stateVals).toLowerCase()
  let color = colorType['gray']

  if (
    includes(state, [
      'paid',
      'active',
      'done',
      'validated',
      'locked',
      'upselling opportunity',
      'posted',
      'running',
      'no bill to receive',
    ])
  ) {
    color = colorType['done']
  } else if (
    includes(state, [
      'open',
      'ready',
      'purchase',
      'in progress',
      'sales order',
      'fully invoiced',
      'approved',
      'repairing',
    ])
  ) {
    color = colorType['topbrand']
  } else if (includes(state, ['to approve', 'quotation sent'])) {
    color = colorType['blue']
  } else if (includes(state, ['waiting'])) {
    color = colorType['orange']
  } else if (
    includes(state, [
      'sent',
      'waiting bills',
      'waiting another operation',
      'to be approved',
      'problem diagnosed',
    ])
  ) {
    color = colorType['help']
  } else if (
    includes(state, [
      'cancel',
      'cancelled',
      'nothing to invoice',
      'rejected',
      'close',
    ])
  ) {
    color = colorType['greyish']
  }

  return color.background
}

export const EditTableCell = withStyles(styles)(props => {
  const { classes, ...rest } = props

  return (
    <TableCell
      classes={{
        root: classes.tableCellRoot,
      }}
      {...rest}
    />
  )
})

export const TableContainer = withStyles(styles)(
  ({ classes, enableHorzScroll, ...props }) => (
    <Table.Container
      {...props}
      className={classnames({ [classes.tableContainer]: !enableHorzScroll })}
    />
  )
)

const TableComponent = ({ style, loading, enableHorzScroll, ...props }) => (
  <Table.Table
    style={{
      ...style,
      ...(!enableHorzScroll ? { minWidth: 'unset' } : {}),
    }}
    className={classnames({ 'white-overlay': loading })}
    {...props}
  />
)

const RowContext = {
  row: PropTypes.object,
}

const TableRow = compose(
  withStyles(styles),
  withContext(RowContext, ({ row }) => ({
    row,
  }))
)(({ style, classes, onClickRow, ...props }) => (
  <Table.Row
    style={{
      ...style,
      cursor: props.onClick ? 'pointer' : 'default',
    }}
    className={classes.tableRow}
    onClick={() => onClickRow && onClickRow(props.row)}
    {...props}
  />
))

const NoDataCell = withStyles(styles)(({ classes, colSpan, addRow }) => {
  return (
    <TableCell classes={{ root: classes.addRowCellRoot }} colSpan={colSpan}>
      <Button
        classes={{ textPrimary: classes.commandBtn }}
        color="primary"
        onClick={addRow}
      >
        Buat Baru
      </Button>
    </TableCell>
  )
})

// const renderStubHeader = props => {
//   return <Table.Cell {...props} style={{ borderTop: '1px solid #E0E0E0' }} />
// }

const CommandButton = compose(
  withStyles(styles),
  withState('show', 'setShow', false),
  withHandlers({
    toggle: ({ show, setShow }) => () => setShow(!show),
  }),
  getContext(RowContext)
)(
  ({
    classes,
    id,
    text,
    onExecute,
    show,
    toggle,
    row,
    setCommandText,
    setDeleteContent,
  }) => {
    let btnText = text
    let deleteContent = {
      title: 'Hapus',
      message: 'Apakah Anda yakin untuk menghapus?',
    }

    if (setCommandText) {
      btnText = setCommandText(row, id, text)
    }

    if (setDeleteContent) {
      deleteContent = setDeleteContent(row)
    }

    return (
      <Fragment>
        <TableEditColumn.Command
          id={id}
          text={btnText}
          className={id === 'delete' ? classes.deleteBtn : classes.commandBtn}
          onExecute={id === 'delete' ? toggle : onExecute}
        />
        {id === 'delete' ? (
          <Modal
            type="dialog"
            title={deleteContent.title}
            body={deleteContent.message}
            action={
              <Fragment>
                <StrapButton
                  size="sm"
                  color="primary"
                  onClick={() => {
                    onExecute()
                    toggle()
                  }}
                >
                  Ya
                </StrapButton>
                <StrapButton color="danger" size="sm" onClick={toggle}>
                  Tidak
                </StrapButton>
              </Fragment>
            }
            toggle={toggle}
            isOpen={show}
            centered
          />
        ) : null}
      </Fragment>
    )
  }
)

const EditHeaderComponent = ({ children, ...props }) => (
  <TableEditColumn.HeaderCell
    {...props}
    children={children}
    // style={{ borderTop: '1px solid #E0E0E0' }}
  />
)

const GroupContent = ({ noGroupName, ...props }) => {
  if (noGroupName) {
    return (
      <span>
        <strong>{props.row.value}</strong>
      </span>
    )
  }

  return <TableGroupRow.Content {...props} />
}

const pagingPanelTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  overrides: {
    Pagination: {
      button: {
        color: 'rgba(0, 0, 0, 0.3)',
      },
      activeButton: {
        color: 'rgba(0, 0, 0, 1)',
      },
    },
    MuiIconButton: {
      root: {
        color: 'rgba(0, 0, 0, 1)',
      },
    },
  },
})

const PagingPanelComp = props => (
  <MuiThemeProvider theme={pagingPanelTheme}>
    <PagingPanel.Container {...props} />
  </MuiThemeProvider>
)

let cellIdx = 0

const DataTable = compose(
  branch(
    ({ editable, changeAddedRows }) => {
      return editable && !changeAddedRows
    },
    compose(
      withState('addedRows', 'setAddedRows', []),
      withHandlers({
        changeAddedRows: ({ setAddedRows }) => addedRows =>
          setAddedRows(addedRows),
      })
    )
  ),
  withHandlers({
    onPageChange: ({ limit, handlePageChange }) => currentPage => {
      const newOffset = limit * currentPage
      handlePageChange(newOffset)
    },
    renderCell: ({ formatValue, validateRow, noStateMarker }) => ({
      value,
      row,
      style,
      ...props
    }) => {
      const { state, active, invoiceStatus, repairState, requestState } = row

      let valid = true
      let borderLeft

      if (validateRow) {
        valid = validateRow(row)
      }

      if (
        !noStateMarker &&
        cellIdx === 0 &&
        (invoiceStatus || state || active || repairState)
      ) {
        borderLeft = `7px solid ${getColor(
          invoiceStatus || state || active || repairState
        )}`
        cellIdx = 1
      } else if (!noStateMarker && cellIdx === 0 && requestState) {
        const color = {
          draft: 'gray',
          toApprove: 'help',
          approved: 'topbrand',
          rejected: 'greyish',
          done: 'done',
        }[getValueOdooSelection(requestState)]

        borderLeft = `7px solid ${colorType[color].background}`

        cellIdx = 1
      }

      return (
        <Table.Cell
          style={{
            color: valid ? '#737373' : '#E85667',
            fontFamily: 'Rubik, Roboto, sans-serif',
            paddingTop: '9px',
            paddingBottom: '9px',
            wordBreak: 'break-word',
            borderLeft,
            ...style,
          }}
          value={formatValue ? formatValue(value, props.column, row) : value}
          {...props}
        />
      )
    },
    renderRow: ({ clickableRow, onClickRow }) => props => {
      let onClickProp = {}
      cellIdx = 0

      if (clickableRow && onClickRow) {
        onClickProp = assoc('onClick', () => onClickRow(props.row), onClickProp)
      }
      return <TableRow {...props} {...onClickProp} />
    },
    renderNoDataCell: ({ addedRows, changeAddedRows }) => props => {
      const addRow = () => changeAddedRows([...addedRows, {}])
      return addedRows.length > 0 ? null : (
        <NoDataCell {...props} addRow={addRow} />
      )
    },
    renderCommandBtn: ({ setCommandText, setDeleteContent }) => props => {
      return (
        <CommandButton
          setCommandText={setCommandText}
          setDeleteContent={setDeleteContent}
          {...props}
        />
      )
    },
    renderGroupContent: ({ noGroupName }) => props => (
      <GroupContent {...props} noGroupName={noGroupName} />
    ),
    renderTable: ({ loading, enableHorzScroll, fixedCols }) => props => (
      <TableComponent
        {...props}
        loading={loading}
        enableHorzScroll={enableHorzScroll || fixedCols ? true : false}
      />
    ),
    renderTableContainer: ({ enableHorzScroll, fixedCols }) => props => (
      <TableContainer
        {...props}
        enableHorzScroll={enableHorzScroll || fixedCols ? true : false}
      />
    ),
  }),
  defaultProps({ widthEditCol: 180 })
)(props => {
  const {
    columns,
    rows,
    defaultSorting,
    offset,
    limit,
    totalCount,
    noPagination,
    tableColumnExtensions,
    sortingColumnExtensions,
    editable,
    editingColumnExtensions,
    getRowId,
    renderEditCell,
    editingRowIds,
    changeEditingRowIds,
    onCommitChanges,
    noAddCommand,
    noDeleteCommand,
    noEditCommand,
    addedRows,
    changeAddedRows,
    rowChanges,
    changeRowChanges,
    loading,
    classes,
    onPageChange,
    renderCell,
    renderRow,
    renderNoDataCell,
    renderCommandBtn,
    grouping,
    widthEditCol,
    selectable,
    selected,
    onSelection,
    renderGroupContent,
    noHeader,
    columnBands,
    renderTable,
    fixedCols,
    renderTableContainer,
  } = props

  let currentPage = offset / limit
  let pageSize = limit

  return (
    <div className={loading ? classes.container : ''}>
      <Grid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        className={loading ? classes.grid : ''}
      >
        <SortingState defaultSorting={defaultSorting} />
        <IntegratedSorting columnExtensions={sortingColumnExtensions} />
        {editable && (
          <EditingState
            onCommitChanges={onCommitChanges}
            columnExtensions={editingColumnExtensions}
            addedRows={addedRows}
            onAddedRowsChange={changeAddedRows}
            editingRowIds={editingRowIds}
            onEditingRowIdsChange={changeEditingRowIds}
            rowChanges={rowChanges}
            onRowChangesChange={changeRowChanges}
          />
        )}
        {!noPagination && [
          <PagingState
            currentPage={currentPage}
            pageSize={pageSize}
            onCurrentPageChange={onPageChange}
            key={0}
          />,
          <CustomPaging totalCount={totalCount} key={1} />,
        ]}
        {grouping && [
          <GroupingState key={4} grouping={grouping} />,
          <IntegratedGrouping key={5} />,
        ]}
        {selectable && [
          <SelectionState
            selection={selected}
            onSelectionChange={onSelection}
            key={6}
          />,
          <IntegratedSelection key={7} />,
        ]}
        <Table
          cellComponent={renderCell}
          rowComponent={renderRow}
          // {...(clickableRow ? { rowComponent: renderRow } : {})}
          containerComponent={renderTableContainer}
          tableComponent={renderTable}
          columnExtensions={tableColumnExtensions}
          // stubHeaderCellComponent={renderStubHeader}
          {...(editable && !noAddCommand
            ? { noDataCellComponent: renderNoDataCell }
            : {})}
          messages={{
            noData: editable && addedRows.length ? '' : 'No data',
          }}
        />
        {noHeader ? null : (
          <TableHeaderRow showSortingControls cellComponent={HeaderCell} />
        )}
        {columnBands ? <TableBandHeader columnBands={columnBands} /> : null}
        {editable && [
          <TableEditRow cellComponent={renderEditCell} key={2} />,
          <TableEditColumn
            showAddCommand={noAddCommand || !rows.length ? undefined : true}
            showEditCommand={noEditCommand ? undefined : true}
            showDeleteCommand={noDeleteCommand ? undefined : true}
            commandComponent={renderCommandBtn}
            headerCellComponent={EditHeaderComponent}
            messages={{
              addCommand: 'Buat baru',
              editCommand: 'Ubah',
              deleteCommand: 'Hapus',
              commitCommand: 'Simpan',
              cancelCommand: 'Batal',
            }}
            width={widthEditCol}
            key={3}
          />,
        ]}
        {selectable && <TableSelection showSelectAll />}
        {grouping && <TableGroupRow contentComponent={renderGroupContent} />}
        {fixedCols && (
          <TableFixedColumns
            leftColumns={fixedCols.leftCols}
            rightColumns={fixedCols.rightCols}
          />
        )}
        {!noPagination && <PagingPanel containerComponent={PagingPanelComp} />}
      </Grid>
      {loading ? (
        <div className="load load__datatable">
          <div className="load__icon-wrap">
            <div className="load__gif">
              <img src="/loading.gif" alt="Loading" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
})

export default withStyles(styles)(DataTable)

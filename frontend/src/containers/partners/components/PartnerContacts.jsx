import React from 'react'
import {
  compose,
  withStateHandlers,
  withState,
  withHandlers,
  withPropsOnChange,
  getContext,
} from 'recompose'
import { connect } from 'react-redux'
import {
  isEmpty,
  mapObjIndexed,
  dissoc,
  find,
  propEq,
  forEachObjIndexed,
  has,
  isNil,
  prop,
  assoc,
} from 'ramda'
import { debounce } from 'lodash'

import { Col, Row, Card, CardBody, Container } from 'reactstrap'
import { withFormik, Form, Field } from 'formik'
import SearchIcon from 'mdi-react/SearchIcon'

import {
  ContactColumns,
  prepareContacts,
} from '../../../utils/transformers/partner'
import { ErrorHandlerContext } from '../../../utils/transformers/general'
import {
  ResPartnerContacts,
  EditResPartner,
  CreateResPartner,
} from '../../../generated-models'
import offsetToCursor from '../../../utils/offsetToCursor'
import { addNotif } from '../../../redux/modules/general'

import DataTable, { EditTableCell } from '../../../shared/components/DataTable'
import FormInput from '../../../shared/components/form-custom/FormInput'

const SearchInput = ({ field, form, handleSetValue, ...props }) => {
  const { onChange, ...restField } = field
  return (
    <input
      {...restField}
      {...props}
      onChange={e => {
        form.setFieldValue(field.name, e.target.value)

        if (handleSetValue) {
          handleSetValue(e.target.value)
        }
      }}
      type="text"
    />
  )
}

const SearchForm = ({ handleSetValue }) => {
  return (
    <Form className="search">
      <Field
        name="keyword"
        className="search-field invert"
        placeholder="Nama kontak"
        handleSetValue={handleSetValue}
        component={SearchInput}
      />
      <button className="search-btn" type="submit">
        <SearchIcon />
      </button>
    </Form>
  )
}

const FormikSearch = compose(
  withFormik({
    mapPropsToValues: ({ keyword }) => ({ keyword }),
    handleSubmit: () => {},
    enableReinitialize: true,
  }),
  withPropsOnChange(['handleSetValue'], ({ handleSetValue }) => ({
    handleSetValue: debounce(handleSetValue, 1000),
  }))
)(SearchForm)

const limit = 10

let virtualId = 0

const getRowId = row => row.id

const EditCell = props => {
  const { value, onValueChange, editingEnabled, column } = props

  const onFieldChange = e => onValueChange(e.target.value)

  return (
    <EditTableCell className="material-form">
      <FormInput
        value={value}
        onChange={onFieldChange}
        disabled={!editingEnabled}
        className="material-form__field tcell"
      />
    </EditTableCell>
  )
}

const PartnerContacts = ({
  getContacts,
  offset,
  handlePageChange,
  keyword,
  onChangeKeyword,
  contacts,
  totalCount,
  addedRows,
  changeAddedRows,
  editingRowIds,
  changeEditingRowIds,
  rowChanges,
  changeRowChanges,
  onCommitChanges,
  loadingAdd,
  loadingUpdate,
  loadingDelete,
}) => {
  const { loading } = getContacts

  const tableColumnExtensions = ContactColumns.map(col => ({
    columnName: col.name,
    wordWrapEnabled: true,
  }))

  return (
    <Card className="pb-0">
      <CardBody className="p-0">
        <Container>
          <Row className="header">
            <Col
              xs={4}
              md={4}
              className="d-flex justify-content-start align-content-center"
            >
              <h2 className="bold-text">Kontak</h2>
            </Col>
            <Col
              xs={12}
              md={{ offset: 4, size: 4 }}
              className="header__item d-flex align-items-center justify-content-end"
            >
              <FormikSearch
                keyword={keyword}
                handleSetValue={onChangeKeyword}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12}>
              <DataTable
                rows={contacts}
                columns={ContactColumns}
                totalCount={totalCount}
                offset={offset}
                limit={limit}
                handlePageChange={handlePageChange}
                tableColumnExtensions={tableColumnExtensions}
                loading={
                  loading || loadingAdd || loadingUpdate || loadingDelete
                }
                editable
                getRowId={getRowId}
                renderEditCell={EditCell}
                addedRows={addedRows}
                changeAddedRows={changeAddedRows}
                editingRowIds={editingRowIds}
                changeEditingRowIds={changeEditingRowIds}
                rowChanges={rowChanges}
                changeRowChanges={changeRowChanges}
                onCommitChanges={onCommitChanges}
                widthEditCol={180}
              />
            </Col>
          </Row>
        </Container>
      </CardBody>
    </Card>
  )
}

const enhance = compose(
  connect(
    null,
    dispatch => ({
      triggerNotif: notif => dispatch(addNotif(notif)),
    })
  ),
  withStateHandlers(
    {
      offset: 0,
      keyword: '',
    },
    {
      handlePageChange: () => offset => ({ offset }),
      onChangeKeyword: () => keyword => ({ keyword }),
    }
  ),
  ResPartnerContacts.HOC({
    options: ({ match, offset, keyword }) => ({
      variables: {
        id: match.params.id,
        limit,
        ...(offset ? { offset: offsetToCursor(offset) } : {}),
        keyword: keyword,
      },
      fetchPolicy: 'network-only',
    }),
    name: 'getContacts',
  }),
  withPropsOnChange(['getContacts'], ({ getContacts }) => {
    const { loading, resPartners } = getContacts

    if (!loading && resPartners) {
      return {
        contacts: prepareContacts(resPartners.partners),
        totalCount: resPartners.totalCount,
      }
    }

    return {
      contacts: [],
      totalCount: 0,
    }
  }),
  withState('addedRows', 'setAddedRows', []),
  withState('editingRowIds', 'setEditingRowIds', []),
  withState('rowChanges', 'setRowChanges', {}),
  withState('invalidAdded', 'setInvalidAdded', []),
  withState('invalidEdited', 'setInvalidEdited', {}),
  withState('deletedRow', 'setDeletedRow', null),
  withHandlers({
    onActionSuccess: ({
      triggerNotif,
      getContacts,
      offset,
      match,
      keyword,
    }) => data => {
      const { editResPartner, createResPartner } = data

      const refetchVariables = {
        id: match.params.id,
        limit,
        ...(offset ? { offset: offsetToCursor(offset) } : {}),
        keyword: keyword,
      }

      if (createResPartner) {
        getContacts.refetch(refetchVariables).then(() =>
          triggerNotif({
            message: `${createResPartner.name} berhasil ditambahkan`,
            type: 'success',
          })
        )
        // triggerNotif({
        //   message: `${createResPartner.name} berhasil ditambahkan`,
        //   type: 'success',
        // })
      }

      if (editResPartner) {
        getContacts.refetch(refetchVariables).then(() =>
          triggerNotif({
            message: `${editResPartner.name} berhasil diubah`,
            type: 'success',
          })
        )
        // triggerNotif({
        //   message: `${editResPartner.name} berhasil diubah`,
        //   type: 'success',
        // })
      }
    },
    onDeleteSuccess: ({
      triggerNotif,
      deletedRow,
      setDeletedRow,
      getContacts,
      offset,
      match,
      keyword,
    }) => () => {
      const refetchVariables = {
        id: match.params.id,
        limit,
        ...(offset ? { offset: offsetToCursor(offset) } : {}),
        keyword: keyword,
      }

      getContacts.refetch(refetchVariables).then(() => {
        triggerNotif({
          message: `${deletedRow.name} berhasil dihapus`,
          type: 'success',
        })
        setDeletedRow(null)
      })
    },
    refetchQueries: ({ match, offset, keyword }) => () => [
      {
        query: ResPartnerContacts.Document,
        variables: {
          id: match.params.id,
          limit,
          ...(offset ? { offset: offsetToCursor(offset) } : {}),
          keyword: keyword,
        },
      },
    ],
  }),
  getContext(ErrorHandlerContext),
  WrappedComp => props => (
    <CreateResPartner.Component
      onCompleted={props.onActionSuccess}
      onError={props.onError}
    >
      {(addPartner, { loading }) => (
        <WrappedComp addPartner={addPartner} loadingAdd={loading} {...props} />
      )}
    </CreateResPartner.Component>
  ),
  WrappedComp => props => (
    <EditResPartner.Component
      onCompleted={props.onActionSuccess}
      onError={props.onError}
    >
      {(updatePartner, { loading }) => (
        <WrappedComp
          updatePartner={updatePartner}
          loadingUpdate={loading}
          {...props}
        />
      )}
    </EditResPartner.Component>
  ),
  WrappedComp => ({ onDeleteSuccess, refetchQueries, ...props }) => (
    <EditResPartner.Component
      onCompleted={onDeleteSuccess}
      onError={props.onError}
    >
      {(deletePartner, { loading }) => (
        <WrappedComp
          deletePartner={deletePartner}
          loadingDelete={loading}
          {...props}
        />
      )}
    </EditResPartner.Component>
  ),
  withHandlers({
    changeAddedRows: ({
      invalidAdded,
      setAddedRows,
      setInvalidAdded,
      match,
    }) => addedRows => {
      if (invalidAdded.length) {
        setInvalidAdded([])
      } else {
        const newAddedRows = addedRows.map(row => {
          if (Object.keys(row).length) {
            return row
          }

          return {
            name: '',
            email: '',
            function: '',
            phone: '',
            type: 'contact',
            parentId: match.params.id,
            purchaseWarn: 'noMessage',
            saleWarn: 'noMessage',
            invoiceWarn: 'noMessage',
            pickingWarn: 'noMessage',
            id: `virtual_${virtualId++}`,
          }
        })
        setAddedRows(newAddedRows)
      }
    },
    changeEditingRowIds: ({
      invalidEdited,
      setEditingRowIds,
    }) => editingRowIds => {
      if (!invalidEdited.length) {
        setEditingRowIds(editingRowIds)
      }
    },
    changeRowChanges: ({
      invalidEdited,
      setInvalidEdited,
      setRowChanges,
    }) => rowChanges => {
      let newRowChanges = rowChanges

      if (!isEmpty(invalidEdited)) {
        newRowChanges = mapObjIndexed((_, key, obj) => {
          return obj[key]
        })(invalidEdited)

        setInvalidEdited([])
      }

      setRowChanges(newRowChanges)
    },
    onCommitChanges: ({
      invalidAdded,
      triggerNotif,
      setInvalidAdded,
      setInvalidEdited,
      contacts,
      addPartner,
      updatePartner,
      deletePartner,
      setDeletedRow,
    }) => ({ added, changed, deleted }) => {
      if (added) {
        if (added[0].name) {
          addPartner({
            variables: { vals: dissoc('id', added[0]) },
          })
        } else {
          triggerNotif({
            message: 'Mohon lengkapi kolom Nama',
            type: 'warning',
          })

          setInvalidAdded([...invalidAdded, ...added])
        }
      }

      if (deleted) {
        const currentRow = find(propEq('id', deleted[0]))(contacts)

        setDeletedRow(currentRow)
        deletePartner({
          variables: {
            vals: {
              id: deleted[0],
              active: false,
            },
          },
        })
      }

      if (changed) {
        let invalidEdited = {}
        let updatedRow

        forEachObjIndexed((value, key) => {
          const currentRow = find(propEq('id', key))(contacts)

          if (value) {
            if (has('name')(value) && isNil(prop('name', value))) {
              triggerNotif({
                message: 'Mohon lengkapi kolom Nama',
                type: 'warning',
              })

              invalidEdited = assoc(key, value)
            }

            updatedRow = {
              ...currentRow,
              ...value,
            }
          } else {
            updatedRow = currentRow
          }
        })(changed)

        if (isEmpty(invalidEdited)) {
          updatePartner({
            variables: { vals: dissoc('__typename', updatedRow) },
          })
        } else {
          setInvalidEdited(invalidEdited)
        }
      }
    },
  })
)

export default enhance(PartnerContacts)

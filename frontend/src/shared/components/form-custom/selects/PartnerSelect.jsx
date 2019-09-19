import React from 'react'

import DynamicSelect from '../DynamicSelect'
import { CreatePartnerForm } from '../../../../containers/partners/CreatePartner'
import { toSuggestion } from '../../../../utils/transformers/general'

export default class extends React.Component {
  AddForm = toggleVisibility => {
    return (
      <CreatePartnerForm
        hideHelp
        onCreateSuccess={data => {
          this.props.onAdd &&
            this.props.onAdd(
              this.props.field,
              toSuggestion(data.createResPartner)
            )
          toggleVisibility()
          this.props.refetch && this.props.refetch('')
        }}
      />
    )
  }

  render() {
    return (
      <DynamicSelect {...this.props} withAddButton AddForm={this.AddForm} />
    )
  }
}

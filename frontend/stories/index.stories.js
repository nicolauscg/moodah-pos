import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'

import CreatePartnerForm from './CreatePartner'
import FormSelectStory from './FormSelectStory'
import DateTimePickersStory from './DateTimePickersStory'
import DataTableStory from './DataTableStory'
import ModalStory from './ModalStory'
import ChartFilterStory from './ChartFilterStory'
import ChartDatePickerStory from './ChartDatePickerStory'

storiesOf('Create Partner Form', module).add('Default', () => (
  <CreatePartnerForm />
))

storiesOf('Components', module)
  .add('Select', () => <FormSelectStory />)
  .add('Date/Time Pickers', () => <DateTimePickersStory />)
  .add('Data Table', () => <DataTableStory />)
  .add('Modal', () => <ModalStory />)
  .add('Chart Filter', () => <ChartFilterStory />)
  .add('Chart Picker', () => <ChartDatePickerStory />)

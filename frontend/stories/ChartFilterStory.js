import React from 'react'
import Grid from '@material-ui/core/Grid'
import { Row, Container } from 'reactstrap'

import Panel from '../src/shared/components/Panel'
import ChartFilter from '../src/shared/components/ChartFilter'

const countries = [
  { label: 'Afghanistan', value: 'Afghanistan' },
  { label: 'Australia', value: 'Australia' },
  { label: 'Austria', value: 'Austria' },
  { label: 'Azerbaijan', value: 'Azerbaijan' },
  { label: 'Belgium', value: 'Belgium' },
  {
    label: 'Bolivia, Plurinational State of',
    value: 'Bolivia, Plurinational State of',
  },
  {
    label: 'Bonaire, Sint Eustatius and Saba',
    value: 'Bonaire, Sint Eustatius and Saba',
  },
  { label: 'Brazil', value: 'Brazil' },
  { label: 'Brunei Darussalam', value: 'Brunei Darussalam' },
]

const FormSelectStory = props => (
  <Container>
    <Row>
      <Panel xs={12} md={6}>
        <Grid container spacing={8} className="material-form">
          <Grid item xs={12}>
            <ChartFilter
              defaultValue={countries[0]}
              isDisabled={false}
              isLoading={false}
              name="Country"
              options={countries}
            />
          </Grid>
        </Grid>
      </Panel>
    </Row>
  </Container>
)

export default FormSelectStory

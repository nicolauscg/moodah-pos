import React from 'react'
import Grid from '@material-ui/core/Grid'
import { Row, Container } from 'reactstrap'

import Panel from '../src/shared/components/Panel'
import ChartDatePicker from '../src/shared/components/ChartDatePicker'

const DateTimePickersStory = () => (
  <Container>
    <Row>
      <Panel xs={12} md={6}>
        <Grid container spacing={8} className="material-form">
          <Grid item xs={12}>
            <ChartDatePicker type="date" label="Date" />
          </Grid>
        </Grid>
      </Panel>
    </Row>
  </Container>
)

export default DateTimePickersStory

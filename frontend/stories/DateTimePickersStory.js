import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Row, Container } from 'reactstrap';

import Panel from '../src/shared/components/Panel';
import DateTimePicker from '../src/shared/components/form-custom/DateTimePicker';

const DateTimePickersStory = (props) => (
  <Container>
    <Row>
      <Panel xs={12} md={6}>
        <Grid container spacing={8} className="material-form">
          <Grid item xs={12}>
            <DateTimePicker type="date" label="Date" />
          </Grid>
          <Grid item xs={12}>
            <DateTimePicker type="time" label="Time" />
          </Grid>
          <Grid item xs={12}>
            <DateTimePicker type="datetime" label="Date & Time" showTabs />
          </Grid>
        </Grid>
      </Panel>
    </Row>
  </Container>
);

export default DateTimePickersStory;

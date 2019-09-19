import React from 'react';
import {
  SortingState,
  GroupingState,
  IntegratedSorting,
  IntegratedGrouping,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableGroupRow,
  Toolbar,
  GroupingPanel,
  DragDropProvider
} from '@devexpress/dx-react-grid-material-ui';
import { Container, Row } from 'reactstrap';

import Panel from '../src/shared/components/Panel';

const tableData = {
  columns: [
    { name: 'name', title: 'Name' },
    { name: 'sex', title: 'Sex' },
    { name: 'city', title: 'City' },
    { name: 'car', title: 'Car' },
  ],
  rows: [
    { sex: 'Female', name: 'Sandra', city: 'Las Vegas', car: 'Audi A4' },
    { sex: 'Male', name: 'Paul', city: 'Paris', car: 'Nissan Altima' },
    { sex: 'Male', name: 'Mark', city: 'Paris', car: 'Honda Accord' },
    { sex: 'Male', name: 'Paul', city: 'Paris', car: 'Nissan Altima' },
    { sex: 'Female', name: 'Linda', city: 'Austin', car: 'Toyota Corolla' },
    { sex: 'Male', name: 'Robert', city: 'Las Vegas', car: 'Chevrolet Cruze' },
    { sex: 'Female', name: 'Lisa', city: 'London', car: 'BMW 750' },
    { sex: 'Male', name: 'Mark', city: 'Chicago', car: 'Toyota Corolla' },
    { sex: 'Male', name: 'Thomas', city: 'Rio de Janeiro', car: 'Honda Accord' },
    { sex: 'Male', name: 'Robert', city: 'Las Vegas', car: 'Honda Civic' },
    { sex: 'Female', name: 'Betty', city: 'Paris', car: 'Honda Civic' },
    { sex: 'Male', name: 'Robert', city: 'Los Angeles', car: 'Honda Accord' },
    { sex: 'Male', name: 'William', city: 'Los Angeles', car: 'Honda Civic' },
    { sex: 'Male', name: 'Mark', city: 'Austin', car: 'Nissan Altima' },
  ],
}

const MaterialTable = (props) => {
  const { columns, rows } = tableData;
  return (
    <Container>
      <Row>
        <Panel xs={12} md={10}>
          <Grid
            rows={rows}
            columns={columns}
          >
            <DragDropProvider />
            <SortingState
              defaultSorting={[{ columnName: 'name', direction: 'asc' }]}
            />
            <GroupingState
              defaultGrouping={[{ columnName: 'name' }]}
            />
            <IntegratedSorting />
            <IntegratedGrouping />
            <Table />
            <TableHeaderRow showSortingControls showGroupingControls />
            <TableGroupRow />
            <Toolbar />
            <GroupingPanel showSortingControls showGroupingControls />
          </Grid>
        </Panel>
      </Row>
    </Container>
  )
};

export default MaterialTable;

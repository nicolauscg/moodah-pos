import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import NotificationSystem from 'rc-notification';

import { Row, Container, Button, ButtonToolbar } from 'reactstrap'
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';

import Panel from '../src/shared/components/Panel';
import { FullWideNotification } from '../src/shared/components/Notification';
import FormSelect from '../src/shared/components/form-custom/FormSelect';
import FormInput from '../src/shared/components/form-custom/FormInput';
import FormCheckbox from '../src/shared/components/form-custom/FormCheckbox';

const partnerTypes = [
  {
    label: 'Individual',
    value: 'individual'
  },
  {
    label: 'Company',
    value: 'company'
  },
];

const styles = theme => ({
  checkboxChecked: {
    color: '#4ce1b6',
  },
  checkboxLabel: {
    color: '#646777',
    fontSize: '12px'
  }
})

const validatePattern = (event, onChange) => {
  if (event.target.validity.valid) {
    if (onChange) {
      onChange(event)
    }
  }
};

let notification = null;

class CreatePartnerForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      nameError: false,
      phone: '',
      phoneError: false,
    };
  }

  onChangeName = (e) => {
    this.setState({
      name: e.target.value,
      nameError: e.target.value.length > 0 && e.target.value.length < 3,
    })
  }

  onChangePhone = (e) => {
    this.setState({
      phone: e.target.value,
      phoneError: e.target.value.length < 3,
    })
  }

  showNotif = () => {
    notification.notice({
      content: (
        <FullWideNotification
          color="primary"
          message="Please input all fields!"
        />
      ),
      duration: 5,
      closable: true,
      style: { top: 0, left: 0 },
      className: 'full'
    })
  }

  componentDidMount() {
    NotificationSystem.newInstance({ style: { top: '0px' } }, n => notification = n);
  }

  componentWillUnmount() {
    notification.destroy();
  }

  render() {
    const { classes } = this.props;

    return (
      <Container>
        <Row>
          <Panel xs={12} md={6}>
            <form className="material-form">
              <FormInput required label="Name" value={this.state.name} onChange={this.onChangeName} error={this.state.nameError} helperText="Name must be at least 3 characters" InputLabelProps={{ classes: { shrink: classes.checkboxChecked } }} />
              <FormSelect
                suggestions={partnerTypes}
                onChange={selectedItem => console.log(selectedItem.value)}
                itemToString={item => item ? item.label : ''}
                placeholder="Type"
                label="Type"
                required
              />
              <FormGroup>
                <FormLabel>
                  Relationship
                </FormLabel>
                <FormGroup row>
                  <FormCheckbox
                    FormLabelProps={{ label: 'Customer' }}
                  />
                  <FormCheckbox
                    FormLabelProps={{ label: 'Vendor' }}
                  />
                </FormGroup>
              </FormGroup>
              <FormInput
                inputProps={{ pattern: '[0-9]*' }}
                onChange={e => validatePattern(e, this.onChangePhone)}
                label="Phone"
                value={this.state.phone}
              />
              <FormInput label="Email" placeholder="Email" />
              <Grid container spacing={8}>
                <Grid item xs={12}>
                  <FormInput placeholder="Street" label="Street" />
                </Grid>
                <Grid item xs={6}>
                  <FormSelect
                    suggestions={partnerTypes}
                    onChange={selectedItem => console.log(selectedItem.value)}
                    itemToString={item => item ? item.label : ''}
                    placeholder="City"
                    label="City"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormSelect
                    suggestions={partnerTypes}
                    onChange={selectedItem => console.log(selectedItem.value)}
                    itemToString={item => item ? item.label : ''}
                    placeholder="Province"
                    label="Province"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormInput placeholder="Zip" label="Zip" />
                </Grid>
              </Grid>
              <ButtonToolbar className="form__button-toolbar">
                <Button color="primary" onClick={this.showNotif}>Submit</Button>
                <Button type="button">
                  Cancel
                </Button>
              </ButtonToolbar>
            </form>
          </Panel>
        </Row>
      </Container>
    )
  }
}

export default withStyles(styles)(CreatePartnerForm);

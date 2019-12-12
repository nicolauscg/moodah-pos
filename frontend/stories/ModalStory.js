import React, { Fragment } from 'react';

import { Container, Row, Button, ButtonToolbar } from 'reactstrap';

import Panel from '../src/shared/components/Panel';
import Modal from '../src/shared/components/form-custom/Modal';

export class ModalStory extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
  };

  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  render() {
    return (
      <Container>
        <Row>
          <Panel xs={12} md={6}>
            <ButtonToolbar>
              <Button onClick={this.toggleModal} color="primary">
                Show
              </Button>
              <Modal
                color="primary"
                title="Congratulations!"
                message="Expect warmly its tended garden him esteem had remove off. Effects dearest staying
                       now sixteen nor improve."
                toggle={this.toggleModal}
                isOpen={this.state.isOpen}
                size="md"
                footer={(
                  <Fragment>
                    <Button onClick={this.toggleModal} color="primary">
                      Okay
                    </Button>
                    <Button onClick={this.toggleModal}>
                      Cancel
                    </Button>
                  </Fragment>
                )}
              />
            </ButtonToolbar>
          </Panel>
        </Row>
      </Container>
    );
  };
};

export default ModalStory;

import React, { PureComponent } from 'react';

import { Container, Row, Col, Card, CardBody, Modal } from 'reactstrap';
import CloseIcon from 'mdi-react/CloseIcon';
import { Link } from 'react-router-dom';
import YouTube from 'react-youtube';

class PartnerListHelp extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      openVideo: false,
    };
  }

  toggleOpen = () => {
    this.setState({
      openVideo: !this.state.openVideo,
    })
  }

  render() {
    return (
      <Container>
        <Row>
          <Col xs={12} className="pt-4">
            <Card className="partners__list-help">
              <CardBody>
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <button className="panel__btn">
                    <CloseIcon size={20} color="white" />
                  </button>
                </div>
                <Container>
                  <Row>
                    <Col xs={12} md={6}>
                      <h5 className="bold-text">
                        Manage your suppliers and customers
                      </h5>
                      <p>
                        Direction has strangers now believing. Respect enjoyed gay far exposed parlors towards. Enjoyment use tolerably dependent listening men. No peculiar in handsome together unlocked do by. Article concern joy anxious did picture sir her. Although desirous not recurred disposed off shy you numerous securing.
                      </p>
                      <Link
                        to={{
                          pathname: '/partners/create',
                          state: {
                            activeTab: this.props.activeTab,
                          },
                        }}
                        className="btn btn-primary btn-sm mt-3"
                      >
                        Add Partner
                      </Link>
                    </Col>
                    <Col xs={12} md={5}>
                      <Card>
                        <CardBody className="help-video">
                          <Row>
                            <Col xs={12} md={6}>
                              <h5 className="bold-text">NEED HELP?</h5>
                              <ul className="list list--icon mt-3">
                                <li><p><span className="lnr lnr-book" />Read our support articles</p></li>
                              </ul>
                            </Col>
                            <Col xs={12} md={6}>
                              <div className="youtube__wrapper">
                                <img
                                  className="youtube__thumbnail"
                                  src={`//img.youtube.com/vi/2gtS8r4jXdM/sddefault.jpg`}
                                  alt="thumbnail"
                                />
                                <button tabIndex="-1" className="youtube__play" onClick={this.toggleOpen} />
                                <Modal isOpen={this.state.openVideo} toggle={this.toggleOpen} centered size="lg" contentClassName="youtube__modal-content">
                                  <button className="youtube__close-btn" onClick={this.toggleOpen}><CloseIcon size={24} color="white" /></button>
                                  <div className="embed-responsive embed-responsive-16by9">
                                    <YouTube
                                      className="embed-responsive-item"
                                      videoId="2gtS8r4jXdM"
                                    />
                                  </div>
                                </Modal>
                              </div>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Container>
              </CardBody>
            </Card>

          </Col>
        </Row>
      </Container>
    );
  }
}

export default PartnerListHelp;

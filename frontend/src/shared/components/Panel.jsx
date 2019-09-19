/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react'
import { Badge, Card, CardBody, Col, Collapse } from 'reactstrap'
import PropTypes from 'prop-types'

import CloseIcon from 'mdi-react/CloseIcon'
import AutorenewIcon from 'mdi-react/AutorenewIcon'
import LoadingIcon from 'mdi-react/LoadingIcon'
import ChevronDownIcon from 'mdi-react/ChevronDownIcon'
import ChevronUpIcon from 'mdi-react/ChevronUpIcon'

const LightBulb = `${process.env.PUBLIC_URL}/img/light-bulb.svg`

export default class AlertComponent extends PureComponent {
  static propTypes = {
    divider: PropTypes.bool,
    color: PropTypes.string,
    title: PropTypes.string,
    subhead: PropTypes.string,
    label: PropTypes.string,
    icon: PropTypes.string,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number,
    sm: PropTypes.number,
    xs: PropTypes.number,
    expand: PropTypes.bool,
    refresh: PropTypes.bool,
    dismiss: PropTypes.bool,
    isForm: PropTypes.bool,
    isHint: PropTypes.bool,
    isDashboard: PropTypes.bool,
  }

  static defaultProps = {
    divider: false,
    color: '',
    title: '',
    subhead: '',
    label: '',
    icon: '',
    md: 0,
    lg: 0,
    xl: 0,
    sm: 0,
    xs: 0,
    expand: true,
    refresh: false,
    dismiss: false,
    isForm: false,
    isHint: false,
    isDashboard: false,
  }

  constructor(props) {
    super(props)

    this.state = {
      visible: true,
      collapse: true,
      refresh: false,
    }
  }

  onShow = () => {
    this.setState({ visible: true })
  }

  onDismiss = () => {
    this.setState({ visible: false })
  }

  onCollapse = () => {
    this.setState({ collapse: !this.state.collapse })
  }

  onRefresh = () => {
    // your async logic here
    this.setState({ refresh: !this.state.refresh })
    setTimeout(() => this.setState({ refresh: false }), 5000)
  }

  render() {
    const {
      md,
      lg,
      xl,
      sm,
      xs,
      color,
      divider,
      icon,
      title,
      label,
      subhead,
      expand,
      refresh,
      dismiss,
      isForm,
      isHint,
      isDashboard,
    } = this.props

    if (this.state.visible) {
      return (
        <Col md={md} lg={lg} xl={xl} sm={sm} xs={xs}>
          <Card
            className={`panel${this.props.color ? ` panel--${color}` : ''}
            ${divider ? ' panel--divider' : ''}${
              this.state.collapse ? '' : ' panel--collapse'
            }${isForm ? ' panel__form' : ''}
            ${isHint ? ' panel__hint' : ''}${
              isDashboard ? ' panel__dashboard' : ''
            }`}
          >
            <CardBody className="panel__body">
              {this.state.refresh ? (
                <div className="panel__refresh">
                  <LoadingIcon />
                </div>
              ) : (
                ''
              )}
              {isHint && (
                <img alt="light-bulb" src={LightBulb} className="hint-icon" />
              )}
              <div className="panel__btns">
                {expand && (
                  <button
                    className="panel__btn"
                    onClick={this.onCollapse}
                    style={{ marginRight: '2px' }}
                  >
                    {this.state.collapse ? (
                      <ChevronUpIcon size={isForm || isDashboard ? 24 : 18} />
                    ) : (
                      <ChevronDownIcon size={isForm || isDashboard ? 24 : 18} />
                    )}
                  </button>
                )}
                {refresh && (
                  <button className="panel__btn" onClick={this.onRefresh}>
                    <AutorenewIcon size={14} />
                  </button>
                )}
                {dismiss && (
                  <button className="panel__btn" onClick={this.onDismiss}>
                    <CloseIcon size={14} />
                  </button>
                )}
              </div>
              <div className="panel__title">
                <h5 className="bold-text">
                  {icon ? (
                    <span className={`panel__icon lnr lnr-${icon}`} />
                  ) : (
                    ''
                  )}
                  {title}
                  <Badge className="panel__label">{label}</Badge>
                </h5>
                {isDashboard ? null : <h5 className="subhead">{subhead}</h5>}
              </div>
              <Collapse isOpen={this.state.collapse}>
                <div className="panel__content">{this.props.children}</div>
              </Collapse>
            </CardBody>
          </Card>
        </Col>
      )
    }

    return ''
  }
}

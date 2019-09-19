/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

const CircleCheck = `${process.env.PUBLIC_URL}/img/circle-check.svg`
const CircleCross = `${process.env.PUBLIC_URL}/img/circle-cross.svg`
const CircleExclamation = `${process.env.PUBLIC_URL}/img/circle-exclamation.svg`

export class BasicNotification extends PureComponent {
  static propTypes = {
    color: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string.isRequired,
  }

  static defaultProps = {
    color: '',
    title: '',
  }

  render() {
    const { color, title, message } = this.props

    return (
      <div className={`notification notification--${color}`}>
        <h5 className="notification__title bold-text">{title}</h5>
        <p className="notification__message">{message}</p>
      </div>
    )
  }
}

export class ImageNotification extends PureComponent {
  static propTypes = {
    img: PropTypes.string.isRequired,
    title: PropTypes.string,
    message: PropTypes.string.isRequired,
  }

  static defaultProps = {
    title: '',
  }

  render() {
    const { img, title, message } = this.props

    return (
      <div className="notification notification--image">
        <div className="notification__image">
          <img src={img} alt="" />
        </div>
        <h5 className="notification__title bold-text">{title}</h5>
        <p className="notification__message">{message}</p>
      </div>
    )
  }
}

export class FullWideNotification extends PureComponent {
  static propTypes = {
    color: PropTypes.string,
    message: PropTypes.string.isRequired,
  }

  static defaultProps = {
    color: '',
  }

  renderIcon = color => {
    switch (color) {
      case 'success':
        return <img src={CircleCheck} alt="success" />
      case 'danger':
        return <img src={CircleCross} alt="danger" />
      default:
        return <img src={CircleExclamation} alt="warning" />
    }
  }

  render() {
    const { color, message } = this.props

    return (
      <div
        className={`notification notification--full-wide notification--${color} d-flex justify-content-center align-items-center`}
      >
        <div className="icon-wrapper mr-2">{this.renderIcon(color)}</div>
        <p className="notification__message">{message}</p>
      </div>
    )
  }
}

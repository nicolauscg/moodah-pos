import React from 'react'

import { Button } from 'reactstrap'
import FA from 'react-fontawesome'

const ActionButton = ({ isLoading, onClick, label, color, ...props }) => (
  <Button
    outline
    size="sm"
    className={`${color} ${isLoading ? 'loading' : ''}`}
    onClick={onClick}
    {...props}
  >
    {label}
    {isLoading && <FA name="circle-o-notch" spin className="spinner" />}
  </Button>
)

export default ActionButton

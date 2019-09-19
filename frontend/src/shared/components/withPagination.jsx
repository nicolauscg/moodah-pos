import React from 'react'
import { compose, withStateHandlers } from 'recompose'
import { objOf } from 'ramda'
import offsetToCursor from '../../utils/offsetToCursor'

export default compose(
  withStateHandlers(
    { offset: 0, limit: 10 },
    { setOffset: _ => objOf('offset') }
  )
)
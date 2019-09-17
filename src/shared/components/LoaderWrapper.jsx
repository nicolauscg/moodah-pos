import React from 'react'
import BlockUi from 'react-block-ui'

export default ({ isLoading, children }) => (
  <BlockUi
    blocking={isLoading}
    loader={
      <div className="load__gif">
        <img src="/loading.gif" alt="Loading" />
      </div>
    }
    keepInView
  >
    {children}
  </BlockUi>
)

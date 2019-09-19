import React from 'react'
import { connect } from 'react-redux'

const Loader = ({ invisible, page, sidebar }) => (
  <div
    className={`load${page ? '' : ' load__content'}${
      invisible ? ' invisible' : ''
    }${page ? ' load__page' : ''}${sidebar.collapse ? ' collapsed' : ''}`}
  >
    <div className="load__icon-wrap">
      {/* <svg className='load__icon'>
        <path fill='#4ce1b6' d='M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z' />
      </svg> */}
      <div className={`load__gif${page ? ' app' : ''}`}>
        <img src="/loading.gif" alt="Loading" />
      </div>
    </div>
  </div>
)

export default connect(state => ({
  sidebar: state.sidebar,
}))(Loader)

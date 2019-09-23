import React from 'react'
import PropTypes from 'prop-types'

import { Breadcrumb, BreadcrumbItem } from 'reactstrap'
import { Link } from 'react-router-dom'

const BreadcrumbComponent = ({ crumbs }) => {
  return <Breadcrumb>
    {
      crumbs.map((crumb, i) => {
        if (i === (crumbs.length - 1)) {
          return <BreadcrumbItem key={i} active>
            <span>{crumb.text}</span>
          </BreadcrumbItem> 
        }

        return <BreadcrumbItem key={i}>
          <Link to={crumb.path}>
            {crumb.text}
          </Link>
        </BreadcrumbItem>
      })
    }
  </Breadcrumb>
}

BreadcrumbComponent.propTypes = {
  crumbs: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    path: PropTypes.string,
  })),
}

export default BreadcrumbComponent

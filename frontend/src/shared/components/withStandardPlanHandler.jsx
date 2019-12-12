import React from 'react'
import {
  compose,
  getContext,
  branch,
  renderComponent,
  withPropsOnChange,
} from 'recompose'
import { withRouter } from 'react-router'
import { pathOr, includes } from 'ramda'

import { Button } from 'reactstrap'

import {
  UserInfoContext,
  ProOnlyFeatures,
} from '../../utils/transformers/general'

const ProOnlyPage = ({ featureName }) => {
  return (
    <div className="pro-only">
      <div>
        <div className="img-wrapper mb-5">
          <img
            src={`${process.env.PUBLIC_URL}/img/icon-upgrade.svg`}
            alt="upgrade"
          />
        </div>
        <h3 align="center">
          Fitur <b>{featureName}</b> hanya tersedia untuk user plan Professional
          ke atas.
        </h3>
        <h3 align="center">Upgrade user plan Anda sekarang.</h3>
        <div className="btn-wrapper">
          <Button
            onClick={() => window.open('http://admin.moodah.id', '_blank')}
            color="success"
            className="mt-4"
            size="lg"
          >
            Ke Moodah Billing
          </Button>
        </div>
      </div>
    </div>
  )
}

export default compose(
  withRouter,
  getContext(UserInfoContext),
  withPropsOnChange(['match'], ({ match }) => {
    let showProOnly = false
    let featureName = ''

    ProOnlyFeatures.forEach(item => {
      const { path, feature } = item

      if (includes(path, pathOr('', ['path'], match))) {
        showProOnly = true
        featureName = feature
      }
    })

    return { showProOnly, featureName }
  }),
  branch(({ isStandardPlan, showProOnly }) => {
    return isStandardPlan && showProOnly
  }, renderComponent(ProOnlyPage))
)

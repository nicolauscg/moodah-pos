import React, { Fragment } from 'react'
import { Route, Switch } from 'react-router-dom'
import { compose, withHandlers } from 'recompose'
import { Helmet } from 'react-helmet'

import Layout from '../_layout/index'
import MainWrapper from './MainWrapper'
import AuthRoute from './AuthRoute'
import LogIn from '../authentication/index'
import ForgotPassword from '../authentication/ForgotPassword'
import CreatePassword from '../authentication/CreatePassword'
import ForceLogout from '../authentication/ForceLogout'
import PartnerIndex from '../partners/index'
import CreatePartner from '../partners/CreatePartner'
import EditPartner from '../partners/EditPartner'
import AccountSettings from '../account_settings/index'
import withTracker from '../../shared/components/withTracker'
import withStandardPlanHandler from '../../shared/components/withStandardPlanHandler'

import ProductCategoryIndex from '../product_category/index'
import ConfigurationIndex from '../configuration/index'
import CreateConfigurationPage from '../configuration/CreateConfiguration'
import CreateProductCategory from '../product_category/CreateProductCategory'
import EditProductCategory from '../product_category/EditProductCategory'


const RouteList = {
  Partners: {
    path: '/partners',
    title: 'Mitra',
    component: [
      {
        path: '/partners/list',
        component: PartnerIndex,
      },
      {
        path: '/partners/create',
        component: CreatePartner,
      },
      {
        path: '/partners/details/:id',
        component: EditPartner,
      },
    ],
  },

  Configuration: {
    path: '/configuration',
    title: 'Configuration',
    component: [
      {
        path: '/configuration/list',
        component: ConfigurationIndex,
      },
      {
        path: '/configuration/create',
        component: CreateConfigurationPage,
      },
      /*{
        path: '/configuration/details/:id',
        component: EditConfiguration,
      },*/
    ],
  },

  ProductCategory: {
      path: '/product_category',
      title: 'Product Category',
      component: [
        {
          path: '/product_category/list',
          component: ProductCategoryIndex,
        },
         {
          path: '/product_category/create',
          component: CreateProductCategory,
        },
        {
          path: '/product_category/details/:id',
          component: EditProductCategory,
        },
      ],
  },

  AccountSettings: {
    path: '/account_settings',
    component: [
      {
        path: '/account_settings',
        component: AccountSettings,
      },
    ],
  },
}

const wrappedRoutes = compose(
  withHandlers({
    routeComponents: () => (component, metaTitle) => {
      const routes = component.map((value, idx) => {
        const { component: Comp } = value
        return (
          <Route
            exact
            key={idx}
            path={value.path}
            render={withStandardPlanHandler(routeProps => {
              const title = value.title || metaTitle
              return (
                <Fragment>
                  <Helmet>
                    <title>{title ? `${title} - Moodah` : 'Moodah'}</title>
                  </Helmet>
                  <Comp {...routeProps} />
                </Fragment>
              )
            })}
          />
        )
      })

      return <Switch>{routes}</Switch>
    },
  }),
  withHandlers({
    RenderRoute: ({ routeComponents }) => () => {
      return Object.keys(RouteList).map((name, idx) => {
        const { component, ...rest } = RouteList[name]

        return (
          <Route
            key={idx}
            component={withTracker(() => {
              return (
                <Fragment>
                  <Helmet>
                    <title>
                      {rest.title ? `${rest.title} - Moodah` : 'Moodah'}
                    </title>
                  </Helmet>
                  {routeComponents(component, rest.title)}
                </Fragment>
              )
            })}
            {...rest}
          />
        )
      })
    },
  })
)(({ RenderRoute }) => {
  return (
    <div>
      <Layout />
      <div className="container__wrap">
        <RenderRoute />
      </div>
    </div>
  )
})

const Router = () => (
  <MainWrapper>
    <main>
      <Switch>
        <Route exact path="/" component={LogIn} />
        <Route exact path="/log_in" component={LogIn} />
        <Route exact path="/log_out" component={ForceLogout} />
        <Route exact path="/forgot_password" component={ForgotPassword} />
        <Route
          exact
          path="/reset_password/:username"
          component={CreatePassword}
        />
        <AuthRoute path="/" component={wrappedRoutes} />
      </Switch>
    </main>
  </MainWrapper>
)

export default Router

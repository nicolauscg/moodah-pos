import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import { compose, withHandlers } from "recompose";
import { Helmet } from "react-helmet";

import Layout from "../_layout/index";
import MainWrapper from "./MainWrapper";
import AuthRoute from "./AuthRoute";
import LogIn from "../authentication/index";
import ForgotPassword from "../authentication/ForgotPassword";
import CreatePassword from "../authentication/CreatePassword";
import ForceLogout from "../authentication/ForceLogout";
import PartnerIndex from "../partners/index";
import CreatePartner from "../partners/CreatePartner";
import EditPartner from "../partners/EditPartner";
import AccountSettings from "../account_settings/index";
import withTracker from "../../shared/components/withTracker";
import withStandardPlanHandler from "../../shared/components/withStandardPlanHandler";

import DashboardIndex from "../dashboard/index";

import CategoryIndex from "../category/index";
import CreateCategory from "../category/CreateCategory";
import EditCategory from "../category/EditCategory";

import ConfigurationIndex from "../configuration/index";
import CreateConfiguration from "../configuration/CreateConfiguration";
import EditConfiguration from "../configuration/EditConfiguration";

import CreateProduct from "../product/CreateProduct";
import ProductIndex from "../product/index";
import EditProduct from "../product/EditProduct";

import DashboardSession from "../session/session";

const RouteList = {
  Partners: {
    path: "/partners",
    title: "Mitra",
    component: [
      {
        path: "/partners/list",
        component: PartnerIndex
      },
      {
        path: "/partners/create",
        component: CreatePartner
      },
      {
        path: "/partners/details/:id",
        component: EditPartner
      }
    ]
  },

  Dashboard: {
    path: "/dashboard",
    title: "Dashboard",
    component: [
      {
        path: "/dashboard/list",
        component: DashboardIndex
      }
    ]
  },

  Configuration: {
    path: "/configuration",
    title: "Configuration",
    component: [
      {
        path: "/configuration/list",
        component: ConfigurationIndex
      },
      {
        path: "/configuration/create",
        component: CreateConfiguration
      },
      {
        path: "/configuration/details/:id",
        component: EditConfiguration
      },
      {
        path: "/configuration/:configId/session/:sessionId",
        component: DashboardSession
      }
    ]
  },

  Category: {
    path: "/category",
    title: "Product Category",
    component: [
      {
        path: "/category/list",
        component: CategoryIndex
      },
      {
        path: "/category/create",
        component: CreateCategory
      },
      {
        path: "/category/details/:id",
        component: EditCategory
      }
    ]
  },

  Product: {
    path: "/product",
    title: "Product",
    component: [
      {
        path: "/product/list",
        component: ProductIndex
      },
      {
        path: "/product/create",
        component: CreateProduct
      },
      {
        path: "/product/details/:id",
        component: EditProduct
      }
    ]
  },

  AccountSettings: {
    path: "/account_settings",
    component: [
      {
        path: "/account_settings",
        component: AccountSettings
      }
    ]
  }
};

const wrappedRoutes = compose(
  withHandlers({
    routeComponents: () => (component, metaTitle) => {
      const routes = component.map((value, idx) => {
        const { component: Comp } = value;
        return (
          <Route
            exact
            key={idx}
            path={value.path}
            render={withStandardPlanHandler(routeProps => {
              const title = value.title || metaTitle;
              return (
                <Fragment>
                  <Helmet>
                    <title>{title ? `${title} - Moodah` : "Moodah"}</title>
                  </Helmet>
                  <Comp {...routeProps} />
                </Fragment>
              );
            })}
          />
        );
      });

      return <Switch>{routes}</Switch>;
    }
  }),
  withHandlers({
    RenderRoute: ({ routeComponents }) => () => {
      return Object.keys(RouteList).map((name, idx) => {
        const { component, ...rest } = RouteList[name];

        return (
          <Route
            key={idx}
            component={withTracker(() => {
              return (
                <Fragment>
                  <Helmet>
                    <title>
                      {rest.title ? `${rest.title} - Moodah` : "Moodah"}
                    </title>
                  </Helmet>
                  {routeComponents(component, rest.title)}
                </Fragment>
              );
            })}
            {...rest}
          />
        );
      });
    }
  })
)(({ RenderRoute, location }) => {
  const isShowTopSideBar = !new RegExp("/session/").test(location.pathname);

  return (
    <div>
      {isShowTopSideBar ? (
        <>
          <Layout />
          <div className="container__wrap">
            <RenderRoute />
          </div>
        </>
      ) : (
        <RenderRoute />
      )}
    </div>
  );
});

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
);

export default Router;

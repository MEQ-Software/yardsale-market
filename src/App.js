import React, {
  Component,
  Fragment,
  useState,
  useContext,
  useEffect
} from "react";

import { Router, Route, Switch, Redirect, Link } from "react-router-dom";

// styles
import "./App.css";
import {
  Container,
  Grid,
  Header,
  Divider,
  Button,
  Segment,
  Menu,
  Icon,
  Dropdown,
  Portal
} from "semantic-ui-react";

import Notifications, { notify } from "react-notify-toast";

import history from "./utils/history";

// import 'semantic-ui-css/semantic.min.css';
import "../semantic/dist/semantic.css";
// import "./index.css";
import "./App.scss";
// import 'semantic-ui-less/themes/flat/globals'

import "react-datepicker/dist/react-datepicker.css";

import PrivateRoute from "./components/PrivateRoute";

import Loading from "./components/layout/Loading";
import Title from "./components/layout/Title";
import Footer from "./components/layout/Footer";
import Sellers from "./pages/Sellers";
import Yardsales from "./pages/Yardsales";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Market from "./pages/Market";
import ForgotPasswordModal from "./components/modals/ForgotPasswordModal/ForgotModalPassword";

import "./utils/prototypes";

import { NAVBAR_HEIGHT, FOOTER_HEIGHT, TITLE_HEIGHT } from "./constants";

import { auth as defaultAuth } from "./Auth";
import LoginModal from "./components/modals/LoginModal/LoginModal";
import RegistrationConfirmationModal from "./components/modals/RegistrationConfirmationModal/RegistrationConfirmationModal";
import RegisterModal from "./components/modals/RegisterModal/RegisterModal";
import NotFoundPage from "./pages/NotFoundPage";

import { GET_USER } from "./graphql/queries";
import { useQuery } from "@apollo/react-hooks";
import GetUserComp from "./GetUser";

import TopNotifications from "./utils/Notifications";
import Login from "./pages/Login";
import SidebarNav from "./components/layout/SidebarNav";
import ConfirmNewPasswordModalBody from "./components/modals/ForgotPasswordModal/ConfirmNewPasswordModalBody";

export const AuthContext = React.createContext([
  defaultAuth,
  () => defaultAuth
]);

const defaultAppContext = {
  activePage: "",
  showLoginModal: false,
  notifications: {
    show: false,
    dismiss: true,
    message: "",
    level: "info"
  },
  sidebar: {
    settingsPortalOpen: false
  },
  yardsalePage: {
    searchQuery: "",
    activeYardsaleUUID: null
  }
};

export const AppContext = React.createContext([
  defaultAppContext,
  () => defaultAppContext
]);

const App = () => {
  const [title, setTitle] = useState("");
  const [auth, setAuth] = useState(defaultAuth);
  const [app, setApp] = useState(defaultAppContext);

  // useEffect(() => {
  //   console.log('APP Context', app)
  // }, [app])
  return (
    <Router history={history}>
      <AuthContext.Provider value={{ auth, setAuth }}>
        <AppContext.Provider value={{ app, setApp }}>
          {app && app.showLoginModal === true && (
            <LoginModal defaultOpen={true} noTrigger={true} />
          )}

          <div className="grid-wrapper">
            <div className="grid-notifications" id="TopNotificationBar">
              {/* <TopNotifications /> */}
            </div>

            {/* Render the Sidebar (Uses CSS Grid) */}
            <div className="grid-sidebar">
              <SidebarNav />
            </div>
            <div className="grid-content">
              <Segment basic id="MainContent" textAlign="center">
                <Switch>
                  {/* Home (root/index) */}
                  <Route
                    exact
                    path="/"
                    render={props => <Home {...props} setTitle={setTitle} />}
                  />
                  {/* Login */}
                  <Route
                    exact
                    path="/login"
                    render={props => <Login {...props} />}
                  />

                  {/* Onboarding */}
                  <PrivateRoute
                    exact
                    path="/welcome"
                    render={props => <Onboarding {...props} />}
                  />
                  {/* Market */}
                  <PrivateRoute
                    exact
                    path="/market"
                    render={props => <Market {...props} setTitle={setTitle} />}
                  />

                  <PrivateRoute
                    exact
                    path="/sellers"
                    render={props => <Sellers {...props} setTitle={setTitle} />}
                  />
                  <PrivateRoute
                    exact
                    path="/yardsales"
                    render={props => (
                      <Yardsales {...props} setTitle={setTitle} />
                    )}
                  />

                  <Route
                    exact
                    path="/request-change-password"
                    render={props => <ForgotPasswordModal {...props} />}
                  />

                  <Route
                    path="/confirm-change-password/:resetCode/:uuid"
                    render={props => (
                      <ConfirmNewPasswordModalBody
                        defaultOpen={true}
                        {...props}
                      />
                    )}
                  />

                  <PrivateRoute
                    exact
                    path="/register"
                    render={props => (
                      <RegisterModal
                        {...props}
                        defaultOpen={true}
                        forcedOpen={true}
                      />
                    )}
                  />

                  <Route
                    exact
                    path="/register/confirm-email"
                    render={props => (
                      <RegistrationConfirmationModal
                        {...props}
                        defaultOpen={true}
                        forcedOpen={true}
                      />
                    )}
                  />
                  {/* Handle the 404 Error case */}
                  <Route
                    path="/404"
                    render={props => <NotFoundPage {...props} />}
                  />
                  {/* If no matches found: redirect to 404 */}
                  <Redirect to="/404" />
                </Switch>
              </Segment>
            </div>
          </div>
        </AppContext.Provider>
      </AuthContext.Provider>
    </Router>
  );
};

export default App;

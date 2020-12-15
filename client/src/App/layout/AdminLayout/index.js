import React, { Component, Suspense } from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import Fullscreen from "react-full-screen";
import windowSize from 'react-window-size';

import Navigation from './Navigation';
import NavBar from './NavBar';
import Loader from "../Loader";
import routes from "../../../routes";
import Aux from "../../../hoc/_Aux";
import * as actionTypes from "../../../store/actions";
import * as actions from '../../../store/actions/userActions';
import jwt from 'jsonwebtoken';
import './app.scss';
import { bindActionCreators } from "redux";

class AdminLayout extends Component {

    fullScreenExitHandler = () => {
        if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
            this.props.onFullScreenExit();
        }
    };

    UNSAFE_componentWillMount() {
        if (!this.props.user) {
            let local = localStorage.getItem('lms-token');
            if (local) {
                let decode = jwt.decode(local);
                let payload = {
                    id: decode.id,
                    status: decode.status,
                    role: decode.role,
                    firstName: decode.firstName,
                    lastName: decode.lastName,
                    email: decode.email
                }
                this.props.userActions.signIn(payload);
            }
        }
        if (this.props.windowWidth > 992 && this.props.windowWidth <= 1024 && this.props.layout !== 'horizontal') {
            this.props.onComponentWillMount();
        }
    }

    mobileOutClickHandler() {
        if (this.props.windowWidth < 992 && this.props.collapseMenu) {
            this.props.onComponentWillMount();
        }
    }


    routeSetup = (route, index) => {
        if (this.props.user && this.props.user.role === 'user' && this.props.user.status && route.user) {
            return (
                <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={props => (
                        <route.component {...props} />
                )} />
            );
        } else if (this.props.user && this.props.user.role === 'faculty' && this.props.user.status && route.faculty) {
            return (
                <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={props => (
                        <route.component {...props} />
                )} />
            );
        } else if (this.props.user && this.props.user.role === 'admin' && this.props.user.status && route.admin) {
            return (
                <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={props => (
                        <route.component {...props} />
                )} />
            );
        } else if (this.props.user && !this.props.user.status && route.faculty && route.user) {
            return (
                <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={props => (
                        <route.component {...props} />
                )} />
            );
        } else {
            return null;
        }
    }

    redirectToPageAfterRefresh = () => {
        let local = localStorage.getItem('lms-token');
        if (this.props.user && this.props.user.role === 'user' && this.props.user.status) {
            return this.props.defaultPath;
        } else if (this.props.user  && this.props.user.role === 'faculty' && this.props.user.status) {
            return '/home';
        } else if (this.props.user  && this.props.user.role === 'admin' && this.props.user.status) {
            return '/admin/dashboard';
        } else if (local) {
            return this.props.defaultPath;
        } else {
            return '/login';
        }
    }

    render() {

        /* full screen exit call */
        document.addEventListener('fullscreenchange', this.fullScreenExitHandler);
        document.addEventListener('webkitfullscreenchange', this.fullScreenExitHandler);
        document.addEventListener('mozfullscreenchange', this.fullScreenExitHandler);
        document.addEventListener('MSFullscreenChange', this.fullScreenExitHandler);
        const menu = routes.map((route, index) => {
            return (route.component) ? (
                this.routeSetup(route, index)
            ) : (null);
        });

        return (
            <Aux>
                <Fullscreen enabled={this.props.isFullScreen}>
                    <Navigation />
                    <NavBar />
                    <div className="pcoded-main-container" onClick={() => this.mobileOutClickHandler}>
                        <div className="pcoded-wrapper">
                            <div className="pcoded-content">
                                <div className="pcoded-inner-content">
                                    <div className="main-body">
                                        <div className="page-wrapper">
                                            <Suspense fallback={<Loader/>}>
                                                <Switch>
                                                    {menu}
                                                    <Redirect from="/" to={ this.redirectToPageAfterRefresh() } />
                                                </Switch>
                                            </Suspense>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fullscreen>
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        defaultPath: state.reducer.defaultPath,
        isFullScreen: state.reducer.isFullScreen,
        collapseMenu: state.reducer.collapseMenu,
        configBlock: state.reducer.configBlock,
        layout: state.reducer.layout,
        user: state.userDetails.user
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onFullScreenExit: () => dispatch({type: actionTypes.FULL_SCREEN_EXIT}),
        onComponentWillMount: () => dispatch({type: actionTypes.COLLAPSE_MENU}),
        userActions: bindActionCreators(actions, dispatch)
    }
}; 

export default connect(mapStateToProps, mapDispatchToProps) (windowSize(AdminLayout));
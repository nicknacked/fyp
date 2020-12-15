import React, { Component } from 'react';
import {Dropdown} from 'react-bootstrap';
import Aux from "../../../../../hoc/_Aux";
import DEMO from "../../../../../store/constant";
import Avatar1 from '../../../../../assets/images/user/avatar-1.jpg';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import * as actions from '../../../../../store/actions/userActions';

class NavRight extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            listOpen: false
        };
    }

    async logout(e) {
        e.preventDefault();
        await localStorage.removeItem('lms-token');
        await this.props.signOut();
        this.props.history.push('/login');
    }

    render() {

        return (
            <Aux>
                <ul className="navbar-nav ml-auto">
                    <li>
                        <Dropdown alignRight={!this.props.rtlLayout} className="drp-user">
                            <Dropdown.Toggle variant={'link'} id="dropdown-basic">
                                <i className="icon feather icon-settings"/>
                            </Dropdown.Toggle>
                            <Dropdown.Menu alignRight className="profile-notification">
                                <div className="pro-head">
                                    <img src={Avatar1} className="img-radius" alt="User Profile"/>
                                    <span>{this.props.user ? `${this.props.user.firstName}` : null }</span>
                                    <a href={DEMO.BLANK_LINK} onClick={(e) => this.logout(e) } className="dud-logout" title="Logout">
                                        <i className="feather icon-log-out"/>
                                    </a>
                                </div>
                            </Dropdown.Menu>
                        </Dropdown>
                    </li>
                </ul>
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.userDetails.user
    }
}
export default connect(mapStateToProps, actions)(withRouter(NavRight));

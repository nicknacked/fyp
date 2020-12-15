import React from 'react';
import {NavLink} from 'react-router-dom';

import './../../../assets/scss/style.scss';
import Aux from "../../../hoc/_Aux";
import { Form } from 'react-bootstrap';
import axios from 'axios';
import config from '../../../config';
import { NotificationContainer, NotificationManager } from 'react-notifications';

class SignUp1 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          isValid: {
              value: false,
              text: ''   
          },
        }
      }

    componentDidMount() {
        let local = localStorage.getItem('lms-token');
        if (local) {
            this.props.history.push('/dasboard');
        }
    }

    handleTextChange(event) {
        this.setState({ [event.name]: event.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        const { email, password, firstName, lastName } = this.state;
       
        if (!firstName && firstName.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid First Name', name: 'firstName' }});
            return;
        }

        if (!lastName && lastName.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Last Name', name: 'lastName' }});
            return;
        }

        if (!email && email.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Email', name: 'email' }});
            return;
        }

        if (!password && password.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Password', name: 'password' }});
            return;
        }
        axios.post(`${config.prod}/api/user/create`, { email: email.trim(), password: password.trim(),
                lastName: lastName.trim(), firstName: firstName.trim() 
            })
            .then(response => {
                this.props.history.push('/login');
            })
            .catch(err => {
                console.log('Error: ', err.response);
                if (err.response && err.response.status && (err.response.status === 400 || err.response.status === 401 || err.response.status === 500)) {
                    this.setState({ isValid: { value: true, text: err.response.data.msg } });
                    this.createNotification('error', err.response.data.msg);
                } else {
                    this.setState({ isValid: { value: true, text: 'Unknown Error' } });
                    this.createNotification('error', 'Unknown Error');
                }
            });

    }

    createNotification = (type, value) => {
        switch (type) {
            case 'info':
                NotificationManager.info(value,'', 5000);
                break;
            case 'success':
                NotificationManager.success(value, '', 5000);
                break;
            case 'warning':
                NotificationManager.warning(value, '', 5000);
                break;
            case 'error':
                NotificationManager.error(value, '', 5000);
                break;
            default: break;
        }
    };

    render () {
        return(
            <Aux>
                <NotificationContainer/>
                <div className="auth-wrapper">
                    <div className="auth-content">
                        <div className="auth-bg">
                            <span className="r"/>
                            <span className="r s"/>
                            <span className="r s"/>
                            <span className="r"/>
                        </div>
                        <div className="card">
                            <div className="card-body text-center">
                                <div className="mb-4">
                                    <i className="feather icon-user-plus auth-icon"/>
                                </div>
                                <h3 className="mb-4">Sign up</h3>
                                <Form onSubmit={(e)=> this.handleSubmit(e)}>
                                    <div className="input-group mb-3">
                                        <input 
                                            type="text" 
                                            className={this.state.isValid.value && this.state.isValid.name === 'firstName' ? 'form-control in-valid-input' : 'form-control'} 
                                            placeholder="First Name"
                                            name="firstName"
                                            onFocus={() => this.setState({ isValid: { value: false, text: '', name: '' }})}
                                            onChange={(e) => this.handleTextChange(e.target) }
                                        />
                                    </div>
                                    <div className="input-group mb-3">
                                        <input 
                                            type="text" 
                                            className={this.state.isValid.value && this.state.isValid.name === 'lastName' ? 'form-control in-valid-input' : 'form-control'} 
                                            placeholder="Last Name"
                                            name="lastName"
                                            onFocus={() => this.setState({ isValid: { value: false, text: '', name: '' }})}
                                            onChange={(e) => this.handleTextChange(e.target) }
                                        />
                                    </div>
                                    <div className="input-group mb-3">
                                        <input 
                                            type="email" 
                                            className={this.state.isValid.value && this.state.isValid.name === 'email' ? 'form-control in-valid-input' : 'form-control'} 
                                            placeholder="Email"
                                            name="email"
                                            onFocus={() => this.setState({ isValid: { value: false, text: '', name: '' }})}
                                            onChange={(e) => this.handleTextChange(e.target) }
                                        />
                                    </div>
                                    <div className="input-group mb-3">
                                        <input 
                                            type="password" 
                                            className={this.state.isValid.value && this.state.isValid.name === 'password' ? 'form-control in-valid-input' : 'form-control'} 
                                            placeholder="password"
                                            name="password"
                                            onFocus={() => this.setState({ isValid: { value: false, text: '', name: '' }})}
                                            onChange={(e) => this.handleTextChange(e.target) }
                                        />
                                    </div>
                                    <div className="form-group text-left">
                                        {
                                            this.state.isValid.value ?
                                            <Form.Text style={{ color: 'red' }}>
                                                { this.state.isValid.text }
                                            </Form.Text> : ''
                                        }
                                    </div>
                                    <div>
                                        <button type='submit' style={{ width: '100%' }} className="btn btn-primary shadow-2 mb-4" onSubmit={(e)=> this.handleSubmit(e)}>Signup</button>
                                    </div>
                                </Form>
                                <p className="mb-0 text-muted">Already have an account? <NavLink to="/login">Login</NavLink></p>
                            </div>
                        </div>
                    </div>
                </div>
            </Aux>
        );
    }
}

export default SignUp1;
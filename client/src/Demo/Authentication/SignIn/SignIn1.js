import React from 'react';
import './../../../assets/scss/style.scss';
import Aux from "../../../hoc/_Aux";
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import config from '../../../config';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import * as actions from '../../../store/actions/userActions';
import { NavLink } from 'react-router-dom';

class SignUp1 extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        email: '',
        password: '',
        isValid: {
            value: false,
            text: ''   
        },
      }
      this.facebookResponse = this.facebookResponse.bind(this);
    }

    facebookResponse = (response) => {
        axios.post(`${config.prod}/api/auth/facebook`, { access_token: response.accessToken })
            .then(result => {
                localStorage.setItem('lms-token', result.data.token);
                this.props.signIn(result.data.user);
                result.data.user.status ? result.data.user.role === 'user' ? this.props.history.push('/dashboard') : this.props.history.push('/home') : this.props.history.push('/verify/identity');
            })
            .catch(err => {
                console.log(err);
            });
    };

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
        const { email, password } = this.state;
       
        if (!email && email.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Email', name: 'email' }});
            return;
        }

        if (!password && password.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Password', name: 'password' }});
            return;
        }
        axios.post(`${config.prod}/api/user/signin`, { email: email.trim(), password: password.trim() })
            .then(async result => {
                await localStorage.setItem('lms-token', result.data.token);
                await this.props.signIn(result.data.user);
                result.data.user.status ? result.data.user.role === 'admin' ? this.props.history.push('/admin/dashboard') : result.data.user.role === 'user' ? this.props.history.push('/dashboard') : this.props.history.push('/home')  : this.props.history.push('/verify/identity');
            })
            .catch(err => {
                console.log('Error: ', err.response);
                if (err.response && err.response.status && (err.response.status === 404 || err.response.status === 400 || err.response.status === 401 || err.response.status === 500)) {
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
                                    <i className="feather icon-unlock auth-icon"/>
                                </div>
                                <h3 className="mb-4">Login</h3>
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
                                <div className="input-group mb-4">
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
                                    <button style={{ width: '100%' }} className="btn btn-primary shadow-2 mb-4" onClick={(e)=> this.handleSubmit(e)}>Login</button>
                                </div>
                                <div>
                                    <FacebookLogin
                                        appId={config.REACT_APP_FACEBOOK_APP_ID}
                                        autoLoad={false}
                                        fields="name,email,picture"
                                        callback={this.facebookResponse}
                                        render={(renderProps) => (
                                            <button style={{ width: '100%' }} className="btn btn-primary shadow-2 mb-4" onClick={renderProps.onClick}>Facebook Login</button>
                                        // <SocialButtons variant="facebook" action={renderProps.onClick} />
                                        )}
                                    />
                                </div>
                                <p className="mb-0 text-muted">Create an account? <NavLink to="/signup">Signup</NavLink></p>
                            </div>
                        </div>
                    </div>
                </div>
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.userDetails
    }
};

export default connect(mapStateToProps, actions)(SignUp1);
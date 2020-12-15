import React from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import {connect} from 'react-redux';
import Aux from "../../../hoc/_Aux";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Loader from '../../../App/layout/Loader';
import axios from 'axios';
import config from '../../../config';
import * as actions from "../../../store/actions/userActions";

class VerifyIdentity extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            u_id: '',
            status: true,
            isValid: {
                value: false,
                text: '',
                name: ''   
            },
	    }
    }

    handleTextChange(value) {
        this.setState({ u_id: value });
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
    
    handleSubmit= async (e) => {
        e.preventDefault();
       
        const { u_id, status } = this.state;
        
        if (!u_id || u_id.trim().length === 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Student/Faculty ID', name: 'u_id' } });
            return;
        }
        let u_idTrim = u_id.trim();
        let checkAlphabet = /^[A-Z]/;
        let checkDigit = /^\d+$/;
        if (u_idTrim.length < 9 || u_idTrim.length > 9 || !(u_idTrim.charAt(0) === 'U') || (!checkAlphabet.test(u_idTrim.charAt(8))) || !checkDigit.test(u_idTrim.substr(1,7))) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Student/Faculty ID', name: 'u_id' } });
            return;
        }

        await this.setState({ isLoading: true });
        axios.post(`${config.prod}/api/verify/identity`, { u_id: u_idTrim, id: this.props.user.id, role: status ? 'user' : 'faculty' })
            .then(async (response) => {
                this.createNotification('success', 'Identity Verified Successfully');
                await localStorage.setItem('lms-token', response.data.token);
                await this.props.signIn(response.data.user);
                await this.setState({ isLoading: false });
                response.data.user.role === 'user' ? this.props.history.push('/interests') : this.props.history.push('/home');
            })
            .catch(err => {
                console.log('Error: ', err.response);
                this.setState({ isLoading: false });
                if (err.response && err.response.status && ( err.response.status === 409 || err.response.status === 400 || err.response.status === 500)) {
                    this.setState({ isValid: { value: true, text: err.response.data.msg } });
                    this.createNotification('error', err.response.data.msg);
                } else {
                    this.setState({ isValid: { value: true, text: 'Unknown Error' } });
                    this.createNotification('error', 'Unknown Error');
                }
            });
    }

    render() {
        return (
            <Aux>
                {this.state.isLoading && <Loader />}
	            <Row>
                    <NotificationContainer/>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5"> Verify Your Identity </Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>
                                   <b>Note: </b> Your'e seeing this page because your identity is not verified.<br />
                                   Please verify your Identity to proceed in the LMS.
                                </Card.Text>
                                <Row>
                                    <Form className="col-md-12" onSubmit={(e) => this.handleSubmit(e)}>
                                    <fieldset disabled={this.state.isLoading} className={this.state.isLoading ? 'opacity-5' : ''}>
                                        <Form.Row>
                                        <Col md={4} lg={5}>
                                            <Form.Group className="mb-2" controlId="formBasicEmail">
                                                <Form.Label>Student/Faculty ID</Form.Label>
                                                <Form.Control 
                                                    type="text" 
                                                    name="u_id" 
                                                    placeholder="Your Student/Faculty ID" 
                                                    value={this.state.u_id}
                                                    className={this.state.isValid.value && this.state.isValid.name === 'u_id' ? 'in-valid-input' : ''}
                                                    onFocus={() => this.setState({ isValid: { value: false, text: ''}})}
                                                    onChange={(e) => this.handleTextChange(e.target.value) }
                                                />
                                                {
                                                    this.state.isValid.value && this.state.isValid.name === 'u_id' ?
                                                    <Form.Text style={{ color: 'red' }}>
                                                        { this.state.isValid.text }
                                                    </Form.Text> : ''
                                                }
                                            </Form.Group>
                                        </Col>
                                        <Col md={4} lg={3}>
                                            <Form.Group className="mb-2" controlId="status">
                                                <div> <Form.Label>Type</Form.Label> </div>
                                                <div className="rg-pad">
                                                    <Form.Check
                                                        inline
                                                        custom
                                                        type="radio"
                                                        checked={this.state.status}
                                                        onChange={() => this.setState({ status: true })}
                                                        label="Student"
                                                        name="student"
                                                        id="supportedRadio21"
                                                    />
                                                    <Form.Check
                                                        inline
                                                        custom
                                                        type="radio"
                                                        label="Faculty"
                                                        checked={!this.state.status}
                                                        onChange={() => this.setState({ status: false })}
                                                        name="faculty"
                                                        id="supportedRadio22"
                                                    />
                                                </div>
                                                
                                            </Form.Group>
                                        </Col>
                                        <Col md={4} lg={4}>
                                            <div style={{ padding: '4px 20px' }}>
                                                <Button type="submit" className="mt-4" variant={"primary"}>
                                                    { 'Submit' }
                                                </Button>
                                            </div>
                                        </Col>
                                        </Form.Row>
                                    </fieldset>
                                    </Form>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.userDetails.user,
    }
};

export default connect(mapStateToProps, actions)(VerifyIdentity);

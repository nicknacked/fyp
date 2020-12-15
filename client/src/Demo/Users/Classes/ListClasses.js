import React from 'react';
import { Row, Col, Table, Card, Form, Modal, Button } from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import axios from 'axios';
import config from '../../../config';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Loader from '../../../App/layout/Loader';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/userActions';
import BrowserInteractionTime from 'browser-interaction-time';

const browserInteractionTime = new BrowserInteractionTime({
    timeIntervalEllapsedCallbacks: [],
    absoluteTimeEllapsedCallbacks: [],
    browserTabInactiveCallbacks: [],
    browserTabActiveCallbacks: [],
    idleTimeoutMs: 6000,
    checkCallbacksIntervalMs: 250
});

const callbackInActive = () => browserInteractionTime.stopTimer();
browserInteractionTime.addBrowserTabInactiveCallback(callbackInActive);

const callbackActive = () => browserInteractionTime.startTimer();
browserInteractionTime.addBrowserTabActiveCallback(callbackActive);

class ListClasses extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            joinRowId: null,
            elem: {}, 
            showModal: false,
            isValid: {
                value: false,
                text: ''   
            },
            data: [],
            user_id: '',
            name: '',
        }
    }

    componentDidMount = async () => {
        if (this.props.user && this.props.user.id) {
            await this.setState({ user_id: this.props.user.id });
            this.props.createHistory({ user_id: this.props.user.id, page_name: 'list Classes', class_id: 0 });
            this.getClassesList();
        }
    }
    
    componentWillUnmount = async () => {
        let timeElapsed = browserInteractionTime.getTimeInMilliseconds();
        let timeInMinutes = (timeElapsed / 60000);
        
        this.props.createTimeSpent({ 
            user_id: this.props.user.id, page_name: 'list classes', 
            class_id: 0, time_spent: timeInMinutes 
        });
        browserInteractionTime.stopTimer();
        browserInteractionTime.destroy();
    }
    
    getClassesList() {
        this.setState({ isLoading: true });
		axios.get(`${config.prod}/api/users/${this.state.user_id}/class/list`)
			.then(response => {
                let data = response.data.data;
				this.setState({ data: data, isLoading: false });
			})
			.catch(err => {
				this.setState({ isLoading: false });
				console.log('Error: getting data from db ', err.response);
                this.createNotification('error', 'Error while Getting data from db');
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

    openEnrollModal(value) {
		this.setState({ showModal: true, joinRowId: value.id, elem: value, name: value.name, isValid: { value: false } });
    }

    cancelEnroll() {
		this.setState({ showModal: false, isValid: { value: false } });
    }
    
    handleEnrollNow() {
        this.setState({ showModal: false, isLoading: true });
        axios.post(`${config.prod}/api/users/class/enroll`, { userid: this.state.user_id, classid: this.state.joinRowId })
            .then(res => {
                this.getClassesList();
            })
            .catch(err => {
                console.log('Error: ', err.response);
                if (err.response && err.response.status && (err.response.status === 400 || err.response.status === 500)) {
                    if (err.response.status === 500) {
                        this.setState({ isValid: { value: true, text: 'Internal Server Error', name:'server_error' }, showModal: true });
                    } else {
                        this.setState({ isValid: { value: true, text: err.response.data.msg, name:'server_error' }, showModal: true });
                    }
                } else {
                    this.setState({ isValid: { value: true, text: 'Unknown Error', name:'server_error' }, showModal: true });
                    //this.createNotification('error', 'Unknown Error');
                }
            });
    }
    
    render() {
        return (
            <Aux>
                {this.state.isLoading && <Loader />}
			    <Row>
                    {   this.state.showModal && 
                            <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Confirm Enroll Now</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div>
                                        Are you sure to want to enroll <b>{this.state.name}</b>? 
                                    </div>
                                    {
                                        this.state.isValid.value && this.state.isValid.name === 'server_error' ?
                                            <Form.Text style={{ color: 'red' }}>
                                                { this.state.isValid.text }
                                            </Form.Text> : null
                                        }
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="primary" onClick={() => this.handleEnrollNow()}>
                                        OK
                                    </Button>
                                    <Button variant="secondary" onClick={() => this.cancelEnroll()}>
                                        Cancel
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                    }
                    <NotificationContainer/>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Enrolled Students</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <Table striped bordered hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>Class Name</th>
                                                    <th>Description</th>
                                                    <th>Lecturer Name</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.state.data.map((elem, i) => (
                                                        <tr key={i}>
                                                            <td>{elem.name}</td>
                                                            <td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{elem.description}</td>
                                                            <td>{`${elem.first_name} ${elem.last_name}`}</td>
                                                            <td><Button style={{ width: '100%' }} onClick={(e) => this.openEnrollModal(elem)} variant='outline-primary'>Enroll Now</Button></td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </Table>
                                    </Col>
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
        user: state.userDetails.user
    }
}

export default connect(mapStateToProps, actions)(ListClasses);

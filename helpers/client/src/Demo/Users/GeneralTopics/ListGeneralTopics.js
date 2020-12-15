import React from 'react';
import { Row, Col, Card, Button, Modal, Table } from 'react-bootstrap';
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

class ListTopics extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isValid: {
                value: false,
                text: ''   
            },
            data: [],
            class_id: ''
        }
    }

    componentDidMount = () => {
        if (this.props && this.props.user && this.props.user.id) {
            this.props.createHistory({ user_id: this.props.user.id, page_name: 'List General Topics', class_id: 0 });
            this.getTopicsList();
        }
    }
    
    componentWillUnmount = async () => {
        let timeElapsed = browserInteractionTime.getTimeInMilliseconds();
        let timeInMinutes = (timeElapsed / 60000);
        
        this.props.createTimeSpent({ 
            user_id: this.props.user.id, page_name: 'list General Topics', 
            class_id: 0, time_spent: timeInMinutes 
        });
        browserInteractionTime.stopTimer();
        browserInteractionTime.destroy();
    }
    
    openDiscussionForum(value) {
        this.props.history.push(`/user/general/topic/${value.id}/discussion`);
    }

    getTopicsList() {
        this.setState({ isLoading: true });
		axios.get(`${config.prod}/api/users/general/topic/list`)
			.then(response => {
				this.setState({ data: response.data.data, isLoading: false });
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

    cancelDownload() {
		this.setState({ 
            showModal: false,
			title: ''
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
                                <Card.Title as="h5">General Topics List</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <Table striped bordered hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Title</th>
                                                    <th>Description</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.state.data.map((elem, i) => (
                                                        <tr key={i}>
                                                            <td>{i}</td>
                                                            <td>{elem.name}</td>
                                                            <td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{elem.description}</td>
                                                            <td>
                                                                <Button onClick={(e) => this.openDiscussionForum(elem)} variant='primary'>Open Forum</Button>
                                                            </td>
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

export default connect(mapStateToProps, actions)(ListTopics);

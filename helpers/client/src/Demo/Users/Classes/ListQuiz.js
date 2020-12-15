import React from 'react';
import { Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
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

class ListQuiz extends React.Component {

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

    componentDidMount = async () => {
        if (this.props && this.props.user && this.props.user.id && this.props.match && this.props.match.params && this.props.match.params.id) {
            await this.setState({ class_id: this.props.match.params.id });
            this.props.createHistory({ user_id: this.props.user.id, page_name: 'list Quiz', class_id: this.props.match.params.id });
            this.getQuizList();
        }
    }
    
    componentWillUnmount = async () => {
        let timeElapsed = browserInteractionTime.getTimeInMilliseconds();
        let timeInMinutes = (timeElapsed / 60000);
        
        this.props.createTimeSpent({ 
            user_id: this.props.user.id, page_name: 'list Quiz', 
            class_id: this.props.match.params.id, time_spent: timeInMinutes 
        });
        browserInteractionTime.stopTimer();
        browserInteractionTime.destroy();
    }
    
    openSubmissions(value) {
        this.props.history.push(`/user/class/${this.state.class_id}/quiz/${value.id}/submission`);
    }

    getQuizList() {
        this.setState({ isLoading: true });
		axios.get(`${config.prod}/api/users/${this.props.user.id}/class/${this.state.class_id}/quiz/list`)
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
    
    disableBtn(elem) {
        if (Object.keys(elem.quiz_submissions).length) {
            return true;
        } else {
            if (new Date(elem.submission_date) < new Date()) {
                return true;
            } else {
                return false;
            }
        }
    }

    goBack(e) {
        e.preventDefault();
        this.props.history.push('/enrolled/class/list');
    }
    
    render() {
        return (
            <Aux>
                {this.state.isLoading && <Loader />}
                <Row>
                    <Col>
                        <Button onClick={(e) => this.goBack(e) } variant='outline-dark'>Back</Button>
                    </Col>
                </Row>
			    <Row>
                    <NotificationContainer/>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Quiz List</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <Table striped bordered hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Title</th>
                                                    <th>Total Marks</th>
                                                    <th>Obtained Marks</th>
                                                    <th>Submission Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.state.data.map((elem, i) => (
                                                        <tr key={i}>
                                                            <td>{ i }</td>
                                                            <td>{ elem.title }</td>
                                                            <td>{ elem.total_marks }</td>
                                                            <td>{ Object.keys(elem.quiz_submissions).length ? elem.quiz_submissions.obtained_marks : null }</td>
                                                            <td>{ new Date(elem.submission_date).toString() }</td>
                                                            <td>
                                                                {
                                                                    Object.keys(elem.quiz_submissions).length ? <Badge pill variant="info" style={{ width: '100%', padding: 10 }}>Already Submitted</Badge> : new Date(elem.submission_date) < new Date() ? <Badge pill variant="danger" style={{ width: '100%', padding: 10 }}>Late</Badge> : 
                                                                    <Button onClick={(e) => this.openSubmissions(elem)} variant={'primary'}>{ 'Start Now' }</Button>
                                                                }
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

export default connect(mapStateToProps, actions)(ListQuiz);

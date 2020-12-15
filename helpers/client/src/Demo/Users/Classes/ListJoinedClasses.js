import React from 'react';
import { Row, Col, Table, Card, Button } from 'react-bootstrap';
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

class ListJoinedClasses extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isValid: {
                value: false,
                text: ''   
            },
            data: [],
            user_id: '',
        }
    }

    componentDidMount = async () => {
        if (this.props.user && this.props.user.id) {
            await this.setState({ user_id: this.props.user.id });
            this.props.createHistory({ user_id: this.props.user.id, page_name: 'list enrolled classes', class_id: 0 });
            this.getJoinedClassesList();
        }
    }
    
    componentWillUnmount = async () => {
        let timeElapsed = browserInteractionTime.getTimeInMilliseconds();
        let timeInMinutes = (timeElapsed / 60000);
        
        this.props.createTimeSpent({ 
            user_id: this.props.user.id, page_name: 'list enrolled classes', 
            class_id: 0, time_spent: timeInMinutes 
        });
        browserInteractionTime.stopTimer();
        browserInteractionTime.destroy();
    }
    
    getJoinedClassesList() {
        this.setState({ isLoading: true });
		axios.get(`${config.prod}/api/users/${this.state.user_id}/class/joined/list`)
			.then(response => {
                let data = response.data.data;
				this.setState({ data: data.classes, isLoading: false });
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

    listVideoLecture(value) {
        this.props.history.push(`/user/class/${value.id}/lectures/list`);
    }

    listAnnoucement(value) {
        this.props.history.push(`/user/class/${value.id}/annoucements/list`);
    }

    listAssignment(value) {
        this.props.history.push(`/user/class/${value.id}/assignments/list`);
    }

    listCourseMaterial(value) {
        this.props.history.push(`/user/class/${value.id}/course/material/list`);
    }

    listTopics(value) {
        this.props.history.push(`/user/class/${value.id}/topics/list`);
    }

    listQuiz(value) {
        this.props.history.push(`/user/class/${value.id}/quiz/list`);
    }
    
    openClass(value) {
        this.props.history.push(`/class/${value.id}`);
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
                                <Card.Title as="h5">Enrolled Students</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    {
                                        this.state.data.map(elem => (
                                            <Col key={elem.id} lg={6}>
                                                <Card>
                                                    <Card.Header as='h4' style={{ fontFamily: 'cursive' }}><b>{elem.name}</b></Card.Header>
                                                    <Card.Body>
                                                        <Row>
                                                            <Col>
                                                                <div>
                                                                    <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                                                        {elem.description}
                                                                    </p>
                                                                    <hr />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col md={6}>
                                                              <Button style={{ width: '100%' }}  onClick={() => this.listVideoLecture(elem)} variant="outline-primary" className="mr-2 mt-2"> Lectures </Button>
                                                           </Col>
                                                           <Col md={6}>
                                                               <Button style={{ width: '100%' }} onClick={() => this.listTopics(elem)} variant="outline-primary" className="mr-2 mt-2"> Topics </Button>
                                                            </Col>
                                                            <Col md={6}>
                                                                <Button style={{ width: '100%' }} onClick={() => this.listAnnoucement(elem)} variant="outline-primary" className="mr-2 mt-2"> Annoucements</Button>
                                                            </Col>
                                                            <Col md={6}>
                                                                <Button style={{ width: '100%' }} onClick={() => this.listAssignment(elem)} variant="outline-primary" className="mr-2 mt-2"> Assignments</Button>
                                                            </Col>
                                                            <Col md={6}>
                                                                <Button style={{ width: '100%' }} onClick={() => this.listQuiz(elem)} variant="outline-primary" className="mr-2 mt-2"> Quizes</Button>
                                                            </Col>
                                                            <Col md={6}>
                                                                <Button style={{ width: '100%' }} onClick={() => this.listCourseMaterial(elem)} variant="outline-primary" className="mr-2 mt-2"> Course Material</Button>
                                                            </Col>    
                                                        </Row>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))
                                    }
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

export default connect(mapStateToProps, actions)(ListJoinedClasses);

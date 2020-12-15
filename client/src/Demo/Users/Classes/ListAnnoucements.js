import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
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

class ListAnnoucement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isValid: {
                value: false,
                text: ''   
            },
            data: [],
            class_id: '',
        }
    }

    componentDidMount = async () => {
        if (this.props && this.props.user && this.props.user.id && this.props.match && this.props.match.params && this.props.match.params.id) {
            browserInteractionTime.startTimer();
            await this.setState({ class_id: this.props.match.params.id });
            this.props.createHistory({ user_id: this.props.user.id, page_name: 'list annoucements', class_id: this.props.match.params.id });
            this.getAnnoucementList();
        }
    }

    componentWillUnmount = async () => {
        let timeElapsed = browserInteractionTime.getTimeInMilliseconds();
        let timeInMinutes = (timeElapsed / 60000);
        
        this.props.createTimeSpent({ 
            user_id: this.props.user.id, page_name: 'list annoucements', 
            class_id: this.props.match.params.id, time_spent: timeInMinutes 
        });
        browserInteractionTime.stopTimer();
        browserInteractionTime.destroy();
    }
    
    getAnnoucementList() {
        this.setState({ isLoading: true });
		axios.get(`${config.prod}/api/annoucement/${this.state.class_id}/list`)
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
                                <Card.Title as="h5">Annoucements List</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        {
                                            this.state.data.map((elem, i) => (
                                                <Col key={elem.id}>
                                                    <Card>
                                                        <Card.Header><b># {i+1}: {elem.title}</b></Card.Header>
                                                        <Card.Body>
                                                            <Row>
                                                                <Col>
                                                                    <h5>Description</h5>
                                                                    <hr />
                                                                    <p>
                                                                        {elem.description}
                                                                    </p>
                                                                </Col>
                                                            </Row>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))
                                        }
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

export default connect(mapStateToProps, actions)(ListAnnoucement);

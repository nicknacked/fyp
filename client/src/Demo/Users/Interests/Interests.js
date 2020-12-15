import React from 'react';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
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

class Interests extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
			deletedRowId: null,
			showModal: false,
			handleCloseModal: false,
            isValid: {
                value: false,
                text: ''   
            },
            data: [],
            ownData: [],
            dataToAdd: [],
            dataToDelete: [],
        }
    }

    openDeleteModal(value) {
		this.setState({ status: true, showModal: true, deletedRowId: value.id });
    }
    
	closeDeleteModal() {
		this.setState({ showModal: false });
    }
    
    handleDelete() {
        this.setState({ showModal: false, isLoading: true });
		axios.delete(`${config.prod}/api/user/interest/delete`, { data: { interest_id: this.state.deletedRowId } })
			.then(response => {
				this.createNotification('success', 'Interest Deleted Successfully');
				this.getInterestList();
			})
			.catch(err => {
				this.setState({ isLoading: false });
				console.log('Error: deleting data from db ', err.response);
                this.createNotification('error', 'Error while deleting data from db');
			});
    }


    componentDidMount() {
        if (this.props && this.props.user && this.props.user.id) {
            this.props.createHistory({ user_id: this.props.user.id, page_name: 'Interests', class_id: 0 });
            this.getInterestList();
        }
    }
    
    componentWillUnmount = async () => {
        let timeElapsed = browserInteractionTime.getTimeInMilliseconds();
        let timeInMinutes = (timeElapsed / 60000);
        
        this.props.createTimeSpent({ 
            user_id: this.props.user.id, page_name: 'Interests', 
            class_id: 0, time_spent: timeInMinutes 
        });
        browserInteractionTime.stopTimer();
        browserInteractionTime.destroy();
    }
    
    getInterestList() {
        this.setState({ isLoading: true });
        let promiseArray = [];
        promiseArray.push(axios.get(`${config.prod}/api/interest/list`));
        promiseArray.push(axios.get(`${config.prod}/api/interest/${this.props.user.id}/list`));
		Promise.all(promiseArray)
			.then(response => {
				this.setState({ data: response[0].data.data, ownData:response[1].data.data, isLoading: false });
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

    
    cancelDelete() {
		this.setState({ 
            isEdit: false,
            showModal: false,
			name: ''
		});
    }
    
    addInterest = async (e, elem) => {
        e.preventDefault();
        let length = this.state.ownData.length; 
        if (length < 3) {
            if (!this.state.ownData.some(x => x.interest_id === elem.id)) {
                await this.setState({ isLoading: true });
                axios.post(`${config.prod}/api/user/interest/create`, { user_id: this.props.user.id, interest_id: elem.id })
                    .then(response => {
                        this.getInterestList();
                    })
                    .catch(err => {
                        this.setState({ isLoading: false });
                        console.log('Error: adding data into db ', err.response);
                        this.createNotification('error', 'Error while adding interest into db');
                    });
            } else {
                alert('Interest already Added.');    
            }
        } else {
            alert('Max interest length reached.');
        }
    } 

    render() {
        return (
            <Aux>
                {this.state.isLoading && <Loader />}
				{this.state.showModal && 
					<Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
                        <Modal.Header closeButton>
                            <Modal.Title>Delete Confirm</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Are you sure to want to delete?</Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={() => this.handleDelete()}>
                                OK
                            </Button>
                            <Button variant="secondary" onClick={() => this.cancelDelete()}>
                                Cancel
                            </Button>
                        </Modal.Footer>
                    </Modal>
				}
                 <fieldset disabled={this.state.isLoading} className={this.state.isLoading ? 'opacity-5' : ''}>
                    <Row>
                        <NotificationContainer/>
                        <Col>
                            <Card>
                                <Card.Header>
                                    <Card.Title as="h5">Your Interests</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        {
                                            this.state.ownData.map((elem) => (
                                                <Button variant="outline-success" onClick={ () => this.openDeleteModal(elem) } key={elem.id} className="mr-2 mt-2">{ elem.interest.name }</Button>
                                            ))
                                        }
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Header>
                                    <Card.Title as="h5">Interest List</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col>
                                            {
                                                this.state.data.map(elem => (
                                                    <Button variant="outline-warning" key={elem.id} onClick={(e) => this.addInterest(e, elem) } className="mr-2 mt-2">{ elem.name }</Button>
                                                ))
                                            }
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </fieldset>
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.userDetails.user
    }
}

export default connect(mapStateToProps, actions)(Interests);

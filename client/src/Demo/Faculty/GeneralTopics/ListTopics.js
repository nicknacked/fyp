import React from 'react';
import { Row, Col, Card, Button, Modal, Table } from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import axios from 'axios';
import config from '../../../config';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Loader from '../../../App/layout/Loader';
import { connect } from 'react-redux';

class ListTopics extends React.Component {

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
            class_id: ''
        }
    }

    componentDidMount = () => {
        this.getTopicsList();
    }
    
    openDiscussionForum(value) {
        this.props.history.push(`/faculty/general/topic/${value.id}/discussion`);
    }

    openDeleteModal(value) {
		this.setState({ name: value.name, status: true, showModal: true, deletedRowId: value.id });
    }
    
	closeDeleteModal() {
		this.setState({ showModal: false });
    }

    handleDelete() {
        this.setState({ showModal: false, isLoading: true });
		axios.delete(`${config.prod}/api/class/topic/delete`, { data: { topic_id: this.state.deletedRowId } })
			.then(response => {
				this.createNotification('success', 'Topic Deleted Successfully');
				this.getTopicsList();
			})
			.catch(err => {
				this.setState({ isLoading: false, name: '' });
				console.log('Error: deleting data from db ', err.response);
                this.createNotification('error', 'Error while deleting data from db');
			});
    }

    getTopicsList() {
        this.setState({ isLoading: true });
		axios.get(`${config.prod}/api/topic/${this.props.user.id}/list`)
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

    cancelDelete() {
		this.setState({ 
            isEdit: false,
            showModal: false,
			name: ''
		});
    }
    
    render() {
        return (
            <Aux>
                {this.state.isLoading && <Loader />}
			    <Row>
                    <NotificationContainer/>
                    {this.state.showModal && 
                        <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
                            <Modal.Header closeButton>
                                <Modal.Title>Delete Confirm</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Are you sure to want to delete <b>{this.state.name}</b> </Modal.Body>
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
                                                                <Button onClick={(e) => this.openDeleteModal(elem)} variant='outline-danger'>Delete</Button>
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

export default connect(mapStateToProps, null)(ListTopics);

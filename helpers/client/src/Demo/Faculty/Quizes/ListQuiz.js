import React from 'react';
import { Row, Col, Card, Button, Table, Modal } from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import axios from 'axios';
import config from '../../../config';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Loader from '../../../App/layout/Loader';
import { connect } from 'react-redux';

class ListQuiz extends React.Component {

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
            class_id: '',
            name: ''
        }
    }

    componentDidMount = async () => {
        if (this.props && this.props.user && this.props.user.id && this.props.match && this.props.match.params && this.props.match.params.id) {
            await this.setState({ class_id: this.props.match.params.id })
            this.getQuizList();
        }
    }
    
    openSubmissions(value) {
        this.props.history.push(`/faculty/class/${this.state.class_id}/quiz/${value.id}/submissions`);
    }

    openDeleteModal(value) {
		this.setState({ name: value.title, status: true, showModal: true, deletedRowId: value.id });
    }
    
	closeDeleteModal() {
		this.setState({ showModal: false });
    }

    handleDelete() {
        this.setState({ showModal: false, isLoading: true });
		axios.delete(`${config.prod}/api/class/quiz/delete`, { data: { quiz_id: this.state.deletedRowId } })
			.then(response => {
				this.createNotification('success', 'Quiz Deleted Successfully');
				this.getQuizList();
			})
			.catch(err => {
				this.setState({ isLoading: false, name: '' });
				console.log('Error: deleting data from db ', err.response);
                this.createNotification('error', 'Error while deleting data from db');
			});
    }

    cancelDelete() {
		this.setState({ 
            isEdit: false,
            showModal: false,
			name: ''
		});
    }

    getQuizList() {
        this.setState({ isLoading: true });
		axios.get(`${config.prod}/api/class/${this.state.class_id}/quiz/list`)
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
        this.props.history.push(`/faculty/class/list`);
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
                                                    <th>Submission Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.state.data.map((elem, i) => (
                                                        <tr key={i}>
                                                            <td>{i}</td>
                                                            <td>{elem.title}</td>
                                                            <td>{elem.total_marks}</td>
                                                            <td>{new Date(elem.submission_date).toString()}</td>
                                                            <td>
                                                                <Button onClick={(e) => this.openSubmissions(elem)} variant='primary'>Check Submission</Button>
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

export default connect(mapStateToProps, null)(ListQuiz);

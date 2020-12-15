import React from 'react';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import axios from 'axios';
import config from '../../../config';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Loader from '../../../App/layout/Loader';
import { connect } from 'react-redux';

class Classes extends React.Component {

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
            data: []
        }
    }


    addVideoLecture(value) {
        this.props.history.push(`/faculty/class/${value.id}/course/create`)
    }

    addTopic(value) {
        this.props.history.push(`/faculty/class/${value.id}/topic/create`)
    }

    listTopics(value) {
        this.props.history.push(`/faculty/class/${value.id}/topic/list`)
    }
    
    addQuiz(value) {
        this.props.history.push(`/faculty/class/${value.id}/quiz/create`)
    }

    listQuiz(value) {
        this.props.history.push(`/faculty/class/${value.id}/quiz/list`)
    }

    addAnnoucement(value) {
        this.props.history.push(`/faculty/class/${value.id}/annoucement/create`)
    }

    listAnnoucement(value) {
        this.props.history.push(`/faculty/class/${value.id}/annoucement/list`)
    }

    addAssignment(value) {
        this.props.history.push(`/faculty/class/${value.id}/assignment/create`)
    }

    listAssignment(value) {
        this.props.history.push(`/faculty/class/${value.id}/assignment/list`)
    }
    
    addCourseMaterial(value) {
        this.props.history.push(`/faculty/class/${value.id}/course/material/create`)
    }
   
    listCourseMaterial(value) {
        this.props.history.push(`/faculty/class/${value.id}/course/material/list`)
    }

    listVideoLecture(value) {
        this.props.history.push(`/faculty/class/${value.id}/course/list`)
    }

    listStudentsEnrolled(value) {
        this.props.history.push(`/faculty/class/${value.id}/students/list`)
    }
    
    openDeleteModal(value) {
		this.setState({ isEdit: false, name: value.name, status: true, showModal: true, deletedRowId: value.id });
    }
    
	closeDeleteModal() {
		this.setState({ showModal: false });
    }
    
    handleDelete() {
        this.setState({ showModal: false, isLoading: true });
		axios.delete(`${config.prod}/api/class/delete`, { data: { class_id: this.state.deletedRowId } })
			.then(response => {
				this.createNotification('success', 'Class Deleted Successfully');
				this.getClassesList();
				this.setState({ isLoading: false, name: '' });
			})
			.catch(err => {
				this.setState({ isLoading: false, name: '' });
				console.log('Error: deleting data from db ', err.response);
                this.createNotification('error', 'Error while deleting data from db');
			});
    }


    componentDidMount() {
        if (this.props.user && this.props.user.id) {
            this.getClassesList();
        }
    }
    
    getClassesList() {
        this.setState({ isLoading: true });
		axios.get(`${config.prod}/api/class/${this.props.user.id}/list`)
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
                <Row>
                    <NotificationContainer/>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Classes List</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        {
                                            this.state.data.map(elem => (
                                                <Col key={elem.id}>
                                                    <Card>
                                                        <Card.Header as='h4' style={{ fontFamily: 'cursive' }}><b>{elem.name}</b></Card.Header>
                                                        <Card.Body>
                                                            <div>
                                                                <p>
                                                                    {elem.description}
                                                                </p>
                                                                <hr />
                                                            </div>
                                                            <Button onClick={() => this.listStudentsEnrolled(elem)} variant="outline-primary" className="mr-2 mt-2"> View Students Enrolled </Button>
                                                            <Button onClick={() => this.listVideoLecture(elem)} variant="outline-primary" className="mr-2 mt-2"> View Lectures List </Button>
                                                            <Button onClick={() => this.addVideoLecture(elem)} variant="outline-primary" className="mr-2 mt-2"> Add Lecture </Button>
                                                            <Button onClick={() => this.addTopic(elem)} variant="outline-primary" className="mr-2 mt-2">Add Topic</Button>
                                                            <Button onClick={() => this.listTopics(elem)} variant="outline-primary" className="mr-2 mt-2">List Topic</Button>
                                                            <Button onClick={() => this.addAnnoucement(elem)} variant="outline-primary" className="mr-2 mt-2">Add Annoucement</Button>
                                                            <Button onClick={() => this.listAnnoucement(elem)} variant="outline-primary" className="mr-2 mt-2">List Annoucement</Button>
                                                            <Button onClick={() => this.addAssignment(elem)} variant="outline-primary" className="mr-2 mt-2">Add Assignment</Button>
                                                            <Button onClick={() => this.listAssignment(elem)} variant="outline-primary" className="mr-2 mt-2">List Assignment</Button>
                                                            <Button onClick={() => this.addQuiz(elem)} variant="outline-primary" className="mr-2 mt-2">Add Quiz</Button>
                                                            <Button onClick={() => this.listQuiz(elem)} variant="outline-primary" className="mr-2 mt-2">List Quiz</Button>
                                                            <Button onClick={() => this.addCourseMaterial(elem)} variant="outline-primary" className="mr-2 mt-2">Add Course Material</Button>
                                                            <Button onClick={() => this.listCourseMaterial(elem)} variant="outline-primary" className="mr-2 mt-2">List Course Material</Button>
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

export default connect(mapStateToProps, null)(Classes);

import React from 'react';
import { Row, Col, Table, Button, Modal, Card, Form } from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import axios from 'axios';
import config from '../../../config';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Loader from '../../../App/layout/Loader';
import { connect } from 'react-redux';
import fileDownload from 'js-file-download';

class SubmissionList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            downloadRowId: null,
            marksRowId: null,
            elem: {}, 
            showModal: false,
            showModalMarks: false,
			handleCloseModal: false,
            isValid: {
                value: false,
                text: ''   
            },
            data: [],
            class_id: '',
            title: '',
            assignment: {},
            obtained_marks: 0
        }
    }

    openDownloadModal(value) {
		this.setState({ showModal: true, downloadRowId: value.id, elem: value });
    }

    openMarksModal(value) {
		this.setState({ showModalMarks: true, marksRowId: value.id, elem: value });
    }
    
	closeDownloadModal() {
		this.setState({ showModal: false });
    }
    
	closeMarksModal() {
		this.setState({ showModalMarks: false });
    }

    handleDownload() {
        this.setState({ showModal: false, isLoading: true });
        axios.get(`${config.prod}/${this.state.elem.file}`, {
            responseType: 'blob',
          }).then(res => {
            fileDownload(res.data, `${this.state.elem.user.u_id}-${this.state.elem.file}`);
            this.setState({ isLoading: false });
          });
    }

    handleTextChange(event) {
        this.setState({ [event.name]: event.value });
    }

    handleMarks() {
        const { obtained_marks, assignment, marksRowId } = this.state;
        
        if (obtained_marks < 0 || obtained_marks > assignment.total_marks) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Marks', name: 'obtained_marks' }});
            return;
        }
        
        this.setState({ isLoading: true, showModalMarks: false });
        axios.post(`${config.prod}/api/class/assignment/submission/update`, {
            obtained_marks: obtained_marks, submission_id: marksRowId
          })
          .then(res => {
            this.setState({ showModalMarks: false });
            this.getSubmissionList();
          })
          .catch(err => {
                console.log('Error: ', err.response);
                if (err.response && err.response.status && (err.response.status === 400 || err.response.status === 500)) {
                    if (err.response.status === 500) {
                        this.setState({ isValid: { value: true, text: 'Internal Server Error', name:'server_error' }, showModalMarks: true });
                    } else {
                        this.setState({ isValid: { value: true, text: err.response.data.msg, name:'server_error' }, showModalMarks: true });
                    }
                } else {
                    this.setState({ isValid: { value: true, text: 'Unknown Error', name:'server_error' }, showModalMarks: true });
                    //this.createNotification('error', 'Unknown Error');
                }
            });
    }

    componentDidMount = async () => {
        if (this.props && this.props.user && this.props.user.id && this.props.match && this.props.match.params && this.props.match.params.id && this.props.match.params.assign_id) {
            await this.setState({ class_id: this.props.match.params.id, assign_id: this.props.match.params.assign_id })
            this.getSubmissionList();
        }
    }
    
    getSubmissionList() {
        this.setState({ isLoading: true });
		axios.get(`${config.prod}/api/class/assignment/${this.state.assign_id}/submission/list`)
			.then(response => {
                let data = response.data.data;
				this.setState({ data: data, assignment: data.length ? data[0].assignment: {}, isLoading: false });
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
		this.setState({ showModal: false });
    }
    
    cancelMarks() {
		this.setState({ showModalMarks: false, isValid: { value: false } });
    }

    goBack(e) {
        e.preventDefault();
        this.props.history.push(`/faculty/class/${this.state.class_id}/assignment/list`);
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
                    {this.state.showModal && 
                        <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
                            <Modal.Header closeButton>
                                <Modal.Title>Download Confirm</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Are you sure to want to download?</Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" onClick={() => this.handleDownload()}>
                                    OK
                                </Button>
                                <Button variant="secondary" onClick={() => this.cancelDownload()}>
                                    Cancel
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    }
                    { this.state.showModalMarks && 
                        <Modal show={this.state.showModalMarks} onHide={() => this.setState({ showModalMarks: false, isValid: { value: false } })}>
                            <Modal.Header closeButton>
                                <Modal.Title>Confirm Obtained Marks</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Row>
                                    <Col xs={12}>
                                        <Form>
                                            <Form.Row>
                                                <Col>
                                                    <Form.Group className="mb-2" controlId="formBasicEmail">
                                                        <Form.Label>Obtained Marks</Form.Label>
                                                        <Form.Control 
                                                            type="number" 
                                                            name="obtained_marks" 
                                                            min={0}
                                                            max={ this.state.assignment.total_marks ? this.state.assignment.total_marks : 10 }
                                                            placeholder="Obtained Marks" 
                                                            value={this.state.obtained_marks}
                                                            className={this.state.isValid.value && this.state.isValid.name === 'obtained_marks' ? 'in-valid-input' : ''}
                                                            onFocus={() => this.setState({ isValid: { value: false, text: ''}})}
                                                            onChange={(e) => this.handleTextChange(e.target) }
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Form.Row>
                                            <Form.Row>
                                                {
                                                    this.state.isValid.value ?
                                                    <Form.Text style={{ color: 'red' }}>
                                                        { this.state.isValid.text }
                                                    </Form.Text> : ''
                                                }
                                            </Form.Row>
                                        </Form>
                                    </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" onClick={() => this.handleMarks()}>
                                    Save
                                </Button>
                                <Button variant="secondary" onClick={() => this.cancelMarks()}>
                                    Cancel
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    }
                    <NotificationContainer/>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Submitted Assignments <b>{ this.state.assignment.title ? this.state.assignment.title : null }</b></Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <Table striped bordered hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>First Name</th>
                                                    <th>Last Name</th>
                                                    <th>U ID</th>
                                                    <th>Total Marks</th>
                                                    <th>Obtained Marks</th>
                                                    <th>Submission</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.state.data.map((elem, i) => (
                                                        <tr key={i}>
                                                            <td>{elem.user.first_name}</td>
                                                            <td>{elem.user.last_name}</td>
                                                            <td>{elem.user.u_id}</td>
                                                            <td>{elem.assignment.total_marks}</td>
                                                            <td>{elem.obtained_marks}</td>
                                                            <td>
                                                                <Button style={{ width: '100%' }} onClick={(e) => this.openDownloadModal(elem)} variant='primary'>Download</Button>
                                                                <br /><Button style={{ width: '100%' }} onClick={(e) => this.openMarksModal(elem)} variant='outline-primary'>Add Marks</Button>
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

export default connect(mapStateToProps, null)(SubmissionList);

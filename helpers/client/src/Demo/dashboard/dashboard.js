import React from 'react';
import { Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import Aux from "../../hoc/_Aux";
import axios from 'axios';
import 'react-table/react-table.css';
import config from '../../config';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Loader from '../../App/layout/Loader'
var moment = require('moment');

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
			deletedRowId: null,
			showModal: false,
			handleCloseModal: false,
            title: "",
            status: true,
            isValid: {
                value: false,
                text: ''   
            },
            recordToUpdate: '', 
            isEdit: false,
            data: [],
			columns: [
				{
					Header: 'Date Time',
					accessor: 'updatedAt',
                    Cell: row => <p className="cell-custom">{ moment(row.value).format('MM/DD/YYYY HH:mm:ss') }</p>
				}, 
				{
					Header: 'Job Title',
					accessor: 'job_title',
                    Cell: row => <p className="cell-custom">{ row.value }</p>
				}, 
				{
					Header: 'Status',
					accessor: 'active',
                    Cell: row => <p className="cell-custom">{ row.value ? 'active': 'inactive' }</p>
                },
                {
                    Header: 'Actions',
                    Cell: row => (
                        <div className="action-btn">
                            <Button  variant="warning" onClick={() => this.handleEdit(row.original)}>Edit</Button>
                            <Button  variant="danger" onClick={() => this.openDeleteModal(row.original)}>Delete</Button>
                        </div>
                    )
                }
			],
        }
    }

    handleTextChange(value) {
        this.setState({ title: value });
    }

    handleEdit(value) {
        this.setState({ isEdit: true, recordToUpdate: value.id, title: value.job_title, status: value.active });
    }

    openDeleteModal(value) {
		this.setState({ isEdit: false, title: value.job_title, status: true, showModal: true, deletedRowId: value.id });
	}
	closeDeleteModal() {
		this.setState({ showModal: false });
    }
    
    handleDelete() {
        this.setState({ showModal: false, isLoading: true });
		axios.delete(`${config.prod}/api/choices/jobtitle/delete/${this.state.deletedRowId}`, { data: { id: this.state.deletedRowId } })
			.then(response => {
				this.createNotification('success', 'Job Title Deleted Successfully');
				this.getJobTitleList();
				this.setState({ isLoading: false, title: '' });
			})
			.catch(err => {
				this.setState({ isLoading: false, title: '' });
				console.log('Error: deleting data from db ', err.response);
                this.createNotification('error', 'Error while deleting data from db');
			});
    }


    componentDidMount() {
        this.getJobTitleList();
    }
    
    getJobTitleList() {
        // this.setState({ isLoading: true });
		// axios.get(`${config.prod}/api/choices/jobtitle/list`)
		// 	.then(response => {
		// 		this.setState({ data: response.data.results, isLoading: false });
		// 	})
		// 	.catch(err => {
		// 		this.setState({ isLoading: false });
		// 		console.log('Error: getting data from db ', err.response);
        //             this.createNotification('error', 'Error while Getting data from db');
		// 	});
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

    cancelEdit() {
		this.setState({ 
			isEdit: false,
			title: ''
		})
    }
    cancelDelete() {
		this.setState({ 
            isEdit: false,
            showModal: false,
			title: ''
		})
    }
    
    handleSubmit(e) {
        e.preventDefault();
        if (this.state.title.trim().length === 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid title' } });
            return;
        }

        if(!this.state.isEdit) {
			this.setState({ isLoading: true });
            axios.post(`${config.prod}/api/choices/jobtitle/create`, { job_title: this.state.title, active: this.state.status })
                .then(response => {
                    this.setState({ isEdit: false, title: '', status: true, isLoading: false });
                    this.createNotification('success', 'Job Title Created Successfully');
                    this.getJobTitleList();
                })
                .catch(err => {
					console.log('Error: ', err.response);
					this.setState({ isLoading: false });
                    if (err.response && err.response.status && ( err.response.status === 409 || err.response.status === 400 || err.response.status === 500)) {
                        this.setState({ isValid: { value: true, text: err.response.data.msg } });
                        this.createNotification('error', err.response.data.msg);
                    } else {
                        this.setState({ isValid: { value: true, text: 'Unknown Error' } });
                        this.createNotification('error', 'Unknown Error');
                    }
                });
            
        } else {
			this.setState({ isLoading: true });
            axios.put(`${config.prod}/api/choices/jobtitle/update/${this.state.recordToUpdate}`, { id: this.state.recordToUpdate, job_title: this.state.title, active: this.state.status })
                .then(response => {
                    this.setState({ isEdit: false, title: '', status: true, isLoading: false });
                    this.createNotification('success', 'Job Title Updated Successfully');
                    this.getJobTitleList();
                })
                .catch(err => {
					console.log('Error: ', err.response);
					this.setState({ isLoading: false });
                    if (err.response && err.response.status && ( err.response.status === 409 || err.response.status === 400 || err.response.status === 500)) {
                        this.setState({ isValid: { value: true, text: err.response.data.msg } });
                        this.createNotification('error', err.response.data.msg);
                    } else {
                        this.setState({ isValid: { value: true, text: 'Unknown Error' } });
                        this.createNotification('error', 'Unknown Error');
                    }
                });
        }

    }

    render() {
        return (
            <Aux>
                {this.state.isLoading && <Loader />}
				{this.state.showModal && 
					<Modal show={this.state.showModal} onHide={this.state.handleCloseModal}>
					<Modal.Header closeButton>
						<Modal.Title>Delete Confirm</Modal.Title>
					</Modal.Header>
					<Modal.Body>Are you sure to want to delete {this.state.title} </Modal.Body>
					<Modal.Footer>
						<Button variant="primary" onClick={() => this.handleDelete(this.state.deletedRowId)}>
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
                                <Card.Title as="h5">{this.state.isEdit ? 'Edit' : 'Create'} Job Title</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Form className="col-md-12" onSubmit={(e) => this.handleSubmit(e)}>
                                    <fieldset disabled={this.state.isLoading} className={this.state.isLoading ? 'opacity-5' : ''}>
                                        <Form.Row>
                                        <Col md={4} lg={5}>
                                            <Form.Group className="mb-2" controlId="formBasicEmail">
                                                <Form.Label>Title</Form.Label>
                                                <Form.Control 
                                                    type="text" 
                                                    name="title" 
                                                    placeholder="Job Title" 
                                                    value={this.state.title}
                                                    className={this.state.isValid.value ? 'in-valid-input' : ''}
                                                    onFocus={() => this.setState({ isValid: { value: false, text: ''}})}
                                                    onChange={(e) => this.handleTextChange(e.target.value) }
                                                />
                                                {
                                                    this.state.isValid.value ?
                                                    <Form.Text style={{ color: 'red' }}>
                                                        { this.state.isValid.text }
                                                    </Form.Text> : ''
                                                }
                                            </Form.Group>
                                        </Col>
                                        <Col md={4} lg={3}>
                                            <Form.Group className="mb-2" controlId="status">
                                                <div> <Form.Label>Status</Form.Label> </div>
                                                <div className="rg-pad">
                                                    <Form.Check
                                                        inline
                                                        custom
                                                        type="radio"
                                                        checked={this.state.status}
                                                        onChange={() => this.setState({ status: true })}
                                                        label="Active"
                                                        name="active"
                                                        id="supportedRadio21"
                                                    />
                                                    <Form.Check
                                                        inline
                                                        custom
                                                        type="radio"
                                                        label="Inactive"
                                                        checked={!this.state.status}
                                                        onChange={() => this.setState({ status: false })}
                                                        name="active"
                                                        id="supportedRadio22"
                                                    />
                                                </div>
                                                
                                            </Form.Group>
                                        </Col>
                                        <Col md={4} lg={4}>
                                            <div>
                                                <Button type="submit" className="mt-4" variant={this.state.isEdit ? "warning": "primary"}>
                                                    { this.state.isEdit ? 'Edit': 'Submit' }
                                                </Button>
                                                {   this.state.isEdit ? 
                                                    <Button className="mt-4" onClick={() => this.cancelEdit()} variant="info">
                                                        Cancel
                                                    </Button> : ''
                                                }
                                            </div>
                                        </Col>
                                        </Form.Row>
                                    </fieldset>
                                    </Form>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Aux>
        );
    }
}

export default Dashboard;

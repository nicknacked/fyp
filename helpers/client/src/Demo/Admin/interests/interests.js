import React from 'react';
import { Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import ReactTable from 'react-table';
import axios from 'axios';
import 'react-table/react-table.css';
import config from '../../../config';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Loader from '../../../App/layout/Loader';
var moment = require('moment');

class Interests extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
			deletedRowId: null,
			showModal: false,
			handleCloseModal: false,
            name: "",
            isValid: {
                value: false,
                text: ''   
            },
            data: [],
			columns: [
				{
					Header: 'Date Time',
					accessor: 'updatedAt',
                    Cell: row => <p className="cell-custom">{ moment(row.value).format('MM/DD/YYYY HH:mm:ss') }</p>
				}, 
				{
					Header: 'Name',
					accessor: 'name',
                    Cell: row => <p className="cell-custom">{ row.value }</p>
				}, 
				{
                    Header: 'Actions',
                    Cell: row => (
                        <div className="action-btn cell-custom">
                            <Button  variant="danger" onClick={() => this.openDeleteModal(row.original)}>Delete</Button>
                        </div>
                    )
                }
			],
        }
    }

    handleTextChange(value) {
        this.setState({ name: value });
    }

   
    openDeleteModal(value) {
		this.setState({ isEdit: false, name: value.name, status: true, showModal: true, deletedRowId: value.id });
    }
    
	closeDeleteModal() {
		this.setState({ showModal: false });
    }
    
    handleDelete() {
        this.setState({ showModal: false, isLoading: true });
		axios.delete(`${config.prod}/api/interest/delete`, { data: { interest_id: this.state.deletedRowId } })
			.then(response => {
				this.createNotification('success', 'Interest Deleted Successfully');
				this.getInterestList();
				this.setState({ isLoading: false, name: '' });
			})
			.catch(err => {
				this.setState({ isLoading: false, name: '' });
				console.log('Error: deleting data from db ', err.response);
                this.createNotification('error', 'Error while deleting data from db');
			});
    }


    componentDidMount() {
        this.getInterestList();
    }
    
    getInterestList() {
        this.setState({ isLoading: true });
		axios.get(`${config.prod}/api/interest/list`)
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
    
    handleSubmit(e) {
        e.preventDefault();
        let { name } = this.state;
        
        if (!name && name.trim().length === 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Interest Name' } });
            return;
        }

        this.setState({ isLoading: true });
        axios.post(`${config.prod}/api/interest/create`, { name: name.trim() })
            .then(response => {
                this.setState({ name: '', isLoading: false });
                this.createNotification('success', 'Interest Created Successfully');
                this.getInterestList();
            })
            .catch(err => {
                console.log('Error: ', err.response);
                this.setState({ isLoading: false });
                if (err.response && err.response.status && (err.response.status === 409 || err.response.status === 400 || err.response.status === 500)) {
                    this.setState({ isValid: { value: true, text: err.response.data.msg } });
                    this.createNotification('error', err.response.data.msg);
                } else {
                    this.setState({ isValid: { value: true, text: 'Unknown Error' } });
                    this.createNotification('error', 'Unknown Error');
                }
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
                                <Card.Title as="h5">Create Interest</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Form className="col-md-12" onSubmit={(e) => this.handleSubmit(e)}>
                                        <fieldset disabled={this.state.isLoading} className={this.state.isLoading ? 'opacity-5' : ''}>
                                            <Form.Row>
                                                <Col md={6} lg={7}>
                                                    <Form.Group className="mb-2" controlId="formBasicEmail">
                                                        <Form.Label>Interest Name</Form.Label>
                                                        <Form.Control 
                                                            type="text" 
                                                            name="name" 
                                                            placeholder="Interest Name" 
                                                            value={this.state.name}
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
                                                <Col md={6} lg={4}>
                                                    <div>
                                                        <Button type="submit" style={{ marginTop: '1.8rem' }} variant={"primary"}>
                                                            { 'Submit' }
                                                        </Button>
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
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Interest List</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <ReactTable 
                                            style={{ background: '#3f4d67', color: '#d3d5db' }}
                                            data={this.state.data}
                                            columns={this.state.columns}
                                            noDataText={"No Record Found."}
                                            minRows={10}
                                            minWidth={1500}
                                            loading={this.props.loading || false }
                                            loadingText={'Loading...'}
                                            defaultSorted={this.props.defaultSorted || [{ id: null, desc: true}]}
                                            showFilters={true}
                                            className='react-table -striped -highlight'
                                        />
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

export default Interests;

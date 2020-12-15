import React from 'react';
import { Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import ReactTable from 'react-table';
import axios from 'axios';
import 'react-table/react-table.css';
import config from '../../../config';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Loader from '../../../App/layout/Loader';

class Teachers extends React.Component {

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
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            u_id: '',
            data: [],
			columns: [
				{
					Header: 'First Name',
					accessor: 'first_name',
                    Cell: row => <p className="cell-custom">{ row.value }</p>
                }, 
                {
					Header: 'Last Name',
					accessor: 'last_name',
                    Cell: row => <p className="cell-custom">{ row.value }</p>
                },
                {
					Header: 'Email',
					accessor: 'email',
                    Cell: row => <p className="cell-custom">{ row.value }</p>
                },
                {
					Header: 'Status',
					accessor: 'status',
                    Cell: row => <p className="cell-custom">{ row.value ? 'true' : 'false' }</p>
                },
                {
					Header: 'ID',
					accessor: 'u_id',
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

    handleTextChange(event) {
        this.setState({ [event.name]: event.value });
    }

   
    openDeleteModal(value) {
		this.setState({ isEdit: false, name: value.name, status: true, showModal: true, deletedRowId: value.id });
    }
    
	closeDeleteModal() {
		this.setState({ showModal: false });
    }
    
    handleDelete() {
        this.setState({ showModal: false, isLoading: true });
		axios.delete(`${config.prod}/api/user/delete`, { data: { user_id: this.state.deletedRowId } })
			.then(response => {
				this.createNotification('success', 'Interest Deleted Successfully');
				this.getTeachersList();
				this.setState({ isLoading: false });
			})
			.catch(err => {
				this.setState({ isLoading: false });
				console.log('Error: deleting data from db ', err.response);
                this.createNotification('error', 'Error while deleting data from db');
			});
    }


    componentDidMount() {
        this.getTeachersList();
    }
    
    getTeachersList() {
        this.setState({ isLoading: true });
		axios.get(`${config.prod}/api/user/faculty/list`)
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
        let { firstName, lastName, email, password, u_id } = this.state;
        
        if (!firstName && firstName.trim().length === 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid First Name', name:'firstName' } });
            return;
        }

        if (!lastName && lastName.trim().length === 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Last Name', name:'lastName' } });
            return;
        }

        if (!email && email.trim().length === 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid email', name:'email' } });
            return;
        }

        if (!password && password.trim().length === 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid password', name:'password' } });
            return;
        }

        if (!u_id || u_id.trim().length === 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Faculty ID', name: 'u_id' } });
            return;
        }

        let u_idTrim = u_id.trim();
        let checkAlphabet = /^[A-Z]/;
        let checkDigit = /^\d+$/;
        if (u_idTrim.length < 9 || u_idTrim.length > 9 || !(u_idTrim.charAt(0) === 'U') || (!checkAlphabet.test(u_idTrim.charAt(8))) || !checkDigit.test(u_idTrim.substr(1,7))) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Faculty ID', name: 'u_id' } });
            return;
        }

        this.setState({ isLoading: true });
        axios.post(`${config.prod}/api/user/create`, { firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), password: password.trim(), u_id: u_idTrim  })
            .then(response => {
                this.setState({ name: '', isLoading: false });
                this.createNotification('success', 'User Created Successfully');
                this.getTeachersList();
            })
            .catch(err => {
                console.log('Error: ', err.response);
                this.setState({ isLoading: false });
                if (err.response && err.response.status && (err.response.status === 401 || err.response.status === 400 || err.response.status === 500)) {
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
                        <Modal.Body>Are you sure to want to delete</Modal.Body>
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
                                <Card.Title as="h5">Add Teacher</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Form className="col-md-12" onSubmit={(e) => this.handleSubmit(e)}>
                                        <fieldset disabled={this.state.isLoading} className={this.state.isLoading ? 'opacity-5' : ''}>
                                            <Form.Row>
                                                <Col md={6} lg={6}>
                                                    <Form.Group className="mb-2" controlId="formBasicEmail">
                                                        <Form.Label>First Name</Form.Label>
                                                        <Form.Control 
                                                            type="text" 
                                                            name="firstName" 
                                                            placeholder="First Name" 
                                                            value={this.state.firstName}
                                                            className={this.state.isValid.value && this.state.isValid.name === 'firstName' ? 'in-valid-input' : ''}
                                                            onFocus={() => this.setState({ isValid: { value: false, text: ''}})}
                                                            onChange={(e) => this.handleTextChange(e.target) }
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6} lg={6}>
                                                    <Form.Group className="mb-2" controlId="formBasicEmail">
                                                        <Form.Label>Last Name</Form.Label>
                                                        <Form.Control 
                                                            type="text" 
                                                            name="lastName" 
                                                            placeholder="Last Name" 
                                                            value={this.state.lastName}
                                                            className={this.state.isValid.value && this.state.isValid.name === 'lastName' ? 'in-valid-input' : ''}
                                                            onFocus={() => this.setState({ isValid: { value: false, text: ''}})}
                                                            onChange={(e) => this.handleTextChange(e.target) }
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Form.Row>
                                            <Form.Row>
                                                <Col md={6} lg={6}>
                                                    <Form.Group className="mb-2" controlId="formBasicEmail">
                                                        <Form.Label>Email</Form.Label>
                                                        <Form.Control 
                                                            type="email" 
                                                            name="email" 
                                                            placeholder="Email" 
                                                            value={this.state.email}
                                                            className={this.state.isValid.value && this.state.isValid.name === 'email' ? 'in-valid-input' : ''}
                                                            onFocus={() => this.setState({ isValid: { value: false, text: ''}})}
                                                            onChange={(e) => this.handleTextChange(e.target) }
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6} lg={6}>
                                                    <Form.Group className="mb-2" controlId="formBasicEmail">
                                                        <Form.Label>Password</Form.Label>
                                                        <Form.Control 
                                                            type="password" 
                                                            name="password" 
                                                            placeholder="Password" 
                                                            value={this.state.password}
                                                            className={this.state.isValid.value && this.state.isValid.name === 'password' ? 'in-valid-input' : ''}
                                                            onFocus={() => this.setState({ isValid: { value: false, text: ''}})}
                                                            onChange={(e) => this.handleTextChange(e.target) }
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Form.Row>
                                            <Form.Row>
                                                <Col md={6} lg={6}>
                                                    <Form.Group className="mb-2" controlId="formBasicEmail">
                                                        <Form.Label>University ID</Form.Label>
                                                        <Form.Control 
                                                            type="text" 
                                                            name="u_id" 
                                                            placeholder="University ID" 
                                                            value={this.state.u_id}
                                                            className={this.state.isValid.value && this.state.isValid.name === 'u_id' ? 'in-valid-input' : ''}
                                                            onFocus={() => this.setState({ isValid: { value: false, text: ''}})}
                                                            onChange={(e) => this.handleTextChange(e.target) }
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6} lg={6}>
                                                    <Form.Label>Submit</Form.Label>
                                                    <div>
                                                        <Button type="submit" style={{ width: '100%', marginBottom: 0, marginRight: 0 }} variant={"primary"}>
                                                            { 'Submit' }
                                                        </Button>
                                                    </div>
                                                </Col>
                                            </Form.Row>
                                            <Form.Row>
                                                <Col>
                                                    {
                                                        this.state.isValid.value ?
                                                        <Form.Text style={{ color: 'red' }}>
                                                            { this.state.isValid.text }
                                                        </Form.Text> : ''
                                                    }
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
                                <Card.Title as="h5">Teachers List</Card.Title>
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

export default Teachers;

import React from 'react';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import ReactTable from 'react-table';
import axios from 'axios';
import 'react-table/react-table.css';
import config from '../../../config';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Loader from '../../../App/layout/Loader';

class Students extends React.Component {

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
		axios.delete(`${config.prod}/api/interest/delete`, { data: { user_id: this.state.deletedRowId } })
			.then(response => {
				this.createNotification('success', 'Interest Deleted Successfully');
				this.getStudentsList();
				this.setState({ isLoading: false, name: '' });
			})
			.catch(err => {
				this.setState({ isLoading: false, name: '' });
				console.log('Error: deleting data from db ', err.response);
                this.createNotification('error', 'Error while deleting data from db');
			});
    }


    componentDidMount() {
        this.getStudentsList();
    }
    
    getStudentsList() {
        this.setState({ isLoading: true });
		axios.get(`${config.prod}/api/user/user/list`)
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
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Students List</Card.Title>
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

export default Students;

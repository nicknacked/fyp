import React from 'react';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import Aux from "../../hoc/_Aux";
import ReactTable from 'react-table';
import axios from 'axios';
import 'react-table/react-table.css';
import './PersonList.css';
import config from '../../config';
import Loader from '../../App/layout/Loader'
import { NotificationContainer, NotificationManager } from 'react-notifications';

class PersonList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            status: true,
            isLoading: false,
            isValid: {
                value: false,
                text: ''   
            },
            recordToUpdate: '', 
            isEdit: false,
            data: [],
            show: false,
            selected_person: {},
			columns: [
                {
                    Header: 'Actions',
                    width: 250,
                    Cell: row => (
                        <div className="action-btn">
                            <Button  variant="primary" onClick={() => this.handleDetails(row.original)}>Details</Button>
                            <Button  variant="warning" onClick={() => this.handleEdit(row.original)}>Edit</Button>
                            <Button  variant="danger" onClick={() => this.handleDelete(row.original)}>Delete</Button>
                        </div>
                    )
                },
				{
					Header: 'Date Time',
                    accessor: 'updatedAt',
                    filterable: true,
                    Cell: row => <p className="cell-custom">{ row.value }</p>,
                    width: 200 
				}, 
				{
					Header: 'First Name',
                    accessor: 'first_name',
                    width: 200,
                    filterable: true,
                    Cell: row => <p className="cell-custom">{ row.value }</p>
				}, 
				{
					Header: 'Last Name',
                    accessor: 'last_name',
                    width: 200,
                    filterable: true,
                    Cell: row => <p className="cell-custom">{ row.value }</p>
                },
                {
					Header: 'Email',
                    accessor: 'email',
                    width: 200,
                    filterable: true,
                    Cell: row => <p className="cell-custom">{ row.value }</p>
                },
                {
					Header: 'Phone',
                    accessor: 'phone',
                    width: 200,
                    filterable: true,
                    Cell: row => <p className="cell-custom">{ row.value }</p>
                },
                {
					Header: 'Base Location',
                    accessor: 'base_location',
                    width: 200,
                    filterable: true,
                    Cell: row => <p className="cell-custom">{ row.value }</p>
                },
                {
					Header: 'Date of Origin',
                    accessor: 'date_of_origin',
                    width: 200,
                    filterable: true,
                    Cell: row => <p className="cell-custom">{ row.value }</p>
                },
                {
					Header: 'Folder',
                    accessor: 'folder',
                    width: 200,
                    filterable: true,
                    Cell: row => <p className="cell-custom">{ row.value }</p>
                },
                {
					Header: 'CV',
                    accessor: 'cv',
                    filterable: true,
                    Cell: row => <p className="cell-custom">{ row.value }</p>
                },
                {
					Header: 'GDPR Status Date',
                    accessor: 'gdpr_status_date',
                    width: 200,
                    filterable: true,
                    Cell: row => <p className="cell-custom">{ row.value }</p>
                },
                {
					Header: 'Contract to Date',
                    accessor: 'contract_to_date',
                    width: 200,
                    filterable: true,
                    Cell: row => <p className="cell-custom">{ row.value }</p>
                },
                {
					Header: 'Client Base Location',
                    accessor: 'client_base_location',
                    width: 200,
                    filterable: true,
                    Cell: row => <p className="cell-custom">{ row.value }</p>
                },
                {
					Header: 'Client Manager',
                    accessor: 'client_manager',
                    width: 200,
                    filterable: true,
                    Cell: row => <p className="cell-custom">{ row.value }</p>
                },
                {
                    id: 'job_title',
					Header: 'Job Title',
                    accessor: d => d.job_title_choice && d.job_title_choice.job_title ? d.job_title_choice.job_title : d.job_title,
                    width: 200,
                    filterable: true,
                    Cell: row => <p className="cell-custom">{ row.value }</p>
                },
                {
                    id: 'available',
					Header: 'Available',
                    accessor: d => d.available && d.available.available ? d.available.available : d.available,
                    width: 200,
                    filterable: true,
                    Cell: row => <p className="cell-custom">{ row.value }</p>
                },
                {
                    id: 'clearence',
					Header: 'Clearance',
                    accessor: d => d.clearance_choice && d.clearance_choice.clearance ? d.clearance_choice.clearance : d.clearance,
                    width: 200,
                    filterable: true,
                    Cell: row => <p className="cell-custom">{ row.value }</p>
                },
                {
                    id: 'gdpr',
					Header: 'GDPR',
                    accessor: d => d.gdpr_choice && d.gdpr_choice.gdpr ? d.gdpr_choice.gdpr : d.gdpr,
                    width: 200,
                    filterable: true,
                    Cell: row => <p className="cell-custom">{ row.value }</p>
                },
                {
                    id: 'willing_to_travel',
					Header: 'Willing to Travel',
                    accessor: d => d.travel_choice && d.travel_choice.travel ? d.travel_choice.travel : d.travel,
                    width: 200,
                    filterable: true,
                    Cell: row => <p className="cell-custom">{ row.value }</p>
                },
                {
                    id: 'origin',
					Header: 'Origin',
                    accessor: d => d.origin_choice && d.origin_choice.origin ? d.origin_choice.origin : d.origin,
                    width: 200,
                    filterable: true,
                    Cell: row => <p className="cell-custom">{ row.value }</p>
                },
                {
                    id: 'clients',
					Header: 'Clients',
                    accessor: data => {
                        let output = [];
                        data.clients.forEach(client => {
                            output.push(client.clients);
                        });
                        return output.join(', ');
                    },
                    filterable: true,
                    width: 200,
                    Cell: row => <p className="cell-custom">{ row.value}</p>
                },
                {
                    id: 'key_skills',
                    Header: 'key Skills',
                    filterable: true,
                    accessor: data => {
                        let output = [];
                        data.skills_choices.forEach(skill => {
                            output.push(skill.skill);
                        });
                        return output.join(', ');
                    },
                    width: 200,
                    Cell: row => <p className="cell-custom">{ row.value}</p>
                },
                {
					Header: 'Notes',
                    accessor: 'notes',
                    width: 200,
                    filterable: true,
                    Cell: row => <p className="cell-custom">{ row.value }</p>
                },

            ],
        }
    }

    clientsRender(data) {
        let output = [];
        if (this.state.show) {
            data.clients.forEach(client => {
                output.push(client.clients);
            });
        }
        return output.join(', ');
    }

    skillsRender(data) {
        let output = [];
        if (this.state.show) {
            data.skills_choices.forEach(skill => {
                output.push(skill.skill);
            });
        }
        return output.join(', ');
    }

    handleEdit(value) {
        this.props.history.push(`/person/update/${value.id}`);  
    }

    handleDetails(value) {
        this.setState({ show: true, selected_person: value });
    }

    handleDelete(value) {
       axios.delete(`${config.prod}/api/person/delete`,{ data: { id: value.id } })
            .then(response => {
                this.createNotification('success', 'Person Deleted Successfully');
                this.getPersonList();
            })
            .catch(err => {
                console.log('Error: deleting Person from db ', err.response);
            });
    }


    componentDidMount() {
        this.getPersonList();
    }
    
    getPersonList() {
        this.setState({ isLoading: true });
        axios.get(`${config.prod}/api/persons`)
            .then(response => {
                this.setState({ data: response.data.results, isLoading: false });
            })
            .catch(err => {
                console.log('Error: getting data from db ', err.response);
                    this.createNotification('error', 'Error while Getting data from db');
                    this.setState({ isLoading: false });
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

    render() {
        return (
            <Aux>
                {this.state.isLoading && <Loader />}
                <Row>
                    <NotificationContainer/>
                    <Modal 
                        show={this.state.show}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered  
                    >
                        <Modal.Header closeButton>
                            <Modal.Title style={{ color: '#111111'}}>Person Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col md={6}>
                                    <p><b style={{ color: '#111111' }}>First Name: </b> { this.state.selected_person.first_name } </p>
                                </Col>
                                <Col md={6}>
                                    <p><b style={{ color: '#111111' }}>Last Name: </b> { this.state.selected_person.last_name } </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <p><b style={{ color: '#111111' }}>Email: </b> { this.state.selected_person.email } </p>
                                </Col>
                                <Col md={6}>
                                    <p><b style={{ color: '#111111' }}>Phone: </b> { this.state.selected_person.phone } </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <p><b style={{ color: '#111111' }}>Base Location: </b> { this.state.selected_person.base_location } </p>
                                </Col>
                                <Col md={6}>
                                    <p><b style={{ color: '#111111' }}>Client Base Location: </b> { this.state.selected_person.client_base_location } </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <p><b style={{ color: '#111111' }}>Client Manager: </b> { this.state.selected_person.client_manager } </p>
                                </Col>
                                <Col md={6}>
                                    <p><b style={{ color: '#111111' }}>Clearance: </b> { this.state.selected_person.clearance && this.state.selected_person.clearance.clearance ? this.state.selected_person.clearance.clearance : '' } </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <p><b style={{ color: '#111111' }}>Date Of Origin: </b> { this.state.selected_person.date_of_origin } </p>
                                </Col>
                                <Col md={6}>
                                    <p><b style={{ color: '#111111' }}>Contract To Date: </b> { this.state.selected_person.contract_to_date } </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <p><b style={{ color: '#111111' }}>GDPR: </b> { this.state.selected_person.gdpr_choice && this.state.selected_person.gdpr_choice.gdpr ?  this.state.selected_person.gdpr_choice.gdpr : '' } </p>
                                </Col>
                                <Col md={6}>
                                    <p><b style={{ color: '#111111' }}>GDPR Status Date: </b> { this.state.selected_person.gdpr_status_date } </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <p><b style={{ color: '#111111' }}>Job Title: </b> { this.state.selected_person.job_title_choice && this.state.selected_person.job_title_choice.title ?  this.state.selected_person.job_title_choice.title : '' } </p>
                                </Col>
                                <Col md={6}>
                                    <p><b style={{ color: '#111111' }}>Available: </b> { this.state.selected_person.available && this.state.selected_person.available.available ? this.state.selected_person.available.available : '' } </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <p><b style={{ color: '#111111' }}>Origin: </b> { this.state.selected_person.origin_choice && this.state.selected_person.origin_choice.origin ?  this.state.selected_person.origin_choice.origin : '' } </p>
                                </Col>
                                <Col md={6}>
                                    <p><b style={{ color: '#111111' }}>Willing To Travel: </b> { this.state.selected_person.travel_choice && this.state.selected_person.travel_choice.travel ? this.state.selected_person.travel_choice.travel : '' } </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <p><b style={{ color: '#111111' }}>Clients: </b> { this.clientsRender(this.state.selected_person) } </p>
                                </Col>
                                <Col md={6}>
                                    <p><b style={{ color: '#111111' }}>Skills: </b> { this.skillsRender(this.state.selected_person) } </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <p><b style={{ color: '#111111' }}>Folder: </b> { this.state.selected_person.folder } </p>
                                </Col>
                                <Col md={6}>
                                    <p><b style={{ color: '#111111' }}>CV: </b> { this.state.selected_person.cv } </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p><b style={{ color: '#111111' }}>Notes: </b> { this.state.selected_person.notes } </p>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.setState({ show: false }) }>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Person List</Card.Title>
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

export default PersonList;

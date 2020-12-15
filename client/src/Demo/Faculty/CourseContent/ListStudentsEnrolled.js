import React from 'react';
import { Row, Col, Table, Card, Button } from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import axios from 'axios';
import config from '../../../config';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Loader from '../../../App/layout/Loader';
import { connect } from 'react-redux';

class ListStudentsEnrolled extends React.Component {

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

    componentDidMount = async () => {
        if (this.props && this.props.user && this.props.user.id && this.props.match && this.props.match.params && this.props.match.params.id) {
            await this.setState({ class_id: this.props.match.params.id })
            this.getStudentsEnrolledList();
        }
    }
    
    openStudentHistory(value) {
        this.props.history.push(`/faculty/class/${this.state.class_id}/user/${value.id}/history`);
    }

    openStudentProgress(value) {
        this.props.history.push(`/faculty/class/${this.state.class_id}/user/${value.id}/progress`);
    }
    
    getStudentsEnrolledList() {
        this.setState({ isLoading: true });
		axios.get(`${config.prod}/api/class/${this.state.class_id}/student/list`)
			.then(response => {
                let data = response.data.data;
				this.setState({ data: data.users ? data.users: [], isLoading: false });
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
        this.props.history.push(`/faculty/class/list`);
    }
    
    clustering(e) {
        e.preventDefault();
        this.props.history.push(`/faculty/class/${this.state.class_id}/clustering`);
    }

    render() {
        return (
            <Aux>
                {this.state.isLoading && <Loader />}
                <Row>
                    <Col>
                        <Button onClick={(e) => this.goBack(e) } variant='outline-dark'>Back</Button>
                        <Button onClick={(e) => this.clustering(e) } variant='outline-primary'>Clustering</Button>
                    </Col>
                </Row>
			    <Row>
                    <NotificationContainer/>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Enrolled Students</Card.Title>
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
                                                    <th>Joined Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.state.data.map((elem, i) => (
                                                        <tr key={i}>
                                                            <td>{elem.first_name}</td>
                                                            <td>{elem.last_name}</td>
                                                            <td>{elem.u_id}</td>
                                                            <td>{new Date(elem.createdAt).toString()}</td>
                                                            <td>
                                                                <Button onClick={(e) => this.openStudentHistory(elem)} style={{ width: "100%" }} variant='primary'>Check History</Button><br />
                                                                <Button onClick={(e) => this.openStudentProgress(elem)} style={{ width: "100%" }} variant='outline-primary'>Check Progress</Button>
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

export default connect(mapStateToProps, null)(ListStudentsEnrolled);

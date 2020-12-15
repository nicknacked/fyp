import React from 'react';
import { Row, Col, Card, Button, Table } from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import axios from 'axios';
import config from '../../../config';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Loader from '../../../App/layout/Loader';
import { connect } from 'react-redux';

class StudentProgress extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isValid: {
                value: false,
                text: ''   
            },
            data: [],
            class_id: '',
            user_id: '',
            user: { first_name: '', last_name: '', email: '', u_id: '' },
            assignments: [],
            quizes: []
        }

    }

    componentDidMount = async () => {
        if (this.props && this.props.user && this.props.user.id && this.props.match && this.props.match.params && this.props.match.params.id && this.props.match.params.user_id) {
            await this.setState({ class_id: this.props.match.params.id, user_id: this.props.match.params.user_id });
            this.getStudentsHistory();
        }
    }
    
    getStudentsHistory() {
        this.setState({ isLoading: true });
		axios.get(`${config.prod}/api/progress/class/${this.state.class_id}/user/${this.state.user_id}/list`)
			.then(response => {
                let data = response.data.data;
				this.setState({ data: data, user: data.user, assignments: data.assignments, quizes: data.quizes, isLoading: false });
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
    
    roundedMarks(value) {
        return Math.round((value + Number.EPSILON) * 100) / 100;
    }
    
    goBack(e) {
        e.preventDefault();
        this.props.history.push(`/faculty/class/${this.state.class_id}/students/list`);
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
                    <Col md={12}>
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <div><b>First Name: </b> { this.state.user.first_name } </div>
                                        <div><b>Last Name: </b> { this.state.user.last_name } </div>
                                    </Col>
                                    <Col>
                                        <div><b>Email: </b> { this.state.user.email } </div>
                                        <div><b>u_id: </b> { this.state.user.u_id } </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Assignments</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <Table striped bordered hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>Title</th>
                                                    <th>Total Marks</th>
                                                    <th>Obtained Marks</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.state.assignments.map((elem, i) => (
                                                        <tr key={i}>
                                                            <td>{ elem.title }</td>
                                                            <td>{ elem.total_marks }</td>
                                                            <td>{ Object.keys(elem.assignment_submissions).length ? elem.assignment_submissions.obtained_marks ? elem.assignment_submissions.obtained_marks : 0 : 0 }</td>
                                                            <td>
                                                                { Object.keys(elem.assignment_submissions).length ? 'Submitted' : 'Not Submitted'}
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
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Quiz</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <Table striped bordered hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>Title</th>
                                                    <th>Total Marks</th>
                                                    <th>Obtained Marks</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.state.quizes.map((elem, i) => (
                                                        <tr key={i}>
                                                            <td>{ elem.title }</td>
                                                            <td>{ elem.total_marks }</td>
                                                            <td>{ Object.keys(elem.quiz_submissions).length ? elem.quiz_submissions.obtained_marks ? elem.quiz_submissions.obtained_marks : 0 : 0 }</td>
                                                            <td>
                                                                { Object.keys(elem.quiz_submissions).length ? 'Submitted' : 'Not Submitted'}
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

export default connect(mapStateToProps, null)(StudentProgress);

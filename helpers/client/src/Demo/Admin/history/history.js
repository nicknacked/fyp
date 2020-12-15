import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import axios from 'axios';
import config from '../../../config';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Loader from '../../../App/layout/Loader';
import { connect } from 'react-redux';

class History extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isValid: {
                value: false,
                text: ''   
            },
            data: [],
            dataToView: { 
                interests: 0, classes: 0, enrolledClasses: 0, generalTopics: 0, lectures: 0, 
                topics: 0, annoucements: 0, assignments: 0, quizes: 0, couresMaterial: 0,
                interests_time_spent: 0, classes_time_spent: 0, enrolledClasses_time_spent: 0, generalTopics_time_spent: 0, lectures_time_spent: 0, 
                topics_time_spent: 0, annoucements_time_spent: 0, assignments_time_spent: 0, quizes_time_spent: 0, couresMaterial_time_spent: 0  
            }
         
        }

    }

    componentDidMount = async () => {
        this.getStudentsHistory();
    }
    
    getStudentsHistory() {
        this.setState({ isLoading: true });
		axios.get(`${config.prod}/api/history/list`)
			.then(response => {
                let data = response.data.data;
                this.setState({ data: data, dataToView: data, isLoading: false });
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
    
    roundedTime(value) {
        return Math.round((value + Number.EPSILON) * 100) / 100;
    }

    refresh(e) {
        e.preventDefault();
        this.getStudentsHistory();
    }

    reset(e) {
        e.preventDefault();
        this.setState({ isLoading: true });
        let date = new Date().toISOString();
		axios.post(`${config.prod}/api/history/reset`, { date })
			.then(response => {
                this.createNotification('success', 'Reset history successfully');
                this.getStudentsHistory();
			})
			.catch(err => {
				this.setState({ isLoading: false });
				console.log('Error: reseting history', err.response);
                this.createNotification('error', 'Error while Reset history');
			});
    }
    
    clustering(e) {
        e.preventDefault();
        this.props.history.push(`/admin/dashboard/clustering`);
    }
    
    render() {
        return (
            <Aux>
                {this.state.isLoading && <Loader />}
                <Row>
                    <Col>
                        <Button onClick={(e) => this.refresh(e) } variant='outline-dark'>Refresh</Button>
                        <Button onClick={(e) => this.reset(e) } variant='outline-danger'>Reset</Button>
                        <Button onClick={(e) => this.clustering(e) } variant='outline-primary'>Clustering</Button>
                    </Col>
                </Row>
                <Row>
                    <NotificationContainer/>
                    <Col md={4}>
                        <Card>
                            <Card.Body>
                                <div className="row align-items-center justify-content-center">
                                    <div className="col">
                                        <h5 className="m-0">Lectures</h5>
                                    </div>
                                    <div className="col-auto">
                                        <label className="label theme-bg2 text-white f-14 f-w-400 float-right">{this.roundedTime(this.state.dataToView.lectures_time_spent)} minutes</label>
                                    </div>
                                </div>
                                <div className="row d-flex align-items-center">
                                    <div className="col-9">
                                      <h2 className="mt-2 f-w-300">{ this.state.dataToView.lectures }<sub className="text-muted f-14">Views</sub></h2>
                                   </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <Card.Body>
                                <div className="row align-items-center justify-content-center">
                                    <div className="col">
                                        <h5 className="m-0">Interests</h5>
                                    </div>
                                    <div className="col-auto">
                                        <label className="label theme-bg2 text-white f-14 f-w-400 float-right">{this.roundedTime(this.state.dataToView.interests_time_spent)} minutes</label>
                                    </div>
                                </div>
                                <div className="row d-flex align-items-center">
                                    <div className="col-9">
                                      <h2 className="mt-2 f-w-300">{ this.state.dataToView.interests }<sub className="text-muted f-14">Views</sub></h2>
                                   </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <Card.Body>
                                <div className="row align-items-center justify-content-center">
                                    <div className="col">
                                        <h5 className="m-0">Classes</h5>
                                    </div>
                                    <div className="col-auto">
                                        <label className="label theme-bg2 text-white f-14 f-w-400 float-right">{this.roundedTime(this.state.dataToView.classes_time_spent)} minutes</label>
                                    </div>
                                </div>
                                <div className="row d-flex align-items-center">
                                    <div className="col-9">
                                      <h2 className="mt-2 f-w-300">{ this.state.dataToView.classes }<sub className="text-muted f-14">Views</sub></h2>
                                   </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <Card.Body>
                            <div className="row align-items-center justify-content-center">
                                    <div className="col">
                                        <h5 className="m-0">Enrolled Classes</h5>
                                    </div>
                                    <div className="col-auto">
                                        <label className="label theme-bg2 text-white f-14 f-w-400 float-right">{this.roundedTime(this.state.dataToView.enrolledClasses_time_spent)} minutes</label>
                                    </div>
                                </div>
                                <div className="row d-flex align-items-center">
                                    <div className="col-9">
                                      <h2 className="mt-2 f-w-300">{ this.state.dataToView.enrolledClasses }<sub className="text-muted f-14">Views</sub></h2>
                                   </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <Card.Body>
                                <div className="row align-items-center justify-content-center">
                                    <div className="col">
                                        <h5 className="m-0">General Topics</h5>
                                    </div>
                                    <div className="col-auto">
                                        <label className="label theme-bg2 text-white f-14 f-w-400 float-right">{this.roundedTime(this.state.dataToView.generalTopics_time_spent)} minutes</label>
                                    </div>
                                </div>
                                <div className="row d-flex align-items-center">
                                    <div className="col-9">
                                      <h2 className="mt-2 f-w-300">{ this.state.dataToView.generalTopics }<sub className="text-muted f-14">Views</sub></h2>
                                   </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <Card.Body>
                                <div className="row align-items-center justify-content-center">
                                    <div className="col">
                                        <h5 className="m-0">Private Topics</h5>
                                    </div>
                                    <div className="col-auto">
                                        <label className="label theme-bg2 text-white f-14 f-w-400 float-right">{this.roundedTime(this.state.dataToView.topics_time_spent)} minutes</label>
                                    </div>
                                </div>
                                <div className="row d-flex align-items-center">
                                    <div className="col-9">
                                      <h2 className="mt-2 f-w-300">{ this.state.dataToView.topics }<sub className="text-muted f-14">Views</sub></h2>
                                   </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <Card.Body>
                                <div className="row align-items-center justify-content-center">
                                    <div className="col">
                                        <h5 className="m-0">Annocements</h5>
                                    </div>
                                    <div className="col-auto">
                                        <label className="label theme-bg2 text-white f-14 f-w-400 float-right">{this.roundedTime(this.state.dataToView.annoucements_time_spent)} minutes</label>
                                    </div>
                                </div>
                                <div className="row d-flex align-items-center">
                                    <div className="col-9">
                                      <h2 className="mt-2 f-w-300">{ this.state.dataToView.annoucements }<sub className="text-muted f-14">Views</sub></h2>
                                   </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <Card.Body>
                                <div className="row align-items-center justify-content-center">
                                    <div className="col">
                                        <h5 className="m-0">Assignments</h5>
                                    </div>
                                    <div className="col-auto">
                                        <label className="label theme-bg2 text-white f-14 f-w-400 float-right">{this.roundedTime(this.state.dataToView.assignments_time_spent)} minutes</label>
                                    </div>
                                </div>
                                <div className="row d-flex align-items-center">
                                    <div className="col-9">
                                      <h2 className="mt-2 f-w-300">{ this.state.dataToView.assignments }<sub className="text-muted f-14">Views</sub></h2>
                                   </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <Card.Body>
                                <div className="row align-items-center justify-content-center">
                                    <div className="col">
                                        <h5 className="m-0">Quizes</h5>
                                    </div>
                                    <div className="col-auto">
                                        <label className="label theme-bg2 text-white f-14 f-w-400 float-right">{this.roundedTime(this.state.dataToView.quizes_time_spent)} minutes</label>
                                    </div>
                                </div>
                                <div className="row d-flex align-items-center">
                                    <div className="col-9">
                                      <h2 className="mt-2 f-w-300">{ this.state.dataToView.quizes }<sub className="text-muted f-14">Views</sub></h2>
                                   </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <Card.Body>
                                <div className="row align-items-center justify-content-center">
                                    <div className="col">
                                        <h5 className="m-0">Course Material</h5>
                                    </div>
                                    <div className="col-auto">
                                        <label className="label theme-bg2 text-white f-14 f-w-400 float-right">{this.roundedTime(this.state.dataToView.couresMaterial_time_spent)} minutes</label>
                                    </div>
                                </div>
                                <div className="row d-flex align-items-center">
                                    <div className="col-9">
                                      <h2 className="mt-2 f-w-300">{ this.state.dataToView.couresMaterial }<sub className="text-muted f-14">Views</sub></h2>
                                   </div>
                                </div>
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

export default connect(mapStateToProps, null)(History);

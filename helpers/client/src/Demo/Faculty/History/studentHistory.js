import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import axios from 'axios';
import config from '../../../config';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Loader from '../../../App/layout/Loader';
import { connect } from 'react-redux';

class ListStudentsHistory extends React.Component {

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
            dataToView: { 
                lectures: 0, topics: 0, annoucements: 0, assignments: 0, quizes: 0, couresMaterial: 0,
                lectures_time_spent: 0, topics_time_spent: 0, annoucements_time_spent: 0, assignments_time_spent: 0,
                quizes_time_spent: 0, couresMaterial_time_spent: 0  
            }
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
		axios.get(`${config.prod}/api/history/class/${this.state.class_id}/user/${this.state.user_id}/list`)
			.then(response => {
                let data = response.data.data;
                let dView = { 
                    lectures: 0, topics: 0, annoucements: 0, assignments: 0, quizes: 0, couresMaterial: 0,
                    lectures_time_spent: 0, topics_time_spent: 0, annoucements_time_spent: 0, assignments_time_spent: 0,
                    quizes_time_spent: 0, couresMaterial_time_spent: 0  
                };
                let user = { first_name: '', last_name: '', email: '', u_id: '' };

                if (data && data.length) {
                    
                    user = data[0].user;

                    if (data.some(x => x.page_name === 'list lectures')) {
                        let obj = data.filter(elem => elem.page_name === 'list lectures')[0];
                        dView.lectures = obj.no_views;
                        dView.lectures_time_spent = obj.time_spent;
                    }
                    if (data.some(x => x.page_name === 'list Private Topics')) {
                        let obj = data.filter(elem => elem.page_name === 'list Private Topics')[0];
                        dView.topics = obj.no_views;
                        dView.topics_time_spent = obj.time_spent;
                    }
                    if (data.some(x => x.page_name === 'list annoucements')) {
                        let obj = data.filter(elem => elem.page_name === 'list annoucements')[0];
                        dView.annoucements = obj.no_views;
                        dView.annoucements_time_spent = obj.time_spent;
                    }
                    if (data.some(x => x.page_name === 'list assignments')) {
                        let obj = data.filter(elem => elem.page_name === 'list assignments')[0];
                        dView.assignments = obj.no_views;
                        dView.assignments_time_spent = obj.time_spent;
                    }
                    if (data.some(x => x.page_name === 'list Quiz')) {
                        let obj = data.filter(elem => elem.page_name === 'list Quiz')[0];
                        dView.quizes = obj.no_views;
                        dView.quizes_time_spent = obj.time_spent;
                    }
                    if (data.some(x => x.page_name === 'list course material')) {
                        let obj = data.filter(elem => elem.page_name === 'list course material')[0];
                        dView.couresMaterial = obj.no_views;
                        dView.couresMaterial_time_spent = obj.time_spent;
                    }
                }
				this.setState({ data: data, dataToView: dView, user: user, isLoading: false });
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
                        <Button onClick={(e) => this.refresh(e) } variant='outline-warning'>Refresh</Button>
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
                                        <h5 className="m-0">Annoucements</h5>
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

export default connect(mapStateToProps, null)(ListStudentsHistory);

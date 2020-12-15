import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import axios from 'axios';
import 'react-table/react-table.css';
import config from '../../../config';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Loader from '../../../App/layout/Loader';

class Clustering extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            name: "",
            isValid: {
                value: false,
                text: '',
                name: ''   
            },
            data: [],
            excellent: [],
            good: [],
            average: [],
            bad: []
        }
    }

    componentDidMount() {
        this.getClusteringResult();
    }
    
    getClusteringResult() {
        this.setState({ isLoading: true });
		axios.get(`${config.py_prod}/api/clustering`)
			.then(response => {
                let excellent = []; let good = []; let average = []; let bad = [];
                response.data.forEach(elem => {
                    if (elem.category === "best") {
                        excellent.push(elem);
                    } else if (elem.category === 'close to best') {
                        good.push(elem);
                    } else if (elem.category === 'close to worst') {
                        average.push(elem);
                    } else {
                        bad.push(elem);
                    }
                });
				this.setState({ data: response.data, excellent, good, average, bad, isLoading: false });
			})
			.catch(err => {
				this.setState({ isLoading: false, isValid: { name: 'server_error', text: 'Internal Server Error', value: true } });
				console.log('Error: getting data from db ', err.response);
                this.createNotification('error', 'Error while Getting clustering data');
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
    
    goBack(e) {
        e.preventDefault();
        this.props.history.push('/admin/dashboard');
    }

    refresh(e) {
        e.preventDefault();
        this.getClusteringResult();
    }
  
    render() {
        return (
            <Aux>
                {this.state.isLoading && <Loader />}
                <Row>
                    <NotificationContainer />
                    <Col>
                        <Button onClick={(e) => this.goBack(e) } variant='outline-dark'>Back</Button>
                        <Button onClick={(e) => this.refresh(e) } variant='outline-primary'>Refresh</Button>
                    </Col>
                </Row>
                <fieldset disabled={this.state.isLoading} className={this.state.isLoading ? 'opacity-5' : ''}>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Header>
                                    <Card.Title as="h5">Excellent</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        {
                                            this.state.excellent.map((elem) => (
                                                <Button variant="outline-success" key={elem.user_id} className="mr-2 mt-2">{ `${elem.first_name} ${elem.last_name}-${elem.u_id}` }</Button>
                                            ))
                                        }
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Header>
                                    <Card.Title as="h5">Good</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col>
                                            {
                                                this.state.good.map(elem => (
                                                    <Button variant="outline-primary" key={elem.user_id}  className="mr-2 mt-2">{ `${elem.first_name} ${elem.last_name}-${elem.u_id}` }</Button>
                                                ))
                                            }
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
                                    <Card.Title as="h5">Average</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col>
                                            {
                                                this.state.average.map(elem => (
                                                    <Button variant="outline-warning" key={elem.user_id} className="mr-2 mt-2">{ `${elem.first_name} ${elem.last_name}-${elem.u_id}` }</Button>
                                                ))
                                            }
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
                                    <Card.Title as="h5">Bad</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col>
                                            {
                                                this.state.bad.map(elem => (
                                                    <Button variant="outline-danger" key={elem.user_id} className="mr-2 mt-2">{ `${elem.first_name} ${elem.last_name}-${elem.u_id}` }</Button>
                                                ))
                                            }
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </fieldset>
            </Aux>
        );
    }
}

export default Clustering;

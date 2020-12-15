import React from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import axios from 'axios';
import configs from '../../../config';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Loader from '../../../App/layout/Loader';
import { connect } from 'react-redux';

class AddTopic extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            isLoading: false,
			deletedRowId: null,
			showModal: false,
			handleCloseModal: false,
            name: "",
            description: "",
            isValid: {
                value: false,
                text: ''   
            }
        }
    }

    handleTextChange(event) {
        this.setState({ [event.name]: event.value });
    }

    componentDidMount = async () => {
       
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

    
    handleSubmit(e) {
        e.preventDefault();
        const { name, description  } = this.state;

        if (!name && name.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Topic Name', name: 'name' }});
            return;
        }

        if (!description && description.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Topic Description', name: 'description' }});
            return;
        }
       
        axios.post(`${configs.prod}/api/topic/create`, { name: name.trim(), description: description.trim(), type: false, user_id: this.props.user.id })
            .then(response => {
                this.props.history.push(`/faculty/class/list`);
            })
            .catch(err => {
                console.log('Error: ', err.response);
                if (err.response && err.response.status && (err.response.status === 400 || err.response.status === 500)) {
                    console.log(err.response.data);
                    if (err.response.status === 500 && err.response.data.error.name === 'SequelizeUniqueConstraintError') {
                        this.setState({ isValid: { value: true, text: 'Topic with this name already exist', name:'server_error' } });
                    } else {
                        this.setState({ isValid: { value: true, text: err.response.data.msg, name:'server_error' } });
                    }
                } else {
                    this.setState({ isValid: { value: true, text: 'Unknown Error', name:'server_error' } });
                    //this.createNotification('error', 'Unknown Error');
                }
            });
    }

    render() {
        return (
            <Aux>
                {this.state.isLoading && <Loader />}
				<Row>
                    <NotificationContainer/>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Add Topic for General Discussion</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Form className="col-md-12" onSubmit={(e) => this.handleSubmit(e)}>
                                        <fieldset disabled={this.state.isLoading} className={this.state.isLoading ? 'opacity-5' : ''}>
                                            <Form.Row>
                                                <Col md={{ span: 8, offset: 2 }}>
                                                    <Form.Group className="mb-2" controlId="formBasicEmail">
                                                        <Form.Label>Topic Name</Form.Label>
                                                        <Form.Control 
                                                            type="text" 
                                                            name="name" 
                                                            placeholder="Topic Name" 
                                                            value={this.state.name}
                                                            className={this.state.isValid.value && this.state.isValid.name === 'name' ? 'in-valid-input' : ''}
                                                            onFocus={() => this.setState({ isValid: { value: false, text: ''}})}
                                                            onChange={(e) => this.handleTextChange(e.target) }
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Form.Row>
                                            <Form.Row>
                                                <Col md={{ span: 8, offset: 2 }}>
                                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                                        <Form.Label>Topic Description</Form.Label>
                                                        <Form.Control 
                                                            as="textarea" 
                                                            name='description'
                                                            rows={4}
                                                            value={this.state.description}
                                                            className={this.state.isValid.value && this.state.isValid.name === 'description' ? 'in-valid-input' : ''}
                                                            onFocus={() => this.setState({ isValid: { value: false, text: ''}})}
                                                            onChange={(e) => this.handleTextChange(e.target) }
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Form.Row>
                                            <Form.Row>
                                                <Col md={{ span: 8, offset: 2 }}>
                                                    <div>
                                                        <Button type="submit" style={{ marginTop: '1.8rem', width: '100%' }} variant={"primary"}>
                                                            { 'Submit' }
                                                        </Button>
                                                        {
                                                            this.state.isValid.value ?
                                                            <Form.Text style={{ color: 'red' }}>
                                                                { this.state.isValid.text }
                                                            </Form.Text> : ''
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

const mapStateToProps = state => {
    return {
        user: state.userDetails.user
    }
}

export default connect(mapStateToProps, null)(AddTopic);

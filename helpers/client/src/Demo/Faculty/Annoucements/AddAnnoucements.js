import React from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import axios from 'axios';
import configs from '../../../config';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Loader from '../../../App/layout/Loader';
import { connect } from 'react-redux';

class AddAnnoucement extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            isLoading: false,
			deletedRowId: null,
			showModal: false,
			handleCloseModal: false,
            title: "",
            description: "",
            class_id: "",
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
       if (this.props && this.props.user && this.props.user.id && this.props.match && this.props.match.params && this.props.match.params.id) {
            await this.setState({ class_id: this.props.match.params.id })
        }
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

    
    async handleSubmit(e) {
        e.preventDefault();
        const { title, description, class_id  } = this.state;

        if (!title && title.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Annoucement Title', name: 'title' }});
            return;
        }

        if (!description && description.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Annoucement Description', name: 'description' }});
            return;
        }
       
        axios.post(`${configs.prod}/api/annoucement/create`, { title: title.trim(), description: description.trim(), class_id })
            .then(response => {
                this.props.history.push(`/faculty/class/list`);
            })
            .catch(err => {
                console.log('Error: ', err.response);
                if (err.response && err.response.status && (err.response.status === 400 || err.response.status === 500)) {
                    if (err.response.status === 500 && err.response.data.error.name === 'SequelizeUniqueConstraintError') {
                        this.setState({ isValid: { value: true, text: 'Annoucement with this title already exist', name:'server_error' } });
                    } else {
                        this.setState({ isValid: { value: true, text: err.response.data.msg, name:'server_error' } });
                    }
                } else {
                    this.setState({ isValid: { value: true, text: 'Unknown Error', name:'server_error' } });
                    //this.createNotification('error', 'Unknown Error');
                }
            });
    }

    goBack(e) {
        e.preventDefault();
        this.props.history.push(`/faculty/class/list`);
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
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Add Annoucemnt</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Form className="col-md-12" onSubmit={(e) => this.handleSubmit(e)}>
                                        <fieldset disabled={this.state.isLoading} className={this.state.isLoading ? 'opacity-5' : ''}>
                                            <Form.Row>
                                                <Col md={{ span: 8, offset: 2 }}>
                                                    <Form.Group className="mb-2" controlId="formBasicEmail">
                                                        <Form.Label>Annoucement Title</Form.Label>
                                                        <Form.Control 
                                                            type="text" 
                                                            name="title" 
                                                            placeholder="Annoucement Title" 
                                                            value={this.state.title}
                                                            className={this.state.isValid.value && this.state.isValid.name === 'title' ? 'in-valid-input' : ''}
                                                            onFocus={() => this.setState({ isValid: { value: false, text: ''}})}
                                                            onChange={(e) => this.handleTextChange(e.target) }
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Form.Row>
                                            <Form.Row>
                                                <Col md={{ span: 8, offset: 2 }}>
                                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                                        <Form.Label>Annoucement Description</Form.Label>
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

export default connect(mapStateToProps, null)(AddAnnoucement);

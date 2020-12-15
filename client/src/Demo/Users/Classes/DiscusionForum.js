import React from 'react';
import { Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import axios from 'axios';
import config from '../../../config';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Loader from '../../../App/layout/Loader';
import { connect } from 'react-redux';

class DiscusionForum extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isValid: {
                value: false,
                text: ''   
            },
            data: {},
            topic_id: '',
            class_id: '',
            comment: ''
        }
    }

    componentDidMount = async () => {
        if (this.props && this.props.user && this.props.user.id && this.props.match && this.props.match.params && this.props.match.params.id  && this.props.match.params.class_id) {
            await this.setState({ topic_id: this.props.match.params.id, class_id: this.props.match.params.class_id });
            this.getTopic();
        }
    }
    
    getTopic() {
        this.setState({ isLoading: true });
		axios.get(`${config.prod}/api/users/${this.state.class_id}/topic/${this.state.topic_id}/private`)
			.then(response => {
                let data = response.data.data;
				this.setState({ data: data, isLoading: false });
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

    handleTextChange(e) {
        this.setState({ 'comment' : e.value });
    }

    submitComment = async (e) => {
            e.preventDefault();
            const { comment } = this.state;
            if (!comment && comment.trim().length <= 0) {
                return;
            }

            await this.setState({ isLoading: true });
		    axios.post(`${config.prod}/api/comment/create`, { user_id: this.props.user.id, topic_id: this.state.topic_id, comment: comment.trim() })
                .then(async response => {
                    await this.setState({ comment: '' });
		            this.getTopic();
                })
                .catch(err => {
                    this.setState({ isLoading: false });
                    console.log('Error: getting data from db ', err.response);
                    this.createNotification('error', 'Error while Getting data from db');
                });
        
    }

    goBack(e) {
        e.preventDefault();
        if (this.props.user.role === 'user') {
            this.props.history.push(`/user/class/${this.state.class_id}/topics/list`);
        } else {
            this.props.history.push(`/faculty/class/${this.state.class_id}/topic/list`);
        }
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
                                <Card.Title as="h5">{ this.state.data.name ? this.state.data.name : null }</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                   <Col md={{ span: 8, offset: 2 }}>
                                        <Row>
                                            <Col>
                                                <Card>
                                                    <Card.Body style={{ fontFamily: 'cursive' }}>
                                                        <p><b>{ this.state.data.description ? this.state.data.description : null }</b></p>
                                                    </Card.Body>  
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                { this.state.data.comments ? this.state.data.comments.map(elem => (
                                                    <Row key={elem.id}>
                                                        <Col>
                                                            <Card>
                                                                <Card.Header>
                                                                    <Card.Title as='h4' style={{ fontFamily: 'cursive' }}>
                                                                       <b> username: { `${elem.user.first_name} ${elem.user.last_name}` } </b>
                                                                    </Card.Title>
                                                                </Card.Header>
                                                                <Card.Body>
                                                                    { elem.comment }
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                    )) : null
                                                }
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
										        <fieldset disabled={this.state.isLoading} className={this.state.isLoading ? 'opacity-5' : ''}>
                                                    <Form>
                                                        <Form.Row>
                                                            <Col>
                                                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                                                    <Form.Control 
                                                                        as="textarea" 
                                                                        name='comment'
                                                                        rows={4}
                                                                        placeholder={'Write a comment...'}
                                                                        value={this.state.comment}
                                                                        className={this.state.isValid.value && this.state.isValid.name === 'description' ? 'in-valid-input' : ''}
                                                                        onFocus={() => this.setState({ isValid: { value: false, text: ''}})}
                                                                        onChange={(e) => this.handleTextChange(e.target) }
                                                                    />
                                                               </Form.Group>
                                                            </Col>
                                                        </Form.Row>
                                                        <Form.Row>
                                                            <Col>
                                                                <Form.Group controlId="exampleForm.ControlTextarea1" className='text-center'>
                                                                    <Button style={{ width: '50%' }} onClick={(e) => this.submitComment(e)} variant={'outline-primary'}>{ 'Submit Now' }</Button>
                                                                </Form.Group>
                                                            </Col>
                                                        </Form.Row>
                                                    </Form>
                                                </fieldset>
                                            </Col>
                                        </Row>
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

export default connect(mapStateToProps, null)(DiscusionForum);

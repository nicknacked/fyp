import React from 'react';
import { Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import axios from 'axios';
import config from '../../../config';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Loader from '../../../App/layout/Loader';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/userActions';
import BrowserInteractionTime from 'browser-interaction-time';

const browserInteractionTime = new BrowserInteractionTime({
    timeIntervalEllapsedCallbacks: [],
    absoluteTimeEllapsedCallbacks: [],
    browserTabInactiveCallbacks: [],
    browserTabActiveCallbacks: [],
    idleTimeoutMs: 6000,
    checkCallbacksIntervalMs: 250
});

const callbackInActive = () => browserInteractionTime.stopTimer();
browserInteractionTime.addBrowserTabInactiveCallback(callbackInActive);

const callbackActive = () => browserInteractionTime.startTimer();
browserInteractionTime.addBrowserTabActiveCallback(callbackActive);

class Quiz extends React.Component {

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
        if (this.props && this.props.user && this.props.user.id && this.props.match && this.props.match.params && this.props.match.params.id && this.props.match.params.class_id) {
            await this.setState({ quiz_id: this.props.match.params.id, class_id: this.props.match.params.class_id });
            this.props.createHistory({ user_id: this.props.user.id, page_name: 'Quiz', class_id: this.props.match.params.class_id });
            this.getQuiz();
        }
    }
    
    componentWillUnmount = async () => {
        let timeElapsed = browserInteractionTime.getTimeInMilliseconds();
        let timeInMinutes = (timeElapsed / 60000);
        
        this.props.createTimeSpent({ 
            user_id: this.props.user.id, page_name: 'Quiz', 
            class_id: this.props.match.params.class_id, time_spent: timeInMinutes 
        });
        browserInteractionTime.stopTimer();
        browserInteractionTime.destroy();
    }
    
    getQuiz() {
        this.setState({ isLoading: true });
		axios.get(`${config.prod}/api/users/class/${this.state.class_id}/quiz/${this.state.quiz_id}/submission`)
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

    openSubmitModel(value) {
		this.setState({ showModal: true, isValid: { value: false } });
    }

    cancelQuizSubmit() {
		this.setState({ showModal: false, isValid: { value: false } });
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

    toggleEnabled(e, name, op, value) {
        let quiz = {...this.state.data};
        if (op === 'op1') {
            quiz.quiz_options[value][name]['op1'] = true;
            quiz.quiz_options[value][name]['op2'] = false;
            quiz.quiz_options[value][name]['op3'] = false;
            quiz.quiz_options[value][name]['op4'] = false;
            quiz.quiz_options[value]['correct'] = 'op1';
        }
        if (op === 'op2') {
            quiz.quiz_options[value][name]['op1'] = false;
            quiz.quiz_options[value][name]['op2'] = true;
            quiz.quiz_options[value][name]['op3'] = false;
            quiz.quiz_options[value][name]['op4'] = false;
            quiz.quiz_options[value]['correct'] = 'op2';
        }
        if (op === 'op3') {
            quiz.quiz_options[value][name]['op1'] = false;
            quiz.quiz_options[value][name]['op2'] = false;
            quiz.quiz_options[value][name]['op3'] = true;
            quiz.quiz_options[value][name]['op4'] = false;
            quiz.quiz_options[value]['correct'] = 'op3';
        }
        if (op === 'op4') {
            quiz.quiz_options[value][name]['op1'] = false;
            quiz.quiz_options[value][name]['op2'] = false;
            quiz.quiz_options[value][name]['op3'] = false;
            quiz.quiz_options[value][name]['op4'] = true;
            quiz.quiz_options[value]['correct'] = 'op4';
        }
        this.setState({ data: quiz });
    }

    handleTextChange(e) {
        this.setState({ 'comment' : e.value });
    }

    handleQuizSubmit = async (e) => {
        await this.setState({ isLoading: true, showModal: false });
        axios.post(`${config.prod}/api/users/quiz/submit`, { 
                user_id: this.props.user.id, 
                quiz_id: this.state.quiz_id, 
                class_id: this.state.class_id, 
                options: JSON.stringify(this.state.data.quiz_options) 
            })
            .then(response => {
                this.props.history.push(`/user/class/${this.state.class_id}/quiz/list`);
            })
            .catch(err => {
                this.setState({ isLoading: false });
                console.log('Error: getting data from db ', err.response);
                this.createNotification('error', 'Error while Getting data from db');
            });
    }

    goBack(e) {
        e.preventDefault();
        this.props.history.push(`/user/class/${this.state.class_id}/quiz/list`);
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
                {   this.state.showModal && 
                            <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Confirm Quiz Submit</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div>
                                        Are you sure to want to submit? 
                                    </div>
                                    {
                                        this.state.isValid.value && this.state.isValid.name === 'server_error' ?
                                            <Form.Text style={{ color: 'red' }}>
                                                { this.state.isValid.text }
                                            </Form.Text> : null
                                    }
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="primary" onClick={() => this.handleQuizSubmit()}>
                                        OK
                                    </Button>
                                    <Button variant="secondary" onClick={() => this.cancelQuizSubmit()}>
                                        Cancel
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                    }
                    <NotificationContainer/>
                    <Col>
                        <fieldset disabled={this.state.isLoading} className={this.state.isLoading ? 'opacity-5' : ''}>
                            <Card>
                                <Card.Header>
                                    <Card.Title as="h6">{ this.state.data.title ? <><b>Quiz Title: </b> {`${this.state.data.title}` }</>  : null }</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={{ span: 8, offset: 2 }}>
                                            <Row>
                                                <Col>
                                                    { this.state.data.quiz_options ? this.state.data.quiz_options.map((elem, i) => (
                                                        <Row key={elem.id}>
                                                            <Col>
                                                                <Card>
                                                                    <Card.Header>
                                                                        <Card.Title as='h6'>
                                                                            <b>Q{`${i+1}`}: </b> {`${elem.question}` }
                                                                        </Card.Title>
                                                                    </Card.Header>
                                                                    <Card.Body>
                                                                        <Row> 
                                                                            <Col md={6}>
                                                                                <Form.Check className="pt-2 pb-2" inline label={`${elem.op1}`} onChange={(e) => this.toggleEnabled(e, 'correct_option', 'op1', i)}  checked={elem.correct_option.op1} type={'checkbox'} id={`inline-checkbox-1-${elem.id}`} />
                                                                            </Col>
                                                                            <Col md={6}>
                                                                                <Form.Check className="pt-2 pb-2" inline label={`${elem.op2}`} onChange={(e) => this.toggleEnabled(e, 'correct_option', 'op2', i)}  checked={elem.correct_option.op2} type={'checkbox'} id={`inline-checkbox-2-${elem.id}`} />
                                                                            </Col>
                                                                            <Col md={6}>
                                                                                <Form.Check className="pt-2 pb-2" inline label={`${elem.op3}`} onChange={(e) => this.toggleEnabled(e, 'correct_option', 'op3', i)}  checked={elem.correct_option.op3} type={'checkbox'} id={`inline-checkbox-3-${elem.id}`} />
                                                                            </Col>
                                                                            <Col md={6}>
                                                                                <Form.Check className="pt-2 pb-2" inline label={`${elem.op4}`} onChange={(e) => this.toggleEnabled(e, 'correct_option', 'op4', i)}  checked={elem.correct_option.op4} type={'checkbox'} id={`inline-checkbox-4-${elem.id}`} />
                                                                            </Col>
                                                                        </Row>
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
                                                    <Form>
                                                        <Form.Row>
                                                            <Col>
                                                                <Form.Group controlId="exampleForm.ControlTextarea1" className='text-center'>
                                                                    <Button style={{ width: '50%' }} onClick={(e) => this.openSubmitModel(e)} variant={'outline-primary'}>{ 'Submit' }</Button>
                                                                </Form.Group>
                                                            </Col>
                                                        </Form.Row>
                                                    </Form>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </fieldset>
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

export default connect(mapStateToProps, actions)(Quiz);

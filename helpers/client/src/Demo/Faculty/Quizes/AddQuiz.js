import React from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import axios from 'axios';
import configs from '../../../config';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Loader from '../../../App/layout/Loader';
import { connect } from 'react-redux';
import DateTime from 'react-datetime';
import moment from 'moment';

class AddQuiz extends React.Component {

    constructor(props) {
        super(props);
        this.onDropPhoto = (files) => {
            this.setState({ files: files, isValid: { value: true, text: '' } });
        };
        this.state = {
            isLoading: false,
			deletedRowId: null,
			showModal: false,
			handleCloseModal: false,
            name: "",
            description: "",
            class_id: "",
            total_marks: 0,
            isValid: {
                value: false,
                text: ''   
            },
            data: [],
            options: [{ 
                question: '',
                op1: '',
                op2: '',
                op3: '',
                op4: '',
                correct: 'op1',
                correct_option: { op1: true, op2: false, op3: false, op4: false },
            }],
            submission_date: ''
        }
    }

    handleTextChange(event) {
        this.setState({ [event.name]: event.value });
    }

    handleConnectionChange = (e, name) => {
        e.preventDefault();
        let options = [...this.state.options];
        options[e.target.dataset.id][name] = e.target.value;
        this.setState({ options });
    }

    toggleEnabled(e, name, op) {
        let options = [...this.state.options];
        if (op === 'op1') {
            options[e.target.dataset.id][name]['op1'] = true;
            options[e.target.dataset.id][name]['op2'] = false;
            options[e.target.dataset.id][name]['op3'] = false;
            options[e.target.dataset.id][name]['op4'] = false;
            options[e.target.dataset.id]['correct'] = 'op1';
        }
        if (op === 'op2') {
            options[e.target.dataset.id][name]['op1'] = false;
            options[e.target.dataset.id][name]['op2'] = true;
            options[e.target.dataset.id][name]['op3'] = false;
            options[e.target.dataset.id][name]['op4'] = false;
            options[e.target.dataset.id]['correct'] = 'op2';
        }
        if (op === 'op3') {
            options[e.target.dataset.id][name]['op1'] = false;
            options[e.target.dataset.id][name]['op2'] = false;
            options[e.target.dataset.id][name]['op3'] = true;
            options[e.target.dataset.id][name]['op4'] = false;
            options[e.target.dataset.id]['correct'] = 'op3';
        }
        if (op === 'op4') {
            options[e.target.dataset.id][name]['op1'] = false;
            options[e.target.dataset.id][name]['op2'] = false;
            options[e.target.dataset.id][name]['op3'] = false;
            options[e.target.dataset.id][name]['op4'] = true;
            options[e.target.dataset.id]['correct'] = 'op4';
        }
        this.setState({ options });
    }

    appenedNewOptions = (e) => {
        e.preventDefault();
        const { options } = this.state;
        this.setState({
            options: 
            [...options, { 
                    question: '',
                    op1: '',
                    op2: '',
                    op3: '',
                    op4: '',
                    correct: 'op1',
                    correct_option: { op1: true, op2: false, op3: false, op4: false },
                }
            ]
        });
    }

    deleteFromOptions = (e, idx) => {
        e.preventDefault();
        const { options } = this.state;
        let optionss = options.splice(idx, 1);
        this.setState({ optionss });
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

    handleChange(e,name) {
        this.setState({ [name]: e._d.toISOString() });
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        const { name, class_id, total_marks, submission_date, options  } = this.state;

        if (!name && name.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Quiz Title', name: 'name' }});
            return;
        }

        if (total_marks <= 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Quiz Total Marks', name: 'total_marks' }});
            return;
        }

        if (!submission_date && submission_date.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Quiz Submission Date', name: 'submission_date' }});
            return;
        }
        
        axios.post(`${configs.prod}/api/class/quiz/create`, { title: name.trim(), total_marks: total_marks, class_id, submission_date: submission_date.trim(), options: JSON.stringify(options) })
            .then(response => {
                this.props.history.push(`/faculty/class/list`);
            })
            .catch(err => {
                console.log('Error: ', err.response);
                if (err.response && err.response.status && (err.response.status === 400 || err.response.status === 500)) {
                    if (err.response.status === 500 && err.response.data.error.name === 'SequelizeUniqueConstraintError') {
                        this.setState({ filesProgress: 0, isValid: { value: true, text: 'Quiz with this title already exist', name:'server_error' } });
                    } else {
                        this.setState({ filesProgress: 0, isValid: { value: true, text: err.response.data.msg, name:'server_error' } });
                    }
                } else {
                    this.setState({ filesProgress: 0, isValid: { value: true, text: 'Unknown Error', name:'server_error' } });
                    //this.createNotification('error', 'Unknown Error');
                }
            });
    }

    goBack(e) {
        e.preventDefault();
        this.props.history.push(`/faculty/class/list`);
    }

    render() {
        const yesterday = moment().subtract(1, 'day');
        const disablePastDt = current => {
          return current.isAfter(yesterday);
        };
        const { options } = this.state;
        
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
                                <Card.Title as="h5">Add Assignment</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Form className="col-md-12" onSubmit={(e) => this.handleSubmit(e)}>
                                        <fieldset disabled={this.state.isLoading} className={this.state.isLoading ? 'opacity-5' : ''}>
                                            <Form.Row>
                                                <Col md={{ span: 8, offset: 2 }}>
                                                    <Form.Group className="mb-2" controlId="formBasicEmail">
                                                        <Form.Label>Quiz Title</Form.Label>
                                                        <Form.Control 
                                                            type="text" 
                                                            name="name" 
                                                            placeholder="Quiz Title" 
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
                                                    <Form.Group className="mb-2" controlId="formBasicEmail">
                                                        <Form.Label>Quiz Total Marks</Form.Label>
                                                        <Form.Control 
                                                            type="number" 
                                                            name="total_marks" 
                                                            min={0}
                                                            placeholder="Assignment Total Marks" 
                                                            value={this.state.total_marks}
                                                            className={this.state.isValid.value && this.state.isValid.name === 'total_marks' ? 'in-valid-input' : ''}
                                                            onFocus={() => this.setState({ isValid: { value: false, text: ''}})}
                                                            onChange={(e) => this.handleTextChange(e.target) }
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Form.Row>
                                            <Form.Row>
                                                <Col md={{ span: 8, offset: 2 }}>
                                                    <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                                        <Form.Label>Submission Date</Form.Label>
                                                        <DateTime 
                                                            isValidDate={disablePastDt}
                                                            inputProps={{ readOnly: true }}
                                                            className={this.state.isValid.value && this.state.isValid.name === 'submission_date' ? 'in-valid-input' : ''}
                                                            onFocus={() => this.setState({ isValid: { value: false, text: '', name:''}})}
                                                            onChange={ (e) => this.handleChange(e,'submission_date')} 
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Form.Row>
                                            <Form.Row>
                                                <Col md={{ span: 8, offset: 2 }}>
                                                    <Button 
                                                        style={{ width: '100%', marginTop: 10}} 
                                                        onClick={(e) => this.appenedNewOptions(e)} 
                                                        variant="outline-primary"
                                                    > 
                                                        Add New Question 
                                                    </Button>
                                                </Col>
                                            </Form.Row>

                                            {
                                                this.state.options.map((val, idx) => {
                                                    let questionId=`question-${idx}`, op1Id=`op1-${idx}`, op2Id=`op2-${idx}`, op3Id=`op3-${idx}`, op4Id=`op4-${idx}`, correctOptionId=`correct_option-${idx}`;
                                                    return (
                                                    <div key={idx} style={{ padding: 10 }}>
                                                        <Form.Row>
                                                            <Col md={{ span: 8, offset: 2 }} style={{ border: '2px solid #007bff', padding: 10, marginTop: 5 }}>
                                                                <button style={{ float: 'right' }} onClick={(e) => this.deleteFromOptions(e,idx) }>
                                                                    <i className="fa fa-times"></i>
                                                                </button>
                                                                <Row>
                                                                    <Col md={12}>
                                                                        <Form.Group className="mb-2">
                                                                            <Form.Label>Question</Form.Label>
                                                                            <Form.Control 
                                                                                type="text" 
                                                                                name={questionId} 
                                                                                data-id={idx}
                                                                                id={questionId}
                                                                                value={options[idx].question}
                                                                                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                                                                onChange={(e) => this.handleConnectionChange(e, 'question')}
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md={6}>
                                                                        <Form.Group className="mb-2">
                                                                            <Form.Label>Option 1</Form.Label>
                                                                            <Form.Control 
                                                                                type="text" 
                                                                                name={op1Id}
                                                                                data-id={idx}
                                                                                id={op1Id}
                                                                                value={options[idx].op1}
                                                                                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                                                                onChange={(e) => this.handleConnectionChange(e, 'op1')}
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col md={6}>
                                                                        <Form.Group className="mb-2">
                                                                            <Form.Label>Option 2</Form.Label>
                                                                            <Form.Control 
                                                                                type="text" 
                                                                                name={op2Id}
                                                                                data-id={idx}
                                                                                id={op2Id}
                                                                                value={options[idx].op2}
                                                                                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                                                                onChange={(e) => this.handleConnectionChange(e, 'op2')}
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col md={6}>
                                                                        <Form.Group className="mb-2">
                                                                            <Form.Label>Option 3</Form.Label>
                                                                            <Form.Control 
                                                                                type="text" 
                                                                                name={op3Id}
                                                                                data-id={idx}
                                                                                id={op3Id}
                                                                                value={options[idx].op3}
                                                                                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                                                                onChange={(e) => this.handleConnectionChange(e, 'op3')}
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col md={6}>
                                                                        <Form.Group className="mb-2">
                                                                            <Form.Label>Option 4</Form.Label>
                                                                            <Form.Control 
                                                                                type="text" 
                                                                                name={op4Id}
                                                                                data-id={idx}
                                                                                id={op4Id}
                                                                                value={options[idx].op4}
                                                                                onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                                                                onChange={(e) => this.handleConnectionChange(e, 'op4')}
                                                                            />
                                                                        </Form.Group>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col md={12}>
                                                                        <Form.Group className="mb-2">
                                                                            <Form.Label>Correct Option</Form.Label><br />
                                                                            <Form.Check inline label="option 1" data-id={idx} onChange={(e) => this.toggleEnabled(e, 'correct_option', 'op1')}  checked={options[idx].correct_option.op1} type={'radio'} id={`inline-radio-1-${idx}`} />
                                                                            <Form.Check inline label="option 2" data-id={idx} onChange={(e) => this.toggleEnabled(e, 'correct_option', 'op2')}  checked={options[idx].correct_option.op2} type={'radio'} id={`inline-radio-2-${idx}`} />
                                                                            <Form.Check inline label="option 3" data-id={idx} onChange={(e) => this.toggleEnabled(e, 'correct_option', 'op3')}  checked={options[idx].correct_option.op3} type={'radio'} id={`inline-radio-3-${idx}`} />
                                                                            <Form.Check inline label="option 4" data-id={idx} onChange={(e) => this.toggleEnabled(e, 'correct_option', 'op4')}  checked={options[idx].correct_option.op4} type={'radio'} id={`inline-radio-4-${idx}`} />
                                                                        </Form.Group>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Form.Row>
                                                    </div>
                                                    )
                                                })
                                                }
                                            { this.state.options.length ?   
                                                <Form.Row>
                                                    <Col md={{ span: 8, offset: 2 }} style={{ textAlign: 'center', marginTop: 10 }}>
                                                        <Button 
                                                            style={{ marginTop: 10, borderTop: '0px', borderLeft: '0px', borderRight: '0px' }} 
                                                            onClick={(e) => this.appenedNewOptions(e)} 
                                                            variant="outline-primary"
                                                        > 
                                                            + Add New Question 
                                                        </Button>
                                                    </Col>
                                                </Form.Row>
                                                : null
                                            }
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

export default connect(mapStateToProps, null)(AddQuiz);

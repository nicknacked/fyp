import React from 'react';
import { Row, Col, Card, Button, Modal, Table, Badge, Form } from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import axios from 'axios';
import configs from '../../../config';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Loader from '../../../App/layout/Loader';
import { connect } from 'react-redux';
import fileDownload from 'js-file-download';
import Dropzone from 'react-dropzone';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
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

class ListAssignment extends React.Component {

    constructor(props) {
        super(props);
        this.onDropPhoto = (files) => {
            this.setState({ files: files, isValid: { value: true, text: '' } });
        };
        this.state = {
            isLoading: false,
            downloadRowId: null,
            elem: {}, 
            showModal: false,
            showModalSubmit: false,
            showModalReSubmit: false,
			handleCloseModal: false,
            isValid: {
                value: false,
                text: ''   
            },
            data: [],
            class_id: '',
            title: '',
            files: [],
            filesProgress: 0,
        }
    }

    openDownloadModal(value) {
		this.setState({ title: value.title, showModal: true, downloadRowId: value.id, elem: value });
    }
    
	closeDownloadModal() {
		this.setState({ showModal: false });
    }
    
	closeSubmissionModal() {
		this.setState({ showModalSubmit: false });
    }

    closeReSubmissionModal() {
		this.setState({ showModalReSubmit: false });
    }

    goToSubmissions(value) {
    	this.setState({ title: value.title, showModalSubmit: true, downloadRowId: value.id, elem: value });
    }

    goToReeSubmissions(value) {
    	this.setState({ title: value.title, showModalReSubmit: true, downloadRowId: value.id, elem: value });
    }
    
    handleDownload() {
        this.setState({ showModal: false, isLoading: true });
        axios.get(`${configs.prod}/${this.state.elem.file}`, {
            responseType: 'blob',
          }).then(res => {
            let temp = this.state.elem.file.split('.');
            fileDownload(res.data, `${this.state.title}.${temp[temp.length-1]}`);
            this.setState({ isLoading: false });
          });
    }


    async handleSubmission() {
        const { files, downloadRowId } = this.state;
        
        if (!files.length) {
            this.setState({ isValid: { value: true, text: 'Please drop a file above', name: 'files' }});
            return;
        }
        
        await this.setState({ filesProgress: 0, isLoading: true });
        let that = this;
        const config = {
            onUploadProgress: function(progressEvent) {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                that.setState({ filesProgress: percentCompleted });
            }
        }
        
        let data = new FormData()
        data.append('assignment-submit', files[0]);
        data.append('user_id', this.props.user.id);
        data.append('assign_id', downloadRowId);
        
        axios.post(`${configs.prod}/api/users/class/assignment/submit`, data, config)
            .then(async response => {
                await this.setState({ showModalSubmit: false });
                this.getAssignmentList();
            })
            .catch(err => {
                console.log('Error: ', err.response);
                if (err.response && err.response.status && (err.response.status === 400 || err.response.status === 500)) {
                   this.setState({ filesProgress: 0, showModalSubmit: true, isLoading: false, isValid: { value: true, text: err.response.data.msg, name:'server_error' } });
                } else {
                    this.setState({ filesProgress: 0, showModalSubmit: true, isLoading: false, isValid: { value: true, text: 'Unknown Error', name:'server_error' } });
                }
            });
    }

    async handleReSubmission() {
        const { files, downloadRowId } = this.state;
        
        if (!files.length) {
            this.setState({ isValid: { value: true, text: 'Please drop a file above', name: 'files' }});
            return;
        }
        
        await this.setState({ filesProgress: 0, isLoading: true });
        let that = this;
        const config = {
            onUploadProgress: function(progressEvent) {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                that.setState({ filesProgress: percentCompleted });
            }
        }
        
        let data = new FormData()
        data.append('assignment-submit', files[0]);
        data.append('user_id', this.props.user.id);
        data.append('assign_id', downloadRowId);
        
        axios.post(`${configs.prod}/api/users/class/assignment/resubmit`, data, config)
            .then(async response => {
                await this.setState({ showModalReSubmit: false });
                this.getAssignmentList();
            })
            .catch(err => {
                console.log('Error: ', err.response);
                if (err.response && err.response.status && (err.response.status === 400 || err.response.status === 500)) {
                   this.setState({ filesProgress: 0, showModalReSubmit: true, isLoading: false, isValid: { value: true, text: err.response.data.msg, name:'server_error' } });
                } else {
                    this.setState({ filesProgress: 0, showModalReSubmit: true, isLoading: false, isValid: { value: true, text: 'Unknown Error', name:'server_error' } });
                }
            });
    }

    componentDidMount = async () => {
        if (this.props && this.props.user && this.props.user.id && this.props.match && this.props.match.params && this.props.match.params.id) {
            await this.setState({ class_id: this.props.match.params.id });
            this.props.createHistory({ user_id: this.props.user.id, page_name: 'list assignments', class_id: this.props.match.params.id });
            this.getAssignmentList();
        }
    }
    
    componentWillUnmount = async () => {
        let timeElapsed = browserInteractionTime.getTimeInMilliseconds();
        let timeInMinutes = (timeElapsed / 60000);
        
        this.props.createTimeSpent({ 
            user_id: this.props.user.id, page_name: 'list assignments', 
            class_id: this.props.match.params.id, time_spent: timeInMinutes 
        });
        browserInteractionTime.stopTimer();
        browserInteractionTime.destroy();
    }
    
    getAssignmentList() {
        this.setState({ isLoading: true });
		axios.get(`${configs.prod}/api/users/${this.props.user.id}/class/${this.state.class_id}/assignment/list`)
			.then(response => {
				this.setState({ data: response.data.data, isLoading: false });
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
		this.setState({ 
            showModal: false,
			title: ''
		});
    }
    
    cancelSubmission() {
		this.setState({ showModalSubmit: false, title: '' });
    }

    cancelReSubmission() {
		this.setState({ showModalReSubmit: false, title: '' });
    }

    goBack(e) {
        e.preventDefault();
        this.props.history.push('/enrolled/class/list');
    }


    render() {
        const filePreview = this.state.files.map((file, i) => (
            <i key={i} style={{ fontSize: '20em' }} className="feather icon-file"></i>
        ));
        const maxSize = 104857600 * 10;
        return (
            <Aux>
                {this.state.isLoading && <Loader />}
                <Row>
                    <Col>
                        <Button onClick={(e) => this.goBack(e) } variant='outline-dark'>Back</Button>
                    </Col>
                </Row>
                <fieldset disabled={this.state.isLoading} className={this.state.isLoading ? 'opacity-5' : ''}>
                    <Row>
                        {this.state.showModal && 
                            <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Download Confirm</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>Are you sure to want to download <b>{this.state.title}</b>?</Modal.Body>
                                <Modal.Footer>
                                    <Button variant="primary" onClick={() => this.handleDownload()}>
                                        OK
                                    </Button>
                                    <Button variant="secondary" onClick={() => this.cancelDownload()}>
                                        Cancel
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        }
                        {this.state.showModalSubmit && 
                            <Modal show={this.state.showModalSubmit} onHide={() => this.setState({ showModalSubmit: false })}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Submit Assignment</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Row>
                                        <Col>
                                            Are you sure to want to Submit <b>{this.state.title}</b>?
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Dropzone 
                                                onDrop={this.onDropPhoto} 
                                                // accept="video/*" 
                                                minSize={0}
                                                maxSize={maxSize}
                                                multiple={false}
                                            >
                                                {({getRootProps, getInputProps, isDragActive, isDragReject, rejectedFiles}) => {
                                                    const isFileTooLarge = rejectedFiles && rejectedFiles.length > 0 && rejectedFiles[0].size > maxSize;
                                                    return (
                                                        <section>
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent:'center', borderWidth: 2, height: '25em', borderRadius: 2, textAlign: 'center', borderColor: '#eeeeee', borderStyle: 'dashed', backgroundColor: '#fafafa', color: '#bdbdbd' }} 
                                                            {...getRootProps({className: 'dropzone',
                                                                onClick: event => event.stopPropagation()
                                                            })}>
                                                                <input {...getInputProps()} />
                                                                {!isDragActive && !filePreview.length && 'Drop a file to upload!'}
                                                                {isDragActive && !isDragReject && "Drop it like it's hot!"}
                                                                {isDragReject && "File type not accepted, sorry!"}
                                                                {isFileTooLarge && (
                                                                    <div className="text-danger mt-2">
                                                                        File is too large. Max Size 1GB
                                                                    </div>
                                                                )}
                                                                { filePreview }
                                                                { filePreview.length ? <div style={{ width: '15%', position: 'absolute', padding: 14, backgroundColor: 'whitesmoke', borderRadius: 20 }}>
                                                                    <CircularProgressbar value={this.state.filesProgress} text={`${this.state.filesProgress}%`} /> 
                                                                    </div> : null 
                                                                }
                                                            </div>
                                                            {
                                                                this.state.isValid.value && this.state.isValid.name === 'files' ?
                                                                <Form.Text style={{ color: 'red' }}>
                                                                    { this.state.isValid.text }
                                                                </Form.Text> : ''
                                                            }
                                                        </section>
                                                    )}
                                                }
                                            </Dropzone>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div>
                                                {
                                                    this.state.isValid.value && this.state.isValid.name === 'server_error' ?
                                                    <Form.Text style={{ color: 'red' }}>
                                                        { this.state.isValid.text }
                                                    </Form.Text> : ''
                                                }
                                            </div>
                                        </Col>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="primary" disabled={this.state.isLoading} onClick={() => this.handleSubmission()}>
                                        Submit
                                    </Button>
                                    <Button variant="secondary" disabled={this.state.isLoading} onClick={() => this.cancelSubmission()}>
                                        Cancel
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        }
                        {this.state.showModalReSubmit && 
                            <Modal show={this.state.showModalReSubmit} onHide={() => this.setState({ showModalReSubmit: false })}>
                                <Modal.Header closeButton>
                                    <Modal.Title>ReSubmit Assignment</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Row>
                                        <Col>
                                            Are you sure to want to ReSubmit <b>{this.state.title}</b>?
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Dropzone 
                                                onDrop={this.onDropPhoto} 
                                                // accept="video/*" 
                                                minSize={0}
                                                maxSize={maxSize}
                                                multiple={false}
                                            >
                                                {({getRootProps, getInputProps, isDragActive, isDragReject, rejectedFiles}) => {
                                                    const isFileTooLarge = rejectedFiles && rejectedFiles.length > 0 && rejectedFiles[0].size > maxSize;
                                                    return (
                                                        <section>
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent:'center', borderWidth: 2, height: '25em', borderRadius: 2, textAlign: 'center', borderColor: '#eeeeee', borderStyle: 'dashed', backgroundColor: '#fafafa', color: '#bdbdbd' }} 
                                                            {...getRootProps({className: 'dropzone',
                                                                onClick: event => event.stopPropagation()
                                                            })}>
                                                                <input {...getInputProps()} />
                                                                {!isDragActive && !filePreview.length && 'Drop a file to upload!'}
                                                                {isDragActive && !isDragReject && "Drop it like it's hot!"}
                                                                {isDragReject && "File type not accepted, sorry!"}
                                                                {isFileTooLarge && (
                                                                    <div className="text-danger mt-2">
                                                                        File is too large. Max Size 1GB
                                                                    </div>
                                                                )}
                                                                { filePreview }
                                                                { filePreview.length ? <div style={{ width: '15%', position: 'absolute', padding: 14, backgroundColor: 'whitesmoke', borderRadius: 20 }}>
                                                                    <CircularProgressbar value={this.state.filesProgress} text={`${this.state.filesProgress}%`} /> 
                                                                    </div> : null 
                                                                }
                                                            </div>
                                                            {
                                                                this.state.isValid.value && this.state.isValid.name === 'files' ?
                                                                <Form.Text style={{ color: 'red' }}>
                                                                    { this.state.isValid.text }
                                                                </Form.Text> : ''
                                                            }
                                                        </section>
                                                    )}
                                                }
                                            </Dropzone>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div>
                                                {
                                                    this.state.isValid.value && this.state.isValid.name === 'server_error' ?
                                                    <Form.Text style={{ color: 'red' }}>
                                                        { this.state.isValid.text }
                                                    </Form.Text> : ''
                                                }
                                            </div>
                                        </Col>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="primary" disabled={this.state.isLoading} onClick={() => this.handleReSubmission()}>
                                        Submit
                                    </Button>
                                    <Button variant="secondary" disabled={this.state.isLoading} onClick={() => this.cancelReSubmission()}>
                                        Cancel
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        }
                        <NotificationContainer/>
                        <Col>
                            <Card>
                                <Card.Header>
                                    <Card.Title as="h5">Assignments List</Card.Title>
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
                                                        <th>Submission Date</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.data.map((elem, i) => (
                                                            <tr key={i}>
                                                                <td>{elem.title}</td>
                                                                <td>{elem.total_marks}</td>
                                                                <td>{ Object.keys(elem.assignment_submissions).length ? elem.assignment_submissions.obtained_marks : null }</td>
                                                                <td>{new Date(elem.submission_date).toString()}</td>
                                                                <td>
                                                                    <Button style={{ width: '100%' }} onClick={(e) => this.openDownloadModal(elem)} variant='primary'>Download</Button>
                                                                    <br />
                                                                    {
                                                                        Object.keys(elem.assignment_submissions).length ? <>
                                                                            <Badge pill variant="info" style={{ width: '100%', padding: 10 }}>Already Submitted</Badge> <br />
                                                                            { new Date(elem.submission_date) < new Date() ? null : <Button className='mt-1 mb-1' style={{ width: '100%' }} onClick={(e) => this.goToReeSubmissions(elem)} variant={'outline-primary'}>{ 'Resubmit Now' }</Button> }
                                                                        </> : new Date(elem.submission_date) < new Date() ? <Badge pill variant="danger" style={{ width: '100%', padding: 10 }}>Late</Badge> : 
                                                                        <Button style={{ width: '100%' }} onClick={(e) => this.goToSubmissions(elem)} variant={'outline-primary'}>{ 'Submit Now' }</Button>
                                                                    }
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
                </fieldset>
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.userDetails.user
    }
}

export default connect(mapStateToProps, actions)(ListAssignment);

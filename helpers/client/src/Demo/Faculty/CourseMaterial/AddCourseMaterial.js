import React from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import axios from 'axios';
import configs from '../../../config';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Loader from '../../../App/layout/Loader';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

class AddCourseMaterial extends React.Component {

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
            class_id: "",
            isValid: {
                value: false,
                text: ''   
            },
            data: [],
            files: [],
            filesProgress: 0,
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
        const { name, files, class_id  } = this.state;

        if (!name && name.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Title', name: 'name' }});
            return;
        }

        if (!files.length) {
            this.setState({ isValid: { value: true, text: 'Please drop a file above', name: 'files' }});
            return;
        }
        
        await this.setState({ filesProgress: 0 });
        let that = this;
        const config = {
            onUploadProgress: function(progressEvent) {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                that.setState({ filesProgress: percentCompleted });
            }
        }
        
        let data = new FormData()
        data.append('course-material', files[0]);
        data.append('title', name.trim());
        data.append('class_id', class_id);
        
        axios.post(`${configs.prod}/api/class/course/material/create`, data, config)
            .then(response => {
                this.props.history.push(`/faculty/class/list`);
            })
            .catch(err => {
                console.log('Error: ', err.response);
                if (err.response && err.response.status && (err.response.status === 400 || err.response.status === 500)) {
                    if (err.response.status === 500 && err.response.data.error.name === 'SequelizeUniqueConstraintError') {
                        this.setState({ filesProgress: 0, isValid: { value: true, text: 'Course Material with this title already exist', name:'server_error' } });
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
        const filePreview = this.state.files.map((file, i) => (
            <i key={i} style={{ fontSize: '20em' }} class="feather icon-file"></i>
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
                                                        <Form.Label>Course Material Title</Form.Label>
                                                        <Form.Control 
                                                            type="text" 
                                                            name="name" 
                                                            placeholder="Course Material Title" 
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

export default connect(mapStateToProps, null)(AddCourseMaterial);

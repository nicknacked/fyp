import React from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import axios from 'axios';
import config from '../../../config';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import "./EditPerson.css";
import DateTime from 'react-datetime';
import Select from 'react-select';

class EditPerson extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            baseLocation: "",
            clientBaseLocation: "",
            dateOfOrigin: "",
            contractToDate: "",
            gdprStatusDate: "",
            clientManager: "",
            folder: "",
            cv: "",
            notes: "",
            isValid: {
                value: false,
                text: '',
                name: ''
            },
            jobTitle: [],
            available: [],
            origin: [],
            clearance: [],
            willingToTravel: [],
            gdpr: [],
            keySkills: [],
            clients: [],
            job_title_id: "",
            available_id: "",
            origin_id: "",
            clearance_id: "",
            willing_to_travel_id: "",
            gdpr_id: "",
            client_id: null,
            key_skills_id: null,
        }
    }

    handleTextChange(event) {
      this.setState({ [event.name]: event.value });
    }

    async componentDidMount() {
        if (this.props && this.props.match && this.props.match.params && this.props.match.params.id) {
            await this.setState({selected_id: this.props.match.params.id });
            let promiseArray = [];
            promiseArray.push(axios.get(`${config.prod}/api/choices/jobtitle/list`));
            promiseArray.push(axios.get(`${config.prod}/api/choices/travel/list`));
            promiseArray.push(axios.get(`${config.prod}/api/choices/origin/list`));
            promiseArray.push(axios.get(`${config.prod}/api/choices/gdpr/list`));
            promiseArray.push(axios.get(`${config.prod}/api/choices/clearance/list`));
            promiseArray.push(axios.get(`${config.prod}/api/available/list`));
            promiseArray.push(axios.get(`${config.prod}/api/choices/skills/list`));
            promiseArray.push(axios.get(`${config.prod}/api/clients/list`));
            promiseArray.push(axios.get(`${config.prod}/api/persons/person/${this.state.selected_id}`));
    
            Promise.all(promiseArray)
                .then(res=> {
                    let clients = [];
                    let keySkills = [];
                    res[7].data.forEach(elem => {
                        clients.push({ value: elem.id, label: elem.clients })
                    });
                    res[6].data.results.forEach(elem => {
                        keySkills.push({ value: elem.id, label: elem.skill });
                    });
                    this.setState({
                        jobTitle: res[0].data.results,
                        willingToTravel: res[1].data.results,
                        origin: res[2].data.results,
                        gdpr: res[3].data.results,
                        clearance: res[4].data.results,
                        available: res[5].data,
                        keySkills: keySkills,
                        clients: clients,
                        firstName: res[8].data.result.first_name,
                        lastName: res[8].data.result.last_name,
                        email: res[8].data.result.email,
                        phone: res[8].data.result.phone,
                        baseLocation: res[8].data.result.base_location,
                        clientBaseLocation: res[8].data.result.client_base_location,
                        clientManager: res[8].data.result.client_manager,
                        folder: res[8].data.result.folder,
                        cv: res[8].data.result.cv,
                        notes: res[8].data.result.notes,
                        dateOfOrigin: res[8].data.result.date_of_origin,
                        gdprStatusDate: res[8].data.result.gdpr_status_date,
                        contractToDate: res[8].data.result.contract_to_date
                    });
                    console.log(res[8].data.result.contract_to_date)
                    if (res[1].data.results.length >=1) {
                        this.setState({ job_title_id: Object.keys(res[8].data.result.job_title_choice).length ? res[8].data.result.job_title_choice.id : res[0].data.results[0].id });
                    }
                    
                    if (res[1].data.results.length >=1) {
                        console.log(res[8].data.result.travel_choice.id);
                        this.setState({ willing_to_travel_id: Object.keys(res[8].data.result.travel_choice).length ? res[8].data.result.travel_choice.id : res[1].data.results[0].id });
                    }
    
                    if (res[2].data.results.length >=1) {
                        this.setState({ origin_id: Object.keys(res[8].data.result.origin_choice).length ? res[8].data.result.origin_choice.id : res[2].data.results[0].id });
                    }
    
                    if (res[3].data.results.length >=1) {
                        this.setState({ gdpr_id: Object.keys(res[8].data.result.gdpr_choice).length ? res[8].data.result.gdpr_choice.id : res[3].data.results[0].id });
                    }
    
                    if (res[4].data.results.length >=1) {
                        this.setState({ clearance_id: Object.keys(res[8].data.result.clearance_choice).length ? res[8].data.result.clearance_choice.id : res[4].data.results[0].id });
                    }
    
                    if (res[5].data.length >=1) {
                        this.setState({ available_id: Object.keys(res[8].data.result.available).length ? res[8].data.result.available.id : res[5].data[0].id });
                    }
                })
                .catch(err => {
                    console.log('Error in getting data', err.response);
                });
        } else {
            this.props.history.push('/person/list');
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

    handleSubmit(e) {
        e.preventDefault();
        const { firstName, lastName, email, baseLocation, phone, clientBaseLocation, dateOfOrigin, clientManager,
            job_title_id, available_id, origin_id, clearance_id, willing_to_travel_id, gdpr_id, gdprStatusDate,
            contractToDate, folder, cv, notes, client_id, key_skills_id } = this.state;
       
        if (!firstName && firstName.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid First Name', name: 'firstName' }});
            return;
        }

        if (!lastName && lastName.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Last Name', name: 'lastName' }});
            return;
        }

        if (!email && email.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid email', name: 'email' }});
            return;
        }
        
        if (!baseLocation && baseLocation.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Base Location', name: 'baseLocation' }});
            return;
        }
        
        if (!phone && phone.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Phone', name: 'phone' }});
            return;
        }

        if (!clientBaseLocation && clientBaseLocation.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Client Base Location', name: 'clientBaseLocation' }});
            return;
        }

        if (!clientManager && clientManager.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please enter valid Client Manager', name: 'clientManager' }});
            return;
        }

        if (!dateOfOrigin && dateOfOrigin.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please select valid Date of Origin', name: 'dateOfOrigin' }});
            return;
        }

        if (!gdprStatusDate && gdprStatusDate.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please select valid GDPR Status Date', name: 'gdprStatusDate' }});
            return;
        }

        if (!contractToDate && contractToDate.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please select valid Contract to Date', name: 'contractToDate' }});
            return;
        }

        if (!folder && folder.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please select valid Folder', name: 'folder' }});
            return;
        }

        if (!cv && cv.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please select valid CV', name: 'cv' }});
            return;
        }

        if (!notes && notes.trim().length <= 0) {
            this.setState({ isValid: { value: true, text: 'Please select valid Notes', name: 'notes' }});
            return;
        }

        axios.put(`${config.prod}/api/persons/person/${this.state.selected_id}`, { 
          firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(),baseLocation: baseLocation.trim(),
          phone: phone.trim(), clientBaseLocation: clientBaseLocation.trim(), dateOfOrigin, clientManager: clientManager.trim(),
          job_title_id, available_id, origin_id, clearance_id, willing_to_travel_id, gdpr_id, gdprStatusDate, contractToDate,
          folder: folder.trim(), cv: cv.trim(), notes: notes.trim(), client_id: client_id && client_id.length > 0 ? client_id: [], 
          key_skills_id: key_skills_id && key_skills_id.length > 0 ? key_skills_id : []
        })
            .then(response => {
                this.createNotification('success', 'Person Updated Successfully');
            })
            .catch(err => {
                console.log('Error: ', err.response);
                if (err.response && err.response.status && (err.response.status === 400 || err.response.status === 500)) {
                    console.log(err.response.data);
                    this.createNotification('error', err.response.data.msg);
                } else {
                    this.setState({ isValid: { value: true, text: 'Unknown Error' } });
                    this.createNotification('error', 'Unknown Error');
                }
            });
    }

    handleChange(e,name) {
        this.setState({ [name]: e._d.toISOString() });
    }

    handleSelectChange(value, name) {
        this.setState({ [name]: value });
    }

    handleMultiSelectChange(value, name) {
        this.setState({ [name]: value });
    }

    render() {
        return (
            <Aux>
                <Row>
                    <NotificationContainer/>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Update Person</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Form className="col-md-12" onSubmit={(e) => this.handleSubmit(e)}>
                                        <Form.Row>
                                            <Col md={6} lg={6}>
                                                <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                                    <Form.Label>First Name <span className="required">*</span></Form.Label>
                                                    <Form.Control 
                                                        type="text" 
                                                        name="firstName" 
                                                        placeholder="First Name e.g, Tony" 
                                                        value={this.state.firstName}
                                                        className={this.state.isValid.value && this.state.isValid.name === 'firstName' ? 'in-valid-input' : ''}
                                                        onFocus={() => this.setState({ isValid: { value: false, text: '', name: '' }})}
                                                        onChange={(e) => this.handleTextChange(e.target) }
                                                    />
                                                    {
                                                        this.state.isValid.value && this.state.isValid.name === 'firstName' ?
                                                        <Form.Text style={{ color: 'red' }}>
                                                            { this.state.isValid.text }
                                                        </Form.Text> : ''
                                                    }
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} lg={6}>
                                                <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                                    <Form.Label>Last Name <span className="required">*</span></Form.Label>
                                                    <Form.Control 
                                                        type="text" 
                                                        name="lastName" 
                                                        placeholder="Last Name e.g, Rowley" 
                                                        value={this.state.lastName}
                                                        className={this.state.isValid.value && this.state.isValid.name === 'lastName' ? 'in-valid-input' : ''}
                                                        onFocus={() => this.setState({ isValid: { value: false, text: '', name: ''}})}
                                                        onChange={(e) => this.handleTextChange(e.target) }
                                                    />
                                                    {
                                                        this.state.isValid.value && this.state.isValid.name === 'lastName' ?
                                                        <Form.Text style={{ color: 'red' }}>
                                                            { this.state.isValid.text }
                                                        </Form.Text> : ''
                                                    }
                                                </Form.Group>
                                            </Col>
                                        </Form.Row>
                                        <Form.Row>
                                            <Col md={6} lg={6}>
                                                <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                                    <Form.Label>Email <span className="required">*</span></Form.Label>
                                                    <Form.Control 
                                                        type="email" 
                                                        name="email" 
                                                        placeholder="e.g, example@gmail.com" 
                                                        value={this.state.email}
                                                        className={this.state.isValid.value && this.state.isValid.name === 'email' ? 'in-valid-input' : ''}
                                                        onFocus={() => this.setState({ isValid: { value: false, text: '', name: ''}})}
                                                        onChange={(e) => this.handleTextChange(e.target) }
                                                    />
                                                    {
                                                        this.state.isValid.value && this.state.isValid.name === 'email' ?
                                                        <Form.Text style={{ color: 'red' }}>
                                                            { this.state.isValid.text }
                                                        </Form.Text> : ''
                                                    }
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} lg={6}>
                                                <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                                    <Form.Label>Phone <span className="required">*</span></Form.Label>
                                                    <Form.Control 
                                                        type="text" 
                                                        name="phone" 
                                                        placeholder="e.g, +92-333-4023554" 
                                                        value={this.state.phone}
                                                        className={this.state.isValid.value && this.state.isValid.name === 'phone' ? 'in-valid-input' : ''}
                                                        onFocus={() => this.setState({ isValid: { value: false, text: '', name:''}})}
                                                        onChange={(e) => this.handleTextChange(e.target) }
                                                    />
                                                    {
                                                        this.state.isValid.value && this.state.isValid.name === 'phone' ?
                                                        <Form.Text style={{ color: 'red' }}>
                                                            { this.state.isValid.text }
                                                        </Form.Text> : ''
                                                    }
                                                </Form.Group>
                                            </Col>
                                        </Form.Row>
                                        <Form.Row>
                                            <Col md={6} lg={6}>
                                                <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                                    <Form.Label>Base Location <span className="required">*</span></Form.Label>
                                                    <Form.Control 
                                                        type="text" 
                                                        name="baseLocation" 
                                                        placeholder="Base Location" 
                                                        value={ this.state.baseLocation }
                                                        className={this.state.isValid.value && this.state.isValid.name === 'baseLocation' ? 'in-valid-input' : ''}
                                                        onFocus={() => this.setState({ isValid: { value: false, text: '', name:''}})}
                                                        onChange={(e) => this.handleTextChange(e.target) }
                                                    />
                                                    {
                                                        this.state.isValid.value && this.state.isValid.name === 'baseLocation' ?
                                                        <Form.Text style={{ color: 'red' }}>
                                                            { this.state.isValid.text }
                                                        </Form.Text> : ''
                                                    }
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} lg={6}>
                                                <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                                    <Form.Label>Client Base Location <span className="required">*</span></Form.Label>
                                                    <Form.Control 
                                                        type="text" 
                                                        name="clientBaseLocation" 
                                                        placeholder="Client Base Location" 
                                                        value={this.state.clientBaseLocation}
                                                        className={this.state.isValid.value && this.state.isValid.name === 'clientBaseLocation' ? 'in-valid-input' : ''}
                                                        onFocus={() => this.setState({ isValid: { value: false, text: '', name:''}})}
                                                        onChange={(e) => this.handleTextChange(e.target) }
                                                    />
                                                    {
                                                        this.state.isValid.value && this.state.isValid.name === 'clientBaseLocation' ?
                                                        <Form.Text style={{ color: 'red' }}>
                                                            { this.state.isValid.text }
                                                        </Form.Text> : ''
                                                    }
                                                </Form.Group>
                                            </Col>
                                        </Form.Row>
                                        <Form.Row>
                                            <Col md={6} lg={6}>
                                                <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                                    <Form.Label>Client Manager <span className="required">*</span></Form.Label>
                                                    <Form.Control 
                                                        type="text" 
                                                        name="clientManager" 
                                                        placeholder="Client Manager" 
                                                        value={ this.state.clientManager }
                                                        className={this.state.isValid.value && this.state.isValid.name === 'clientManager' ? 'in-valid-input' : ''}
                                                        onFocus={() => this.setState({ isValid: { value: false, text: '', name:''}})}
                                                        onChange={(e) => this.handleTextChange(e.target) }
                                                    />
                                                    {
                                                        this.state.isValid.value && this.state.isValid.name === 'clientManager' ?
                                                        <Form.Text style={{ color: 'red' }}>
                                                            { this.state.isValid.text }
                                                        </Form.Text> : ''
                                                    }
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} lg={6}>
                                                <Form.Group controlId="exampleForm.ControlSelect1">
                                                    <Form.Label>Clearance</Form.Label>
                                                    <Form.Control value={this.state.clearance_id} as="select" onChange={(e) => this.handleSelectChange(e.target.value,'clearance_id')}>
                                                    {
                                                        this.state.clearance.map(elem => <option value={elem.id} key={elem.id}>{elem.clearance}</option>)
                                                    }
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                        </Form.Row>
                                        <Form.Row>
                                            <Col md={6} lg={6}>
                                                <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                                    <Form.Label>Contract to Date <span className="required">*</span></Form.Label>
                                                    <DateTime 
                                                        inputProps={{ readOnly: true }} 
                                                        value={this.state.contractToDate}
                                                        utc={true}
                                                        className={this.state.isValid.value && this.state.isValid.name === 'contractToDate' ? 'in-valid-input' : ''}
                                                        onFocus={() => this.setState({ isValid: { value: false, text: '', name:''}})}
                                                        onChange={ (e) => this.handleChange(e,'contractToDate')} 
                                                    />
                                                    {
                                                        this.state.isValid.value && this.state.isValid.name === 'contractToDate' ?
                                                        <Form.Text style={{ color: 'red' }}>
                                                            { this.state.isValid.text }
                                                        </Form.Text> : ''
                                                    }
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} lg={6}>
                                                <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                                    <Form.Label>Date of Origin <span className="required">*</span></Form.Label>
                                                    <DateTime 
                                                        inputProps={{ readOnly: true }} 
                                                        value={this.state.dateOfOrigin}
                                                        utc={true}
                                                        className={this.state.isValid.value && this.state.isValid.name === 'dateOfOrigin' ? 'in-valid-input' : ''}
                                                        onFocus={() => this.setState({ isValid: { value: false, text: '', name:''}})}
                                                        onChange={ (e) => this.handleChange(e,'dateOfOrigin')} 
                                                    />
                                                    {
                                                        this.state.isValid.value && this.state.isValid.name === 'dateOfOrigin' ?
                                                        <Form.Text style={{ color: 'red' }}>
                                                            { this.state.isValid.text }
                                                        </Form.Text> : ''
                                                    }
                                                </Form.Group>
                                            </Col>
                                        </Form.Row>
                                        <Form.Row>
                                            <Col md={6} lg={6}>
                                                <Form.Group controlId="exampleForm.ControlSelect1">
                                                    <Form.Label>GDPR</Form.Label>
                                                    <Form.Control value={this.state.gdpr_id} as="select" onChange={(e) => this.handleSelectChange(e.target.value,'gdpr_id')}>
                                                    {
                                                        this.state.gdpr.map(elem => <option value={elem.id} key={elem.id}>{elem.gdpr}</option>)
                                                    }
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} lg={6}>
                                                <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                                    <Form.Label>GDPR Staus Date <span className="required">*</span></Form.Label>
                                                    <DateTime 
                                                        inputProps={{ readOnly: true }} 
                                                        utc={true}
                                                        value={this.state.gdprStatusDate}
                                                        className={this.state.isValid.value && this.state.isValid.name === 'gdprStatusDate' ? 'in-valid-input' : ''}
                                                        onFocus={() => this.setState({ isValid: { value: false, text: '', name:''}})}
                                                        onChange={ (e) => this.handleChange(e,'gdprStatusDate')} 
                                                    />
                                                    {
                                                        this.state.isValid.value && this.state.isValid.name === 'gdprStatusDate' ?
                                                        <Form.Text style={{ color: 'red' }}>
                                                            { this.state.isValid.text }
                                                        </Form.Text> : ''
                                                    }
                                                </Form.Group>
                                            </Col>
                                        </Form.Row>
                                        <Form.Row>
                                            <Col md={6} lg={6}>
                                                <Form.Group controlId="exampleForm.ControlSelect1">
                                                    <Form.Label>Job Title</Form.Label>
                                                    <Form.Control value={this.state.job_title_id} as="select" onChange={(e) => this.handleSelectChange(e.target.value,'job_title_id')}>
                                                        {
                                                            this.state.jobTitle.map(elem => <option value={elem.id} key={elem.id}>{elem.job_title}</option>)
                                                        }
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} lg={6}>
                                                <Form.Group controlId="exampleForm.ControlSelect1">
                                                    <Form.Label>Available</Form.Label>
                                                    <Form.Control value={this.state.available_id} as="select" onChange={(e) => this.handleSelectChange(e.target.value,'available_id')}>
                                                    {
                                                        this.state.available.map(elem => <option value={elem.id} key={elem.id}>{elem.available}</option>)
                                                    }
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                        </Form.Row>
                                        <Form.Row>
                                            <Col md={6} lg={6}>
                                                <Form.Group controlId="exampleForm.ControlSelect1">
                                                    <Form.Label>Origin</Form.Label>
                                                    <Form.Control value={this.state.origin_id} as="select" onChange={(e) => this.handleSelectChange(e.target.value,'origin_id')}>
                                                    {
                                                        this.state.origin.map(elem => <option value={elem.id} key={elem.id}>{elem.origin}</option>)
                                                    }
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} lg={6}>
                                                <Form.Group controlId="exampleForm.ControlSelect1">
                                                    <Form.Label>Willing To Travel</Form.Label>
                                                    <Form.Control 
                                                        value={this.state.willing_to_travel_id}
                                                        as="select" onChange={(e) => this.handleSelectChange(e.target.value,'willing_to_travel_id')}>
                                                        {
                                                            this.state.willingToTravel.map(elem => <option value={elem.id} key={elem.id}>{elem.travel}</option>)
                                                        }
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                        </Form.Row>
                                        <Form.Row>
                                            <Col md={6} lg={6}>
                                                <Form.Group controlId="exampleForm.ControlSelect1">
                                                    <Form.Label>Clients</Form.Label>
                                                    <div>
                                                        <Select
                                                            onChange={ (e) =>this.handleMultiSelectChange(e, 'client_id')}
                                                            options={this.state.clients}
                                                            isMulti={true}
                                                        />
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} lg={6}>
                                                <Form.Group >
                                                    <Form.Label>Key Skills </Form.Label>
                                                    <div>
                                                        <Select
                                                            onChange={(e)=>this.handleMultiSelectChange(e,'key_skills_id')}
                                                            options={this.state.keySkills}
                                                            isMulti={true}
                                                        />
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                        </Form.Row>
                                        <Form.Row>
                                            <Col md={6} lg={6}>
                                                <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                                    <Form.Label>Folder <span className="required">*</span></Form.Label>
                                                    <Form.Control 
                                                        type="text" 
                                                        name="folder" 
                                                        placeholder="Folder" 
                                                        value={this.state.folder}
                                                        className={this.state.isValid.value && this.state.isValid.name === 'folder' ? 'in-valid-input' : ''}
                                                        onFocus={() => this.setState({ isValid: { value: false, text: '', name: '' }})}
                                                        onChange={(e) => this.handleTextChange(e.target) }
                                                    />
                                                    {
                                                        this.state.isValid.value && this.state.isValid.name === 'folder' ?
                                                        <Form.Text style={{ color: 'red' }}>
                                                            { this.state.isValid.text }
                                                        </Form.Text> : ''
                                                    }
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} lg={6}>
                                                <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                                    <Form.Label>CV <span className="required">*</span></Form.Label>
                                                    <Form.Control 
                                                        type="text" 
                                                        name="cv" 
                                                        placeholder="CV" 
                                                        value={this.state.cv}
                                                        className={this.state.isValid.value && this.state.isValid.name === 'cv' ? 'in-valid-input' : ''}
                                                        onFocus={() => this.setState({ isValid: { value: false, text: '', name: ''}})}
                                                        onChange={(e) => this.handleTextChange(e.target) }
                                                    />
                                                    {
                                                        this.state.isValid.value && this.state.isValid.name === 'cv' ?
                                                        <Form.Text style={{ color: 'red' }}>
                                                            { this.state.isValid.text }
                                                        </Form.Text> : ''
                                                    }
                                                </Form.Group>
                                            </Col>
                                        </Form.Row>
                                        <Form.Row>
                                            <Col>
                                                <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                                    <Form.Label>Notes <span className="required">*</span></Form.Label>
                                                    <Form.Control 
                                                        as="textarea" 
                                                        rows="3" 
                                                        name="notes" 
                                                        placeholder="Notes"
                                                        value={this.state.notes}
                                                        className={this.state.isValid.value && this.state.isValid.name === 'notes' ? 'in-valid-input' : ''}
                                                        onFocus={() => this.setState({ isValid: { value: false, text: '', name: '' }})}
                                                        onChange={(e) => this.handleTextChange(e.target) }
                                                    />
                                                    {
                                                        this.state.isValid.value && this.state.isValid.name === 'notes' ?
                                                        <Form.Text style={{ color: 'red' }}>
                                                            { this.state.isValid.text }
                                                        </Form.Text> : ''
                                                    }
                                                </Form.Group>
                                            </Col>
                                        </Form.Row>
                                        <Form.Row>
                                            <Col md={3}></Col>
                                            <Col md={6} lg={6}> 
                                                <Button type="submit" className="mt-4 custom-submit-btn" variant="primary">
                                                    Submit 
                                                </Button>
                                            </Col>
                                            <Col md={3}></Col>
                                        </Form.Row>
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

export default EditPerson;

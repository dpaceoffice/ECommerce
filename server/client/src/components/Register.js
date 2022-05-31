import React, { Component } from 'react';

export default class Register extends Component {
    constructor() {
        super();
        this.state = { name: '', email: '', password: '' };
    }
    submit = () => {
        console.log(this.state.name);
        console.log(this.state.email);
        console.log(this.state.password);
    }
    render() {
        return (<div className="modal-content" id="modal-content">
            <div className="modal-header" style={{ backgroundColor: '#d2e2d8' }}>
                <h5 className="modal-title" id="staticBackdropLabel">Register</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body flex">
                <small id="error-msg" className="text-danger"></small>
                <div>
                    <label htmlFor='name' style={{ paddingRight: '1rem' }}>Username: </label>
                    <input type='text' id='registerName' placeholder='optional' onChange={(e) => this.setState({ name: e.target.value })} value={this.state.name} />
                </div>
                <br />
                <div>
                    <label htmlFor='email' style={{ paddingRight: '1rem' }}>Email: </label>
                    <input type='email' id='registerEmail' placeholder='required' onChange={(e) => this.setState({ email: e.target.value })} value={this.state.email} required />
                </div>
                <br />
                <div>
                    <label htmlFor='password' style={{ paddingRight: '1rem' }}>Password: </label>
                    <input type='password' id='registerPassword' placeholder='required' onChange={(e) => this.setState({ password: e.target.value })} value={this.state.password} required />
                </div>
            </div>

            <div className="modal-footer">
                <p className="bi-text-left me-5">Already have an account? <button id="show-login" onClick={this.props.swap}>Login here.</button></p>
                <button id="register-button" type="button" className="btn" onClick={this.submit} style={{ backgroundColor: '#709a71' }}>Register</button>
            </div>
        </div>);
    }
}
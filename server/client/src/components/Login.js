import React, { Component } from 'react';

export default class Login extends Component {
    constructor() {
        super();
        this.state = { email: '', password: '' };
    }
    auth_click = () => {
        console.log(this.state.email);
        console.log(this.state.password);
    }
    render() {
        return (<div className="modal-content" id="modal-content">
            <div className="modal-header" style={{ backgroundColor: '#d2e2d8' }}>
                <h5 className="modal-title" id="staticBackdropLabel">Login</h5>
                <button type="button" id="login-modal-close" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body flex">
                <p id="email-error" className="text-danger"></p>
                <div>
                    <label htmlFor='email' style={{ paddingRight: '1rem' }}>Email:</label>
                    <input placeHolder='Email/Username' type='email' id='email' name='email' onChange={(e) => this.setState({ email: e.target.value })} value={this.state.email} required />
                </div>
                <br />
                <p id="password-error" className="text-danger"></p>
                <div>
                    <label htmlFor='password' style={{ paddingRight: '1rem' }}>Password:</label>
                    <input type='password' id='password' name='password' onChange={(e) => this.setState({ password: e.target.value })} value={this.state.password} required />
                </div>
            </div>
            <div className="modal-footer">
                <p className="bi-text-left me-5">Don't have an account? <button id="show-register" onClick={this.props.swap} >Register here.</button></p>
                <button id="login-button" onClick={this.auth_click} type="button" className="btn" style={{ backgroundColor: '#709a71' }}>Login</button>
            </div>
        </div>);
    }
}
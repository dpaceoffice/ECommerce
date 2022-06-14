import React, { Component } from 'react';

export default class Login extends Component {
    constructor() {
        super();
        this.state = { email: '', password: '', err: '' };
    }
    handleLogin = async () => {
        try {
            let email = this.state.email;
            let password = this.state.password;

            const config = new Object();
            config.method = "POST";
            config.headers = { 'Content-Type': 'application/json' };
            config.body = JSON.stringify({ email: email, password: password });

            const response = await fetch(`/login/`, config);
            const data = await response.json();
            const error = data.message;
            if (error !== 'user authenticated')
                this.setState({ err: error });
            else {
                this.modal_close.click();
                this.props.updateStatus();
            }
        } catch (error) {
            console.log(error.stack);
        }
    }

    auth = async () => {
        const format = (err) => {
            var usernameRegex = /^[a-zA-Z0-9]+$/;
            var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
            var emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
            if ((this.state.email.match(usernameRegex) == null && this.state.email.match(emailRegex) == null) || this.state.password.match(passwordRegex) == null)
                err = 'Your login username/password is incorrect';
            else
                err = '';
            this.setState({ err: err });
            return err;
        }
        if (!format(this.state.err))
            await this.handleLogin();
    }

    handleEnter = (event) => {
        if (event.key.toLowerCase() === "enter") {
            const form = event.target.form;
            const index = [...form].indexOf(event.target);
            if (form.elements.length - 1 < index + 1)
                this.auth();
            else
                form.elements[index + 1].focus();
            event.preventDefault();
        }
    }
    render() {
        return (<div className="modal-content" id="modal-content">
            <div className="modal-header" style={{ backgroundColor: '#d2e2d8' }}>
                <h5 className="modal-title" id="staticBackdropLabel">Login</h5>
                <button type="button" id="login-modal-close" ref={(modal_close) => { this.modal_close = modal_close; }} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body flex">
                <small id="error-msg" className="text-danger">{this.state.err}</small>
                <form className="p-1">
                    <div>
                        <label htmlFor='email' style={{ paddingRight: '1rem' }}>Email:</label>
                        <input placeholder='email/username' type='email' id='email' name='email' onKeyPress={this.handleEnter} onChange={(e) => this.setState({ email: e.target.value })} value={this.state.email} required />
                    </div>
                    <br />
                    <div>
                        <label htmlFor='password' style={{ paddingRight: '1rem' }}>Password:</label>
                        <input placeholder='required' type='password' id='password' name='password' onKeyPress={this.handleEnter} onChange={(e) => this.setState({ password: e.target.value })} value={this.state.password} required />
                    </div>
                </form>
            </div>
            <div className="modal-footer">
                <p className="bi-text-left me-5">Don't have an account? <button id="show-register" onClick={this.props.swap} >Register here.</button></p>
                <button id="login-button" onClick={this.auth} type="button" className="btn" style={{ backgroundColor: '#709a71' }}>Login</button>
            </div>
        </div >);
    }
}
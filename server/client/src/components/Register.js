import React, { Component } from 'react';

export default class Register extends Component {
    constructor() {
        super();
        this.state = { name: '', email: '', password: '', err: '' };
    }

    handleRegister = async () => {
        try {
            const config = new Object();
            config.method = "POST";
            config.headers = { 'Content-Type': 'application/json' };
            config.body = JSON.stringify({ 'name': this.state.name, 'email': this.state.email, 'password': this.state.password });
            const response = await fetch("/register", config);
            const data = await response.json();

            if (data.error) {
                this.setState({ err: data.errorMsg });
            } else {
                this.props.swap();
            }

        } catch (error) {
            console.log(error.stack);
        }
    }
    handleEnter = (event) => {
        if (event.key.toLowerCase() === "enter") {
            const form = event.target.form;
            const index = [...form].indexOf(event.target);
            if (form.elements.length - 1 < index + 1)
                this.submit();
            else
                form.elements[index + 1].focus();
            event.preventDefault();
        }
    }
    submit = async () => {
        /**Type checking */
        const format = (err) => {
            var usernameRegex = /^[a-zA-Z0-9]+$/;
            var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
            var emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
            if (this.state.name.match(usernameRegex) == null)
                err = 'Your first name is not valid. Only characters A-Z, a-z and \'-\' are  acceptable.';
            else if (this.state.email.match(emailRegex) == null)
                err = 'The email entered is invalid!';
            else if (this.state.password.match(passwordRegex) == null)
                err = 'Password must be a minimum eight characters, at least one letter, one number and one special character.';
            else
                err = '';
            if (err)
                this.setState({ err: err });
            return err;
        };
        if (!format(this.state.err))
            await this.handleRegister();
        /**Creation Request To Server*/
    }

    render() {
        return (<div className="modal-content" id="modal-content">
            <div className="modal-header" style={{ backgroundColor: '#d2e2d8' }}>
                <h5 className="modal-title" id="staticBackdropLabel">Register</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body flex">
                <small id="error-msg" className="text-danger">{this.state.err}</small>
                <form className="p-1">
                    <div>
                        <label htmlFor='name' style={{ paddingRight: '1rem' }}>Username: </label>
                        <input type='text' id='registerName' placeholder='optional' onKeyPress={this.handleEnter} onChange={(e) => this.setState({ name: e.target.value })} value={this.state.name} />
                    </div>
                    <br />
                    <div>
                        <label htmlFor='email' style={{ paddingRight: '1rem' }}>Email: </label>
                        <input type='email' id='registerEmail' placeholder='required' onKeyPress={this.handleEnter} onChange={(e) => this.setState({ email: e.target.value })} value={this.state.email} required />
                    </div>
                    <br />
                    <div>
                        <label htmlFor='password' style={{ paddingRight: '1rem' }}>Password: </label>
                        <input type='password' id='registerPassword' placeholder='required' onKeyPress={this.handleEnter} onChange={(e) => this.setState({ password: e.target.value })} value={this.state.password} required />
                    </div>
                </form>
            </div>

            <div className="modal-footer">
                <p className="bi-text-left me-5">Already have an account? <button id="show-login" onClick={this.props.swap}>Login here.</button></p>
                <button id="register-button" type="submit" className="btn" onClick={this.submit} style={{ backgroundColor: '#709a71' }}>Register</button>
            </div>
        </div>);
    }
}
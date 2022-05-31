import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.js';
import '../styles/NavBar.css';
import Register from './Register';
import Login from './Login';
import React, { Component } from 'react';
const REG_VIEW = 1;
const LOGIN_VIEW = 0;
class NavBar extends Component {
    constructor() {
        super();
        this.state = { modal: LOGIN_VIEW, email: '', password: '' };
    }

    swap_modal = () => {
        if (this.state.modal === LOGIN_VIEW) {
            this.setState({ modal: REG_VIEW });
        } else {
            this.setState({ modal: LOGIN_VIEW });
        }
    }

    render() {
        const data = this.props.data;
        const authenticated = (data.user !== undefined);

        let auth_button = <button type="button" className="btn" style={{ color: 'white' }} id="login-show" data-bs-toggle="modal"
            data-bs-target="#staticBackdrop">
            <i id='login-modal' className="bi bi-cart"> </i>{authenticated ? 'Checkout' : 'Login'}
        </button>;
        let modal_content = (this.state.modal === REG_VIEW) ? <Register swap={this.swap_modal} /> : <Login swap={this.swap_modal} />;

        return (
            <div className="NavBar" >
                <nav className="navbar navbar-expand-sm navbar-light container-fluid" style={{ backgroundColor: '#709a71' }}>
                    <button className="navbar-brand" style={{ color: 'white' }} id="home">
                        <i className="bi bi-house" style={{ paddingLeft: '1rem' }}></i>
                    </button>
                    <button className="navbar-toggler" style={{ backgroundColor: '#d2e2d8' }} data-bs-toggle="collapse"
                        data-bs-target="#navbar-options">
                        <i className="navbar-toggler-icon"></i>
                    </button>
                    <div className="collapse navbar-collapse" id="navbar-options">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <button className="nav-link" style={{ color: 'white' }}>
                                    <i className="bi bi-search"></i>
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link" id="user-profile-button" style={{ color: 'white' }}>
                                    <i className="bi bi-person-fill"></i>
                                </button>
                            </li>
                            <li className="nav-item">
                                <div id="auth-status-button">
                                    {auth_button}
                                </div>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
                    aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-scrollable">
                        {modal_content}
                    </div>
                </div>
            </div >
        );
    }
}

export default NavBar;

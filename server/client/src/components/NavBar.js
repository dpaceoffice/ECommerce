import '../styles/NavBar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useAsync } from "react-async"

const loadData = async () => {
    const response = await fetch(`http://localhost:3000/store-data`);
    const data = await response.json();
    return data;
}

function NavBar() {
    const data = useAsync({ promiseFn: loadData });
    const authenticated = (data.user !== undefined);
    let auth_button = <button type="button" className="btn" style={{ color: 'white' }} id="login-show" data-bs-toggle="modal"
        data-bs-target="#staticBackdrop">
        <i id='login-modal' className="bi bi-cart"> </i>{authenticated ? 'Checkout' : 'Login'}
    </button>;
    return (
        <div className="NavBar">
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
        </div>
    );
}

export default NavBar;

import React, { Component } from 'react';
import NavBar from './components/NavBar';
import StorePage from './pages/StorePage';
import ProfilePage from './pages/ProfilePage';
import SuccessPage from './pages/SuccessPage';
import AdminPage from './pages/AdminPage';

const STORE = 0;
const PROFILE = 1;
const SUCCESS = 2;
const ADMIN = 3;

class App extends Component {
    constructor() {
        super();
        this.state = { data: null, modal: null, view: 0, paypalOrder: null, breakdown: null };
        this.setModalInputRef = element => { this.setState({ modal: element }) };
    }
    componentDidMount = async () => {
        const response = await fetch(`/store-data`);
        const json = await response.json();
        this.setState({ data: json });
    }

    showStore = async () => {
        this.componentDidMount();
        return this.setState({ view: STORE });
    }

    showProfile = () => {
        return this.setState({ view: PROFILE });
    }

    showSuccess = async (paypalOrder, breakdown) => {
        this.state.modal.click();
        return this.setState({ view: SUCCESS, paypal_order: paypalOrder, breakdown: breakdown });
    }

    showAdmin = () => {
        return this.setState({ view: ADMIN });
    }

    render() {
        if (this.state.data === null)
            return (<p>Loading...</p>);
        let view = []
        view.push(<NavBar setModal={this.setModalInputRef} showStore={this.showStore} showSuccess={this.showSuccess} showProfile={this.showProfile} updateStatus={this.componentDidMount} data={this.state.data} />);
        if (this.state.view === STORE)
            view.push(
                <StorePage modal={this.state.modal} reload={this.componentDidMount} data={this.state.data} />
            );
        else if (this.state.view === PROFILE)
            view.push(
                <ProfilePage showAdmin={this.showAdmin} showStore={this.showStore} reload={this.componentDidMount} data={this.state.data} />);
        else if (this.state.view === SUCCESS)
            view.push(
                <SuccessPage data={this.state.data} paypal_order={this.state.paypal_order} breakdown={this.state.breakdown} />);
        else if (this.state.view === ADMIN)
            view.push(
                <AdminPage data={this.state.data} reload={this.componentDidMount} />);
        return <>{view}</>;
    }
}
export default App;
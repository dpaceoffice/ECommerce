import React, { Component } from 'react';
import NavBar from './components/NavBar';
import StorePage from './pages/StorePage';

class App extends Component {
    constructor() {
        super();
        this.state = { data: null, modal: null };
        this.setModalInputRef = element => { this.setState({ modal: element }) };
    }
    componentDidMount = async () => {
        const response = await fetch(`http://localhost:5000/store-data`);
        const json = await response.json();
        this.setState({ data: json });
    }

    render() {
        if (this.state.data === null)
            return (<p>Loading...</p>);
        return (<div>
            <NavBar setModal={this.setModalInputRef} updateStatus={this.componentDidMount} data={this.state.data} />
            <StorePage modal={this.state.modal} reload={this.componentDidMount} data={this.state.data} />
        </div>);
    }
}
export default App;
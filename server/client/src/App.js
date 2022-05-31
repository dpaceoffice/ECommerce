import React, { Component } from 'react';
import NavBar from './components/NavBar';

class App extends Component {
    constructor() {
        super();
        this.state = { data: {} };
    }
    async componentDidMount() {
        const response = await fetch(`http://localhost:5000/store-data`);
        const json = await response.json();
        this.setState({ data: json });
    }
    render() {
        return (<NavBar data={this.state.data} />);
    }
}
export default App;
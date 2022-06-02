import React, { Component } from 'react';
export default class Product extends Component {
    constructor() {
        super();
        this.state = {};
    }

    addToCart = async (id) => {
        const config = new Object();
        config.method = "POST";
        config.headers = { 'Content-Type': 'application/json' };
        config.body = JSON.stringify({ id });
        const response = await fetch(`http://localhost:5000/add-product/`, config);
        if (response.status === 203)
            this.props.modal.click();
        else
            this.props.reload();
    }

    render() {
        return (<div key={this.props.id} className="col">
            <div className="card mb-3" style={{ filter: 'drop-shadow(7px 7px 0px #597658)', width: '18rem', borderWidth: 'thick', borderStyle: 'solid', borderColor: '#709a71', background: '#709a71' }}>
                <img className="card-img-top" src={this.props.img} alt={this.props.title} />
                <div className="card-body">
                    <h5 className="ms-0 card-title">
                        {this.props.title}</h5>
                    <p className="card-text">
                        {this.props.desc}</p>
                    <p className="card-text">{this.props.price}</p>
                    <a className="btn" onClick={async () => { await this.addToCart(this.props.id) }} style={{ backgroundColor: '#577a58', color: "white" }} id="addtocart" product_number={this.props.id}>Add to Cart</a>
                </div>
            </div>
        </div>);
    }
}
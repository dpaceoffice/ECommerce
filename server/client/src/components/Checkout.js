import React, { Component } from 'react';
import PayPalCheckout from './PaypalCheckout';


export default class Checkout extends Component {

    constructor() {
        super();
        this.state = {};
    }
    removeProduct = async (id) => {
        const config = new Object();
        config.method = "POST";
        config.headers = { 'Content-Type': 'application/json' };
        config.body = JSON.stringify({ id });
        const response = await fetch(`/remove-product/`, config);
        const data = await response.json();
        if (data.count !== undefined)
            this.props.reload();
        else
            alert("Failure with server.");
    }
    render() {
        if (this.props.data.details === undefined)
            return null;
        const products = this.props.data.details.allProducts;
        const totalCost = this.props.data.details.totalCost;
        let body = <p>The shopping cart is currently empty</p>;
        if (products.length > 0) {
            body = [];
            for (let product of products) {
                body.push(<p>{product.title} - {product.price} x {product.quantity} <button type="button" onClick={async () => await this.removeProduct(product.id)} className="btn btn-sm btn-danger" id="rmfromcart" product_number={product.id}>Remove</button></p>);
            }
        }
        var total = `Total Cost: ${totalCost}`;
        return (<div className="modal-content" id="modal-content">
            <div className="modal-header" style={{ backgroundColor: '#d2e2d8' }}>
                <h5 className="modal-title" id="staticBackdropLabel">Shopping Cart</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div id="cart-body" className="modal-body flex">
                {body}
            </div>
            <div class="modal-footer">
                <p id="cost-label" className="bi-text-left me-5">{total}
                </p>
                <div id="paypal-button-container"><PayPalCheckout showSuccess={this.props.showSuccess} reload={this.props.reload} /></div>
            </div>
        </div>);
    }
}
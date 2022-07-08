import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default class PayPalCheckout extends React.Component {
    constructor() {
        super();
    }
    async createOrder(data, actions) {
        return await fetch("/api/orders", {
            method: "post",
            // use the "body" param to optionally pass additional order information
            // like product ids or amount
        })
            .then((response) => response.json())
            .then((order) => order.id);
    }

    async onApprove(data, actions) {
        return await fetch(`/api/orders/${data.orderID}/capture`, {
            method: "post",
        })
            .then((response) => response.json())
            .then((data) => {
                // Successful capture! For dev/demo purposes:
                this.props.showSuccess(data.captureData, data.breakdown);
                /*alert(
                "Transaction " +
                transaction.status +
                ": " +
                transaction.id +
                "\n\nSee console for all available details"
            );
            // When ready to go live, remove the alert and show a success message within this page. For example:
            // var element = document.getElementById('paypal-button-container');
            // element.innerHTML = '<h3>Thank you for your payment!</h3>';
            // Or go to another URL:  actions.redirect('thank_you.html');*/
            });
    }


    render() {
        if (window.paypal === undefined)
            return 'Unavaliable';
        const view = <PayPalScriptProvider options={{ "client-id": "AaRWL--7t5wev93pXfPXnpfWIEMNOdE2Wd25qY9dqyy1kv55VePvnAnF6khosP8_gN7CkG7ZxJqn3sSL" }}>
            <PayPalButtons
                fundingSource={window.paypal.FUNDING.PAYPAL}
                createOrder={async (data, actions) => { return await this.createOrder(data, actions); }}
                onApprove={async (data, actions) => await this.onApprove(data, actions)} />
        </PayPalScriptProvider>;
        return (view);
    }
}
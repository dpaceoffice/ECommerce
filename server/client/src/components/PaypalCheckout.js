import React from 'react';
import ReactDOM from 'react-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";


export default class PayPalCheckout extends React.Component {

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
            .then((orderData) => {
                // Successful capture! For dev/demo purposes:
                console.log(
                    "Capture result",
                    orderData,
                    JSON.stringify(orderData, null, 2)
                );
                var transaction =
                    orderData.purchase_units[0].payments.captures[0];
                alert(
                    "Transaction " +
                    transaction.status +
                    ": " +
                    transaction.id +
                    "\n\nSee console for all available details"
                );
                // When ready to go live, remove the alert and show a success message within this page. For example:
                // var element = document.getElementById('paypal-button-container');
                // element.innerHTML = '<h3>Thank you for your payment!</h3>';
                // Or go to another URL:  actions.redirect('thank_you.html');
            });
    }


    render() {
        const client = {
            sandbox: 'AaRWL--7t5wev93pXfPXnpfWIEMNOdE2Wd25qY9dqyy1kv55VePvnAnF6khosP8_gN7CkG7ZxJqn3sSL',
            production: 'AaRWL--7t5wev93pXfPXnpfWIEMNOdE2Wd25qY9dqyy1kv55VePvnAnF6khosP8_gN7CkG7ZxJqn3sSL'
        };
        return (<PayPalScriptProvider options={{ "client-id": "AaRWL--7t5wev93pXfPXnpfWIEMNOdE2Wd25qY9dqyy1kv55VePvnAnF6khosP8_gN7CkG7ZxJqn3sSL" }}>
            <PayPalButtons
                fundingSource={window.paypal.FUNDING.PAYPAL}
                createOrder={async (data, actions) => { return await this.createOrder(data, actions); }}
                onApprove={async (data, actions) => await this.onApprove(data, actions)} />
        </PayPalScriptProvider>

        );
    }
}
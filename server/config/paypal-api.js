import fetch from "node-fetch";
import dotenv from "dotenv";
import Store from "../models/Store.js";
if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}

const { CLIENT_ID, APP_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";
export async function createOrder(request) {
    const authenticated = (request.user != undefined);
    if (authenticated) {
        const customer = await Store.getCustomer(request.user._id);
        const cart = await customer.getActiveCart();
        const breakdown = await cart.getBreakdown();
        const cost = breakdown.totalCost.replace('$', '');
        const accessToken = await generateAccessToken();
        const url = `${base}/v2/checkout/orders`;
        const response = await fetch(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            value: cost,
                        },
                    },
                ],
            }),
        });
        const data = await response.json();
        return data;
    }
}

export async function capturePayment(orderId) {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;
    const response = await fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    return data;
}

export async function generateAccessToken() {
    const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
        method: "post",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });
    const data = await response.json();
    return data.access_token;
}
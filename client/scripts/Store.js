
window.onload = init();
post = function (url, data) {
    return fetch(url, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
}

function init() {
    getStore();
    getCheckout();
}
async function getStore() {
    const response = await fetch(`http://localhost:3000/store-data`);
    const data = await response.json();
    displayStore(data.cstate, data.pstate)
}

async function sendActiveCat(attributes) {
    const id = attributes.cat_id.nodeValue;
    const response = await post('http://localhost:3000/setCategory', { id });
    const data = await response.json();
    if (data.success)
        getStore();
}

async function addProductToCart(attributes) {
    const id = attributes.product_number.nodeValue;
    const response = await post(`http://localhost:3000/add-product/`, { id });
    const data = await response.json();
    if (data.success)
        getCheckout();
}
async function removeProductFromCart(attributes) {
    const id = attributes.product_number.nodeValue;
    const response = await post(`http://localhost:3000/remove-product/`, { id });
    const data = await response.json();
    if (data.success)
        getCheckout();
}

async function getCheckout() {
    const response = await fetch(`http://localhost:3000/checkout-data`);
    const { body, total, cart } = await response.json();
    console.log(body, total, cart)
    displayCheckout(body, total, cart);
}
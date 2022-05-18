
window.onload = init();
post = async function (url, data) {
    return await fetch(url, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
}

function init() {
    getStore();
    //getCheckout();
}
async function getStore(cat = undefined) {
    const response = await fetch(`http://localhost:3000/store-data`);
    const data = await response.json();
    const authenticated = (data.user != undefined);
    console.log(data);
    displayStore(data.cstate, data.pstate, cat)
    displayOptions(authenticated);
}

async function handleLogin() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    const info = { email: email, password: password };
    console.log(info);
    const response = await post(`http://localhost:3000/login/`, info);
    const data = await response.json();
    console.log(data);
}

async function sendActiveCat(attributes) {
    const id = attributes.cat_id.nodeValue;
    //const response = await post('http://localhost:3000/setCategory', { id });
    //const data = await response.json();
    await getStore(cat = id);
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

async function handleRegister() {
    try {
        const config = new Object();
        config.method = "POST";
        config.headers = { 'Content-Type': 'application/json' };
        config.body = JSON.stringify({ 'name': registerName.value, 'email': registerEmail.value, 'password': registerPassword.value });
        const response = await fetch("http://localhost:3000/register", config);
        const data = await response.json();

        if (data.error) {
            displayRegisterAttempt(data.errorMsg);
        }
    } catch (error) {
        console.log(error);
    }

}
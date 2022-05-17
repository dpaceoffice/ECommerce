window.onload = init();
post = async function (url, data) {
    return await fetch(url, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
}
async function init() {
    await getStore(undefined, true);
}
var paypalToggle = false;
const userRefresh = (data) => {
    setCheckout(data.count);
    setCartDisplay(data.details.allProducts, data.details.totalCost);
}
async function getStore(cat = undefined, init = false) {
    const response = await fetch(`http://localhost:3000/store-data`);
    const data = await response.json();
    const authenticated = (data.user != undefined);
    displayStore(data.cstate, data.pstate, cat);
    if (authenticated) {
        if (init)
            renderCart();
        userRefresh(data);
    } else
        displayOptions();
}

async function handleLogin() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    const info = { email: email, password: password };
    //console.log(info);
    const response = await post(`http://localhost:3000/login/`, info);
    const data = await response.json();
    displayLoginAttempt(data.message);
    getStore();
}

async function sendActiveCat(attributes) {
    const id = attributes.cat_id.nodeValue;
    await getStore(cat = id);
}

async function addProductToCart(attributes) {
    const id = attributes.product_number.nodeValue;
    const response = await post(`http://localhost:3000/add-product/`, { id });
    const data = await response.json();
    if (data.count != undefined) {
        userRefresh(data);
    } else
        alert("Please sign in to add products to a cart.");

}
async function removeProductFromCart(attributes) {
    const id = attributes.product_number.nodeValue;
    const response = await post(`http://localhost:3000/remove-product/`, { id });
    const data = await response.json();
    if (data.count != undefined) {
        userRefresh(data);
    } else
        alert("An error occured, please try logging out and back in.");
}
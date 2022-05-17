window.onload = init();
post = async function (url, data) {
    return await fetch(url, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
}
async function init() {
    await getStore();
}
var paypalToggle = false;
async function getStore(cat = undefined) {
    const response = await fetch(`http://localhost:3000/store-data`);
    const data = await response.json();
    const authenticated = (data.user != undefined);
    displayStore(data.cstate, data.pstate, cat);
    displayOptions(authenticated);
    if (authenticated) {
        setCheckoutSize(data.count);
        setCartDisplay(data.details.allProducts, data.details.totalCost);
        if (!paypalToggle) {
            createPaypalButton();
            paypalToggle = true;
        }
    }
}

async function handleLogin() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    const info = { email: email, password: password };
    //console.log(info);
    const response = await post(`http://localhost:3000/login/`, info);
    const data = await response.json();
    displayLoginAttempt(data.message);
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
        setCheckoutSize(data.count);
        setCartDisplay(data.details.allProducts, data.details.totalCost);
    } else
        alert("Please sign in to add products to a cart.");

}
async function removeProductFromCart(attributes) {
    const id = attributes.product_number.nodeValue;
    const response = await post(`http://localhost:3000/remove-product/`, { id });
    const data = await response.json();
    if (data.count != undefined) {
        setCheckoutSize(data.count);
        setCartDisplay(data.details.allProducts, data.details.totalCost);
    } else
        alert("An error occured, please try logging out and back in.");
}
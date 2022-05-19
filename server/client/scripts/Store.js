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
var storeRendering = false;
async function getStore(cat = undefined, init = false) {
    if (!storeRendering) {
        storeRendering = true;
        const response = await fetch(`http://localhost:3000/store-data`);
        const data = await response.json();
        const authenticated = (data.user != undefined);
        displayStore(data.cstate, data.pstate, cat);
        if (authenticated) {
            if (init)
                renderCart();
            userRefresh(data);
        } else
            if (cat == undefined)
                displayOptions();
        storeRendering = false;
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
        userRefresh(data);
    } else
        forceOpenLogin();
    //alert("Please sign in to add products to a cart.");

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
var buttons;
var hasRendered = false;
PaypalButton = () => paypal.Buttons({
    fundingSource: paypal.FUNDING.PAYPAL,
    // Sets up the transaction when a payment button is clicked
    createOrder: function (data, actions) {
        return fetch("/api/orders", {
            method: "post",
            // use the "body" param to optionally pass additional order information
            // like product ids or amount
        })
            .then((response) => response.json())
            .then((order) => order.id);
    },
    // Finalize the transaction after payer approval
    onApprove: function (data, actions) {
        return fetch(`/api/orders/${data.orderID}/capture`, {
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
                paypalToggle = false;
                // When ready to go live, remove the alert and show a success message within this page. For example:
                // var element = document.getElementById('paypal-button-container');
                // element.innerHTML = '<h3>Thank you for your payment!</h3>';
                // Or go to another URL:  actions.redirect('thank_you.html');
            })
    }
});

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
        } else {
            showLogin();
        }
    } catch (error) {
        console.log(error);
    }

}

const displayStore = (categories, products, cat) => {
    document.getElementById("categories-container").innerHTML = "";
    document.getElementById("products-container").innerHTML = "";
    let active = undefined;
    for (const category in categories) {
        let data = categories[category];
        var id = data['_id'];
        var type = data['type'];
        if (cat == undefined)
            cat = id;
        if (id == cat)
            active = data['products']
        document.getElementById("categories-container").innerHTML +=
            `<li id="cat_id" cat_id=` + id + ` class="btn list-group-item">` +
            type +
            `</li>`;
    }
    addController('cat_id');

    for (const product in products) {
        let data = products[product];
        var id = data['_id'];
        if (!active.includes(id))
            continue;
        var title = data['title'];
        var desc = data['des'];
        var price = Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(data['price']);
        var img = data['image'];
        document.getElementById("products-container").innerHTML +=
            `<div class="col"><div class="card mb-3" style="filter: drop-shadow(7px 7px 0px #597658); width: 18rem; border-width: thick; border-style: solid; border-color: #709a71;">
        <img class="card-img-top" src="` +
            img +
            `" alt="` +
            title +
            `">
            <div class="card-body">
                <h5 class="card-title" style= "color:white";>` +
            title +
            `</h5>
                <p class="card-text">` +
            desc +
            `</p>
                <p class="card-text">` +
            price +
            `</p>
                <a class="btn" style="background-color:#709a71; color: white" id="addtocart" product_number=${id}>Add to Cart</a>
            </div>
    </div></div>`;
    }
    addController('addtocart');
}

const displayOptions = () => {
    const widget = document.getElementById('auth-status-button');
    const content = document.getElementById('modal-content');
    widget.innerHTML = `<button type="button" class="btn" style="color: white;" id="login-show" data-bs-toggle="modal"
    data-bs-target="#staticBackdrop">
    <i id='login-modal' class="bi bi-cart"> </i>Login
    </button>`;
    content.innerHTML = `<div class="modal-header" style="background-color: #d2e2d8;">
    <h5 class="modal-title" id="staticBackdropLabel">Login</h5>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body flex">
        <p class='text-danger' id='email-error'><p>
        <div>
            <label for='email'>Email:</label>
            <input type='email' id='email' name='email' required>
        </div>
        <br>
        <p class='text-danger' id='password-error'><p>
        <div>
            <label for='password'>Password:</label>
            <input type='password' id='password' name='password' required>
        </div>
    </div>
    <div class="modal-footer">
        <p class="bi-text-left me-5">Don't have an account? Click here.<p>
            <!--<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>-->
            <button id="login-button" type="button" class="btn" style="background-color: #709a71;">Login</button>
    </div>`;
    addController("login-button");
}

const displayLoginAttempt = (message) => {
    email_field = document.getElementById('email');
    email_err = document.getElementById('email-error');
    password_field = document.getElementById('password');
    password_err = document.getElementById('password-error');
    password_err.innerHTML = ``;
    password_field.value = ``;
    email_err.innerHTML = ``;
    email_field.value = ``;
    if (message.includes('email')) {
        email_err.innerHTML = `That account doesn't exist!`;
    } else if (message.includes('password')) {
        password_err.innerHTML = `The password entered is incorrect!`;
    } else {
        document.getElementsByClassName('btn-close')[0].click();
        renderCart();
    }
}

const renderCart = () => {
    const widget = document.getElementById('auth-status-button');
    const content = document.getElementById('modal-content');

    widget.innerHTML = `<button type="button" class="btn" style="color: white;" id="checkout" data-bs-toggle="modal"
        data-bs-target="#staticBackdrop">
        <i class="bi bi-cart"> </i>Checkout
        </button>`;
    content.innerHTML = `<div class="modal-header" style="background-color: #d2e2d8;">
        <h5 class="modal-title" id="staticBackdropLabel">Shopping Cart</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="cart-body" class="modal-body flex">
            <p>The shopping cart is currently empty</p>
        </div>
        <div class="modal-footer">
            <p id="cost-label" class="bi-text-left me-5">Total Cost: $0.00
            <p>
                <!--<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>-->
                <div id="paypal-button-container"></div>
        </div>`
    addController("checkout");
}

const setCheckout = (count) => {
    if (count > 0)
        document.getElementById("checkout").innerHTML = `<i id='checkout-button' class="bi bi-cart"> </i>Checkout - ${count}`;
    else
        document.getElementById("checkout").innerHTML = `<i id='checkout-button' class="bi bi-cart"> </i>Checkout`;

}

const setCartDisplay = (products, totalCost) => {
    let body = `<p>The shopping cart is currently empty</p>`;
    if (products.length > 0) {
        body = ``;
        for (product of products) {
            body += `<p>${product.title} - ${product.price} x ${product.quantity} <button type="button" class="btn btn-sm btn-danger" id="rmfromcart" product_number=${product.id}>Remove</button></p>`;
        }
    }
    var total = `Total Cost: ${totalCost}`;
    document.getElementById("cart-body").innerHTML = body;
    document.getElementById("cost-label").innerHTML = total;
    addController('rmfromcart');
}
async function createPaypalButton() {
    //document.getElementById('paypal-button-container').innerHTML = ``;
    if (buttons && buttons.close && hasRendered) {
        buttons.close();
        hasRendered = false;
    }
    buttons = PaypalButton();
    await buttons.render('#paypal-button-container')
        .then(() => {
            hasRendered = true;
        })
        .catch((err) => {
            let selector = document.querySelector('#paypal-button-container');
            // button failed to render, possibly because it was closed or destroyed.
            if (selector && selector.children.length > 0) {
                // still mounted so throw an error
                console.log("Paypal failed to render properly");
                //throw new Error(err);
            }
            // not mounted anymore, we can safely ignore the error
            return;
        });
}


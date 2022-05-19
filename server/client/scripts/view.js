const displayStore = (categories, products, cat) => {
    document.getElementById("store-front-meta").innerHTML = `<div class="row mt-5 text-center">
    <div class="col">
        <div class="card mb-2" style="max-width: 18rem; margin-left: 60px;">
            <ul class="list-group list-group-flush">
                <div id="categories-container">
                </div>
            </ul>
        </div>
    </div>
    <div class="col">
        <div id="products-container" class="row ms-5">
        </div>
    </div>
</div>`;
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

    for (const index in active) {
        let product = active[index];
        let data = products[product];
        var id = data['_id'];
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
                <h5 class="ms-0 card-title text-dark">` +
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
    addController('user-profile-button');
    addController('home');
}
const displayAdmin = (attributes) => {
    document.getElementById("store-front-meta").innerHTML = ``;
    document.getElementById("view").innerHTML = `<div id="addProduct"></div>
    <div class="grid container-fluid" id="muuri"></div>
    <div id="editProduct"></div>`;
}
const homeButton = async (attributes) => {
    document.getElementById("categoryPage").innerHTML = "";
    document.getElementById("view").innerHTML = "";
    await getStore();
}
const displayOptions = () => {
    const widget = document.getElementById('auth-status-button');
    widget.innerHTML = `<button type="button" class="btn" style="color: white;" id="login-show" data-bs-toggle="modal"
    data-bs-target="#staticBackdrop">
    <i id='login-modal' class="bi bi-cart"> </i>Login
    </button>`;
    showLogin();
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
    if (message.includes('email'))
        email_err.innerHTML = `That account doesn't exist!`;
    else if (message.includes('password'))
        password_err.innerHTML = `The password entered is incorrect!`;
    else if (message.includes('Missing')) {
        email_err.innerHTML = `That account doesn't exist!`;
        password_err.innerHTML = `The password entered is incorrect!`;
    } else if (message.includes('authenticated')) {
        document.getElementById('login-modal-close').click();
        getStore(undefined, true);
        //renderCart();
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
        </div>`;
    addController("checkout");
}

function showLogin() {
    const content = document.getElementById('modal-content');
    content.innerHTML = `<div class="modal-header" style="background-color: #d2e2d8;">
        <h5 class="modal-title" id="staticBackdropLabel">Login</h5>
        <button type="button" id="login-modal-close" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body flex">
        <p id="email-error" class="text-danger"></p>    
        <div>
            <label for='email'>Email:</label>
            <input type='email' id='email' name='email' required>
        </div>
        <br>
        <p id="password-error" class="text-danger"></p>
        <div>
            <label for='password'>Password:</label>
            <input type='password' id='password' name='password' required>
        </div>
        </div>
        <div class="modal-footer">
            <p class="bi-text-left me-5">Don't have an account? <a id="show-register" href="#">Register here.</a></p>
            <!--<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>-->
            <button id="login-button" type="button" class="btn" style="background-color: #709a71;">Login</button>
        </div>`;
    addController("login-button");
    addController("show-register");
}

function forceOpenLogin() {
    const modal = document.getElementById('login-show');
    modal.click();
}

function showRegister() {
    const content = document.getElementById('modal-content');
    content.innerHTML = `<div class="modal-header" style="background-color: #d2e2d8;">
    <h5 class="modal-title" id="staticBackdropLabel">Register</h5>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body flex">
        <small id="error-msg" class="text-danger"></small>
        <div> 
            <label for='name'>Username: </label>
            <input type='text' id='registerName' placeholder='Username'>
        </div>
        <br>
        <div>
            <label for='email'>Email: </label>
            <input type='email' id='registerEmail' placeholder='Email'>
        </div>
        <br>
        <div>
            <label for='password'>Password: </label>
            <input type='password' id='registerPassword' placeholder='Password'>
        </div>
    </div>
    <div class="modal-footer">
        <p class="bi-text-left me-5">Already have an account? <a id="show-login" href="#">Login here.</a></p>
        <!--<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>-->
        <button id="register-button" type="button" class="btn" style="background-color: #709a71;">Register</button>
    </div>`;
    addController("register-button");
    addController("show-login");
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
async function createPaypalButton(attributes) {
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



// Load Categories/ Create Categories
const categories = () => {
    const renderCategoryDOM = (html) => document.getElementById("categoryPage").innerHTML = html;
    renderCategoryDOM(
        `<div id="divider"></div>`
        +
        `<button id="categoryBut" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleCateModal"> CATEGORIES </button>`
        +
        `<div><button id="deleteCategoryBut" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#deleteCateModal"> Delete Category </button></div>`
        +
        `<div id = "nameOfCat"></div>`
        +
        `<div class="modal fade" id="exampleCateModal" category_number = "-100" tabindex="-1" aria-labelledby="exampleCateModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleCateModalLabel">Category</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="chooseOption" class="col-form-label">Choose Category Options:</label>
                    <select id="mySelect" class="form-select">
                    </select>
                </div>
                <div class="mb-3">
                    <label for="createCat-title" class="col-form-label">Name of New Category:</label>
                    <input type="text" class="form-control" id="createCategory">
                </div>
            </div>
            <div class="modal-footer">
              <button id="categoryDecisionBut" type="button" class="btn btn-secondary" data-bs-dismiss="modal"> Save Decision </button>
            </div>
          </div>
        </div>
      </div>`
        +
        `<div class="modal fade" id="deleteCateModal" category_number = "-100" tabindex="-1" aria-labelledby="deleteCateModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteCateModalLabel">Category</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
              <div class="mb-3">
                  <label for="chooseOption" class="col-form-label">Delete Category</label>
                  <select id="myDeleteSelect" class="form-select">
                  </select>
              </div>
          </div>
          <div class="modal-footer">
            <button id="confirmDeleteCate" type="button" class="btn btn-secondary" data-bs-dismiss="modal"> Delete </button>
          </div>
        </div>
      </div>
    </div>`
    )

    adminAddController("categoryBut");
    adminAddController("categoryDecisionBut");
    adminAddController("deleteCategoryBut");
    adminAddController("confirmDeleteCate");

}

/* Reloads the page after a product is added, removed, edited, or the order of the products have changed - NECCESSARY*/
const renderViewDOM = (html) => document.getElementById("view").innerHTML = html;
const reloadAdminPage = function () {
    grid.refreshItems();
    renderViewDOM(`
        <div id="addProduct"></div>
        <div id="editProduct"></div>
        <div class="grid container-fluid" id="muuri"></div>
    `)
    grid.refreshItems();
}

/* Loads Admin Page */
const viewAdminPage = (data, catId, catType) => {
    document.getElementById("view").setAttribute("cat", catId);
    document.getElementById("view").setAttribute("type", catType);
    const renderMuuri = (html) => document.getElementById("muuri").innerHTML += html;
    const renderAddDOM = (html) => document.getElementById("addProduct").innerHTML = html;
    const renderEditDOM = (html) => document.getElementById("editProduct").innerHTML = html;
    const renderViewDOM = (html) => document.getElementById("view").innerHTML = html;

    initGrid(data);

    if (document.getElementById("view").getAttribute("cat") != "-100") {
        console.log("CHANGE TITLE!");
        document.getElementById("nameOfCat").innerHTML = catType;
    }

    renderEditDOM(
        `
        <!-- Edit Product Modal -->
        <div class="modal fade" id="editProductModal" tabindex="-1" aria-labelledby="editProductModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="editModal-title" id="editProductModalLabel">Edit Product</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="mb-3">
                                <label for="editProduct-title" class="col-form-label">Title:</label>
                                <input type="text" class="form-control" id="editProduct-title">
                            </div>
                            <div class="mb-3">
                                <label for="editProduct-description" class="col-form-label">Description:</label>
                                <textarea class="form-control" id="editProduct-description"></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="editProduct-price" class="col-form-label">Price:</label>
                                <input type="text" class="form-control" id="editProduct-price">
                            </div>
                            <div class="mb-3">
                                <label for="editProduct-image" class="form-label">Change Image</label>
                                <input id="editProduct-image" class="form-control" type="file" accept=".jpg,.gif,.png">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                    <button id="editProductBut" product_number = "null" type="button" class="btn btn-primary" data-bs-dismiss="modal">Save Edit</button>
                    </div>
                </div>
            </div>
        </div>
        `
    )

    renderAddDOM(
        `      
        <div class = "adminButtons">  
        <button id="addProdBut" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"
        data-bs-whatever="@getbootstrap">Add Product</button>

        <button id="saveOrder" class="btn btn-primary" layout = "`+ window.localStorage.getItem('prodIdlayout') + `">Save Order of Products</button>
        </div>

        <!-- New Product Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Add Product</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="mb-3">
                                <label for="product-title" class="col-form-label">Title:</label>
                                <input type="text" class="form-control" id="product-title">
                            </div>
                            <div class="mb-3">
                                <label for="product-description" class="col-form-label">Description:</label>
                                <textarea class="form-control" id="product-description"></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="product-price" class="col-form-label">Price:</label>
                                <input type="text" class="form-control" id="product-price">
                            </div>
                            <div class="mb-3">
                                <label for="product-image" class="form-label">Upload Image</label>
                                <input id="product-image" class="form-control" type="file" accept=".jpg,.gif,.png">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                    <button id="submitProduct" type="button" class="btn btn-primary" data-bs-dismiss="modal">Save</button>
                    </div>
                </div>
            </div>
        </div>
        `
    )
    adminAddController("submitProduct");
    adminAddController("wantToEditBut");
    adminAddController("removeProdBut");
    adminAddController("saveOrder");
    adminAddController("editProductBut");
}

const displayRegisterAttempt = (msg) => {
    error_msg = document.getElementById('error-msg')
    error_msg.innerHTML = '';

    if (msg.includes('all')) {
        error_msg.innerHTML = msg;
    } else if (msg.includes('name')) {
        error_msg.innerHTML = msg;
    } else if (msg.includes('email')) {
        error_msg.innerHTML = msg;
    } else if (msg.includes('password')) {
        error_msg.innerHTML = msg;
    } else if (msg.includes('exists')) {
        error_msg.innerHTML = msg;
    } else {
        document.getElementsByClassName('btn-close')[0].click();
        init();
    }
}

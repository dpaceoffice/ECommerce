/*
// ADMINISTRATION CODE BELOW - from view
const renderMuuri = (html) => document.getElementById("muuri").innerHTML += html;
const renderAddDOM = (html) => document.getElementById("addProduct").innerHTML = html;
const renderEditDOM = (html) => document.getElementById("editProduct").innerHTML = html;
const renderViewDOM = (html) => document.getElementById("view").innerHTML = html;

// Reloads the page after a product is added, removed, edited, or the order of the products have changed
const reloadAdminPage = async function () {
    await renderViewDOM(``);
    await renderViewDOM(`
        <div id="addProduct"></div>
        <div id="editProduct"></div>
        <div class="grid container-fluid" id="muuri"></div>
    `)
    await loadAdminPage();
}*/

/*
const adminPage = function (data) {
    console.log("ADMIN PAGE UPLOADED");

    // Creates grid from a method in scriptMuuri.js
    initGrid(data);

    // Render components that deal with adding new products
    renderAddDOM(
        `      
        <div class = "adminButtons">  
        <button id="addProdBut" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"
        data-bs-whatever="@getbootstrap">Add Product</button>

        <button id="categoryBut" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"
        data-bs-whatever="@getbootstrap">Add Product</button>

        <button id="saveOrder" class="btn btn-primary">Save Order of Products</button>
        </div>

        <!-- New Product Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel"></h5>
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

    // Render components that deal with editing product 
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
                    <button id="editProductBut" type="button" class="btn btn-primary" data-bs-dismiss="modal">Save Edit</button>
                    </div>
                </div>
            </div>
        </div>
        `

    )
    // NOTE: the adding product and editing product components need to be uploaded before we can add event listeners 
}*/

/*
const listeners = () => {
    
    // Modal for adding new product 
    var exampleModal = document.getElementById('exampleModal');
    exampleModal.addEventListener('show.bs.modal', function (event) {
        // clear modal form
        document.getElementById("product-title").value = "";
        document.getElementById("product-description").value = "";
        document.getElementById("product-price").value = "";
        document.getElementById("product-image").value = "";

        // Button that triggered the modal
        var button = event.relatedTarget
        // Extract info from data-bs-* attributes
        var recipient = button.getAttribute('data-bs-whatever')
        // If necessary, you could initiate an AJAX request here and then do the updating in a callback.
        // Update the modal's content.
        var modalTitle = exampleModal.querySelector('.modal-title')
        //modalTitle.textContent = 'New message to ' + recipient
        modalTitle.textContent = "Add Product";

        // Send product information to server 
        const submitButton = document.getElementById('submitProduct');
        submitButton.addEventListener('click', submitEvent);
    })

    // Modal for editing product 
    var editProductModal = document.getElementById('editProductModal');
    editProductModal.addEventListener('show.bs.modal', function (event) {
        // Button that triggered the modal
        var button = event.relatedTarget
        // Extract info from data-bs-* attributes
        var recipient = button.getAttribute('data-bs-whatever')
        // If necessary, you could initiate an AJAX request here and then do the updating in a callback.
        // Update the modal's content.
        var modalTitle = exampleModal.querySelector('.editModal-title')
        //modalTitle.textContent = 'New message to ' + recipient
        //modalTitle.textContent = "Edit Product";

        // Sends the changes in the product to the server 
        const submitButton = document.getElementById('editProductBut');
        submitButton.addEventListener('click', () => {
            let prodID = button.getAttribute('product_number');
            editEvent(prodID)
        });
    })

    // Sends the new order of the product to the server by the products' ids
    //   If there are no changes and the button is pressed then an empty array/object is sent
    
    document.getElementById("saveOrder").addEventListener("click", function () {
        let data = window.localStorage.getItem('prodIdlayout');
        postLayout(data);
    });

    // NEEDED for Muuri 
    [...document.querySelectorAll('.removeProdBut')].forEach(function (item) {
        item.addEventListener('click', function () {
            console.log("REMOVE PRODUCT!");
        });
    });
    
    // When edit is clicked, need the product information so post product id to server
    [...document.querySelectorAll('.editProduct')].forEach(function (item) {
        item.addEventListener('click', async function () {
            let prodID = item.getAttribute('product_number')
            console.log(prodID + " - EDIT PRODUCT! from edit button");
            let product = await getProductById(prodID)
            console.log("Product info from server for editting " + product.id);
    
            // NEED TO GET PRODUCT'S INFORMATION - mongodb
            document.getElementById("editProduct-title").value = product.title;
            document.getElementById("editProduct-description").value = product.description;
            document.getElementById("editProduct-price").value = product.price;
        });
    });
    
    // Remove product by getting id and sending it to the server 
    document.querySelector('.grid').addEventListener('click', function (e) {
        if (elementMatches(e.target, '.card-remove, .card-remove i')) {
            postRemove(e);
            console.log("sent remove post");
        }
    });
}*/

/*window.onload = (event) => {
    loadAdminPage();
    //startPage();
    //document.getElementById("start").addEventListener("click", function () { loadAdminPage()});
};*/

/*^^^^ ADMINISTRATION CODE ^^^^*/

/*ADMIN FROM VIEW - from view*/

/* Sends new product information to server */
/*
const submitEvent = function () {
    formData = new Object();
    formData.id = Math.floor(Math.random() * 1000000);
    formData.title = document.getElementById("product-title").value;
    formData.description = document.getElementById("product-description").value;
    formData.price = document.getElementById("product-price").value;
    formData.image = document.getElementById("product-image").value;
    if (formData.image == "") {
        formData.image = "./assets/default_img.png";
    }
    //console.log(formData);
    postNewProduct(formData);
    window.localStorage.setItem("formData", JSON.stringify(formData))
}

// Sends the changes in the product to the server 
const editEvent = function (prodID) {
    editData = new Object();
    editData.id = prodID;
    editData.title = document.getElementById("editProduct-title").value;
    editData.description = document.getElementById("editProduct-description").value;
    editData.price = document.getElementById("editProduct-price").value;
    editData.image = document.getElementById("editProduct-image").value;
    //console.log(editData);
    postEditProduct(editData);
}*/

/*^^^ ADMIN FROM VIEW ^^^*/
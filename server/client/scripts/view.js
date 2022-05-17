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
                <a class="btn" style="background-color:#709a71; color: white" id="addtocart" product_number=${product}>Add to Cart</a>
            </div>
    </div></div>`;
    }
    addController('addtocart');
}

const displayCheckout = (body, total, checkout) => {
    document.getElementById("checkout").innerHTML = checkout
    document.getElementById("cart-body").innerHTML = body;
    document.getElementById("cost-label").innerHTML = total;
    addController('rmfromcart');
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
    renderViewDOM(``);
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

    if(document.getElementById("view").getAttribute("cat") != "-100") {
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




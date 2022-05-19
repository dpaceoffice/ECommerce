async function reloadAdmin(simple) {
    if (simple)
        await loadAdminPage().then(() => { console.log("Reload Called") });
    await reloadAdminPage();
    await clearGrid();
}


/* Sends the new order of the products based on the products' ids by posting*/
async function postLayout(order, curCat) {
    const url = 'http://localhost:3000/admin/rearrangeLayout';
    let jsonOrder = JSON.parse(order);
    let package = {
        order: jsonOrder,
        curCat: curCat
    }

    if (order == null) {
        //console.log("null");
    } else {
        return await fetch(url,
            {
                method: 'POST',
                body: JSON.stringify(package),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }

            }
        )
            .then(checkStatus)
            .then(reloadAdmin(true))
            .then(async () => {
                const requestedCategory = new Object();
                let element = document.getElementById("view");
                requestedCategory.id = element.getAttribute('cat');
                requestedCategory.type = element.getAttribute('type')
                var result = await (postCategoryProducts(requestedCategory)).cancel;

            })
    }
}

/* Remove a product by posting the product id to the server */
async function postRemove(attributes) {
    let curCategory = document.getElementById("view").getAttribute("cat");
    //console.log("CURRENT: " + curCategory);
    const url = 'http://localhost:3000/admin/removeProduct';
    // Muuri specific: const postData = await removeOldProduct(e);
    //console.log("REMOVE PRODUCT!");
    const postData = attributes.product_number.nodeValue
    //console.log(postData);
    //await console.log(postData + " is post data!!!!!!!!!!");
    return await fetch(url,
        {
            method: 'POST',
            body: JSON.stringify({ id: postData }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
    )
        .then(checkStatus)
        .then(reloadAdmin(true))
        .then(async () => {
            const requestedCategory = new Object();
            let element = document.getElementById("view");
            requestedCategory.id = element.getAttribute('cat');
            requestedCategory.type = element.getAttribute('type')

            var result = await (postCategoryProducts(requestedCategory)).cancel;
            //console.log(result);
        })
}

/* Adding a new product by posting the product information to the server as JSON */
async function postNewProduct(postData, curCat) {
    const url = 'http://localhost:3000/admin/addProduct';
    array = [postData];
    //console.log(postData);
    //console.log(curCat);
    //console.log(JSON.stringify([postData, curCat]))
    return await fetch(url,
        {
            method: 'POST',
            body: JSON.stringify([postData, curCat]),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
    )
        .then(checkStatus)
        .then(() => { /*console.log('updated!!!'); console.log(JSON.stringify({ id: postData }))*/ })
        .then(reloadAdmin(true))
        .then(async () => {
            const requestedCategory = new Object();
            let element = document.getElementById("view");
            requestedCategory.id = element.getAttribute('cat');
            requestedCategory.type = element.getAttribute('type')

            var result = await (postCategoryProducts(requestedCategory)).cancel;
            //console.log(result);
        })
}

/* Editing product by posting new product information to the server as JSON */
async function postEditProduct(postData) {
    const url = 'http://localhost:3000/admin/editProduct';
    array = [postData];
    return await fetch(url,
        {
            method: 'POST',
            body: JSON.stringify(postData),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
    )
        .then(checkStatus)
        .then(reloadAdmin(true))
        .then(async () => {
            const requestedCategory = new Object();
            let element = document.getElementById("view");
            requestedCategory.id = element.getAttribute('cat');
            requestedCategory.type = element.getAttribute('type')

            var result = await (postCategoryProducts(requestedCategory)).cancel;
            //console.log(result);
        })
}

/* delete Category */
async function deleteCategory(id) {
    const url = 'http://localhost:3000/admin/deleteCategory';
    const deleteCat = new Object();
    deleteCat.id = id;
    return await fetch(url,
        {
            method: 'POST',
            body: JSON.stringify(deleteCat),
            headers: { "Content-Type": "application/json" },
        }
    )
        .then(checkStatus)
        .then(reloadAdmin(true))

}



// https://hartzis.me/fetch-post-express/
// https://medium.com/geekculture/how-to-send-forms-data-with-fetch-using-get-post-put-delete-and-catching-with-express-js-bfdb85b99709 

/* Check if response is okay else throw an error */
function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
    }
}

/* Load admin page by sending get request to server and receiving products information
   Need to clear localStorage for Muuri
*/
var renderingAdmin = false;
async function loadAdminPage() {
    if (!renderingAdmin) {
        renderingAdmin = true;
        const url = `http://localhost:3000/admin`;
        const response = await fetch(url);
        const data = await response.json();
        if (await response.status != 403) {
            userRefresh(data);
            displayAdmin();
            localStorage.clear();
            categories();
        } else {
            if (!data.auth)
                forceOpenLogin();
            else
                alert("You don't have permission to do that.");
        }
        renderingAdmin = false;
    }
}

/* Get the list of categories from mongodb */
async function getCategoriesIds() {
    const url = `http://localhost:3000/admin/getCategoriesIds`;
    const response = await fetch(url);
    const data = await response.json();
    if (data) {
        addCategoryOptions(data);
    } else {
        console.log("FAIL did not get categories or type")
    }
}

/* get categories for deletion */
async function getCategoriesForDelete() {
    const url = `http://localhost:3000/admin/getCategoriesIds`;
    const response = await fetch(url);
    const data = await response.json();
    //console.log(response);
    if (data) {
        deleteCategoryOptions(data);
    } else {
        //console.log("FAIL did not get categories or type")
    }
}

/*request and get back products based on category */
async function postCategoryProducts(category) {
    const url = `http://localhost:3000/admin/requestCatProducts/${category.id}/${category.type}`;
    const response = await fetch(url);
    const data = await response.json();
    let jsonData;

    if (document.getElementById("view").getAttribute("cat") != "-100" && Object.keys(data).length != 1) {
        //console.log("RELOADDDING!");
        //reloadAdmin(false);
        reloadAdminPage();
        clearGrid();
    }

    if (Object.keys(data).length > 1) {
        //console.log(">1");
        jsonData = JSON.parse(data);
        //jsonDataLength = jsonData.products.length;

        //console.log("SUCCESS!");

        viewAdminPage(jsonData.result[0].products, jsonData.result[1].id, category.type);
    } else {
        reloadAdmin(true);

        viewAdminPage([], data.id._id, data.id.type);

    }
    //console.log(data);
    return data;
}

/* Get product's information by get request and sending product id */
async function getProductById(id) {
    const url = `http://localhost:3000/admin/productById/${id}`;
    const response = await fetch(url);
    //console.log("getProdById: " + id + " | " + JSON.stringify(id.product_number));
    const data = await response.json();
    /*if (data) {
        console.log("SUCCESS!");
    } else {
        console.log("FAIL!");
    }*/
    //console.log(data);
    return data;
}

//^^^^ ADMINISTRATION CODE ^^^^^

//Sends new product information to server 
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
    //console.log(document.getElementById("view").getAttribute("cat"));
    var currentCat = document.getElementById("view").getAttribute("cat");
    postNewProduct(formData, currentCat);
    window.localStorage.setItem("formData", JSON.stringify(formData))
}

//Sends the changes in the product to the server
const editEvent = function (attributes) {
    editData = new Object();
    editData.id = attributes.product_number.nodeValue;
    editData.title = document.getElementById("editProduct-title").value;
    editData.description = document.getElementById("editProduct-description").value;
    editData.price = document.getElementById("editProduct-price").value;
    editData.image = document.getElementById("editProduct-image").value;
    //console.log(editData);
    postEditProduct(editData);
}

// Receive product information by id from server to allow client to edit the information
const editProductGetID = async function (attributes) {
    //console.log("Clicking Edit");
    let product = await getProductById(attributes.product_number.nodeValue);
    //console.log("Product info from server for editting " + product.id);

    // NEED TO GET PRODUCT'S INFORMATION - mongodb
    document.getElementById("editProduct-title").value = product.title;
    document.getElementById("editProductBut").setAttribute("product_number", product.id);
    document.getElementById("editProduct-description").value = product.description;
    document.getElementById("editProduct-price").value = product.price;
}

// upload the category options
const addCategoryOptions = function (data) {
    var mySelect = document.getElementById("mySelect");
    mySelect.innerHTML = "";

    var createOption = document.createElement("option");
    createOption.setAttribute("id", -1)
    createOption.innerHTML = "Create New Category";
    mySelect.add(createOption);

    document.getElementById("createCategory").value = "";

    data.forEach(element => {
        var option = document.createElement("option");
        option.setAttribute("id", element._id)
        option.setAttribute("type", element.type)
        option.innerHTML = element.type;
        //console.log(element._id);
        mySelect.add(option);
    });

}

const deleteCategoryOptions = function (data) {
    var myDeleteSelect = document.getElementById("myDeleteSelect");
    myDeleteSelect.innerHTML = "";

    data.forEach(element => {
        var option = document.createElement("option");
        option.setAttribute("id", element._id)
        option.setAttribute("type", element.type)
        option.innerHTML = element.type;
        myDeleteSelect.add(option);
    });
}

/* Get id of category you want to delete */
const getDeletedCateId = function () {
    const select = document.getElementById("myDeleteSelect");
    const value = select.options[select.selectedIndex];
    deleteCategory(value.getAttribute('id'));
}


// upload the category's product by sending request (view existing category or create a new one) then view the products
const getProductsByCat = function () {
    const select = document.getElementById("mySelect");
    const value = select.options[select.selectedIndex];
    //console.log(typeof value.getAttribute('id'));

    const newCategoryName = document.getElementById("createCategory").value;
    //console.log(newCategoryName);

    const requestedCategory = new Object();

    if (value.getAttribute('id') == "-1") {
        requestedCategory.id = "-1";
        requestedCategory.type = newCategoryName;
    } else {
        requestedCategory.id = value.getAttribute('id');
        requestedCategory.type = value.getAttribute('type');
    }

    // load the products to the screen
    let categoryProducts = postCategoryProducts(requestedCategory).cancel;
    //console.log(categoryProducts);
    //viewAdminPage(categoryProducts);
}




window.onload = (event) => {
    loadAdminPage();
    console.log("LOAD PAGE!");
}

/* Sends the new order of the products based on the products' ids by posting*/
async function postLayout(order) {
    const url = 'http://localhost:3000/admin/rearrangeLayout';
    console.log("TYPE-----" + typeof order);
    console.log(JSON.parse(order));
    return await fetch(url,
        {
            method: 'POST',
            body: JSON.stringify(JSON.parse(order)),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }

        }
    )
        .then(checkStatus)
        .then(() => { reloadAdminPage(); console.log("reload"); })
}

/* Remove a product by posting the product id to the server */
async function postRemove(attributes) {
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
        .then(() => { /*console.log('updated!!!'); console.log(JSON.stringify({ id: postData }))*/ })
        .then(() => { reloadAdminPage(); /*console.log("reload");*/ })
}

/* Adding a new product by posting the product information to the server as JSON */
async function postNewProduct(postData) {
    const url = 'http://localhost:3000/admin/addProduct';
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
        .then(() => { console.log('updated!!!'); console.log(postData);console.log(array[0]) })
        .then(() => { reloadAdminPage(); console.log("reload"); })
    //.then(() => { addNewProduct(array) })
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
        .then(() => { console.log('editted update!!!'); console.log(array[0]) })
        .then(() => { reloadAdminPage(); console.log("reload"); })
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
async function loadAdminPage() {
    const url = 'http://localhost:3000/admin';
    const response = await fetch(url);
    const data = await response.json();
    if (data) {
        console.log("SUCCESS!");
        console.log(data);
        //startPage();
        localStorage.clear();
        //adminPage(data);
        viewAdminPage(data);
        
    } else {
        console.log("FAIL!");
    }
    //console.log(data);
    //return data;
}

/* Get product's information by get request and sending product id */
async function getProductById(id) {
    const url = `http://localhost:3000/productById/${id}`;
    const response = await fetch(url);
    console.log("getProdById: " + id + " | " + JSON.stringify(id.product_number));
    const data = await response.json();
    if (data) {
        console.log("SUCCESS!");
        console.log(data);
    } else {
        console.log("FAIL!");
    }
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
    postNewProduct(formData);
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


const editProductGetID = async function(attributes) {
    console.log("Clicking Edit");
    let product = await getProductById(attributes.product_number.nodeValue);
    console.log("Product info from server for editting " + product.id);

    // NEED TO GET PRODUCT'S INFORMATION - mongodb
    document.getElementById("editProduct-title").value = product.title;
    document.getElementById("editProductBut").setAttribute("product_number", product.id);
    document.getElementById("editProduct-description").value = product.description;
    document.getElementById("editProduct-price").value = product.price;
}


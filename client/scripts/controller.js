const getCallbacks = () => ({
    'cat_id': sendActiveCat,
    'addtocart': addProductToCart,
    'rmfromcart': removeProductFromCart
});
const addController = function (...buttonIDs) {
    const callbacks = getCallbacks();
    for (let id of buttonIDs) {
        for (let element of document.querySelectorAll('[id=' + id + ']')) {
            element.addEventListener("click", () => callbacks[id](element.attributes));
        }
    }
}

/* ADMINISTRATION CODE */

async function postLayout(order) {
    const url = 'http://localhost:3000/admin/rearrangeLayout';
    return await fetch(url,
        {
            method: 'POST',
            body: order,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
    )
        .then(checkStatus)
        .then(() => { console.log('updated!!!'); console.log(order) })
        .then(() => { reloadAdminPage(); console.log("reload"); })
}


async function postRemove(e) {
    const url = 'http://localhost:3000/admin/removeProduct';
    const postData = await removeOldProduct(e);
    await console.log(postData + " is post data!!!!!!!!!!");
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
        .then(() => { console.log('updated!!!'); console.log(JSON.stringify({ id: postData })) })
        .then(() => { reloadAdminPage(); console.log("reload"); })
}

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
        .then(() => { console.log('updated!!!'); console.log(array[0]) })
        .then(() => { reloadAdminPage(); console.log("reload"); })
    //.then(() => { addNewProduct(array) })
}

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

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
    }
}

// 
async function loadAdminPage() {
    const url = 'http://localhost:3000/admin';
    const response = await fetch(url);
    const data = await response.json();
    if (data) {
        console.log("SUCCESS!");
        console.log(data);
        //startPage();
        localStorage.clear();
        adminPage(data);
    } else {
        console.log("FAIL!");
    }
    //console.log(data);
    //return data;
}

async function getProductById(id) {
    const url = `http://localhost:3000/productById/${id}`;
    const response = await fetch(url);
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

/*^^^^ ADMINISTRATION CODE ^^^^^*/

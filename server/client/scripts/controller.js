const getCallbacks = () => ({
    'cat_id': sendActiveCat,
    'addtocart': addProductToCart,
    'rmfromcart': removeProductFromCart,
    'login-button': handleLogin,
    'checkout': createPaypalButton,
    'register-button': handleRegister,
    'show-login': showLogin,
    'show-register': showRegister,
    'user-profile-button': displayAdmin,
    'home': homeButton
});
const addController = function (...buttonIDs) {
    const callbacks = getCallbacks();
    for (let id of buttonIDs) {
        for (let element of document.querySelectorAll('[id=' + id + ']')) {
            element.addEventListener("click", () => callbacks[id](element.attributes));
        }
    }
}


const getAdminCallbacks = () => ({
    "submitProduct": submitEvent,
    "removeProdBut": postRemove,
    "saveOrder": postLayout,
    "wantToEditBut": editProductGetID,
    "editProductBut": editEvent,
    "categoryBut": getCategoriesIds,
    "categoryDecisionBut": getProductsByCat,
    "deleteCategoryBut": getCategoriesForDelete,
    "confirmDeleteCate": getDeletedCateId
})


const adminAddController = async function (...adminButtonIDs) {
    const adminCallbacks = getAdminCallbacks();
    for (let id of adminButtonIDs) {
        for (let element of document.querySelectorAll('[id=' + id + ']')) {
            //console.log("ID: " + id);
            element.addEventListener("click", async () => {
                console.log("CLICKED! " + id);
                if (id == "saveOrder") {
                    //console.log("LAYOUT___:" + window.localStorage.getItem('prodIdlayout'))
                    let curCat = await document.getElementById("view").getAttribute("cat");
                    await adminCallbacks[id](window.localStorage.getItem('prodIdlayout'), curCat)
                } else {
                    await adminCallbacks[id](element.attributes)
                }
            });
        }
    }
}
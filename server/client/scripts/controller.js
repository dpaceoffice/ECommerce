const getCallbacks = () => ({
    'cat_id': sendActiveCat,
    'addtocart': addProductToCart,
    'rmfromcart': removeProductFromCart,
const addController = function (...buttonIDs) {
    const callbacks = getCallbacks();
    for (let id of buttonIDs) {
        for (let element of document.querySelectorAll('[id=' + id + ']')) {
            element.addEventListener("click", () => callbacks[id](element.attributes));
        }
    }
}
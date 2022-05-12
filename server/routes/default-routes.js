import Controller from "../config/default-controller.js";
import express from 'express';

export default class Router {
    #router
    constructor() {
        var router = express.Router();
        this.#router = router;
        const controller = new Controller();
        router.get('/', controller.getIndex);
        router.get('/store-data', controller.getStoreData);
        router.get('/checkout-data', controller.getCheckout);
        router.post('/setCategory', controller.setCategory);
        router.get('/carts', controller.getCarts)
        router.post('/add-product', controller.addToCart);
        router.post('/remove-product', controller.removeFromCart);

        /**Login */
        router.post('/login', controller.login);

        /**Expects category id in post body*/
        router.post('/category', controller.getCategory);
        router.post('/category/products', controller.getProducts);

        router.get('/test-add', controller.test);
    }
    getRouter() {
        return this.#router;
    }
}
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

        /**Shopping Cart */
        router.post('/add-product', controller.addToCart);
        router.post('/remove-product', controller.removeFromCart);

        /**Login */
        router.post('/login', controller.login);

        /**Expects category id in post body*/
        router.post('/category', controller.getCategory);
        router.post('/category/products', controller.getProducts);

        /**Paypal EndPoints */
        router.post('/api/orders', controller.getOrders);
        router.post('/api/orders/:orderID/capture', controller.capturePayment);

        router.get('/test-add', controller.test);
    }
    getRouter() {
        return this.#router;
    }
}
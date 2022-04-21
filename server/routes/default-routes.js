import Controller from "../controllers/default-controller.js";
import express from 'express';

export default class Router {
    #router
    constructor() {
        var router = express.Router();
        this.#router = router;
        //const controller = require('../controllers/default-controller');
        const controller = new Controller();
        router.get('/', controller.getIndex);
        router.get('/store-data', controller.getStoreFront);
        router.get('/checkout-data', controller.getCheckout);
        router.post('/setCategory', controller.setCategory);
        router.post('/add-product', controller.addToCart);
        router.post('/remove-product', controller.removeFromCart);
    }
    getRouter() {
        return this.#router;
    }
}
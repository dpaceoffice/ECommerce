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
        router.get('/:id/set-cat', controller.setCat)
    }
    getRouter() {
        return this.#router;
    }
}
import Controller from "../config/default-controller.js";
import { ensureAdmin, ensureAuth } from "../config/auth.js";
import express from 'express';
import upload from '../config/upload.js';
import openAi from '../config/openAi.js';

export default class Router {
    #router
    constructor() {
        var router = express.Router();
        this.#router = router;
        const controller = new Controller();
        router.get('/', controller.getIndex);
        router.get('/store-data', controller.getStoreData);
        /**OPENAI Prompt request */
        router.post('/openai/prompt/', openAi);
        /**Shopping Cart */
        router.post('/add-product', ensureAuth, controller.addToCart);
        router.post('/remove-product', ensureAuth, controller.removeFromCart);

        /**Login */
        router.post('/login', controller.login);
        router.get('/logout', ensureAuth, controller.logout);

        /**Modify Profile */
        router.post('/profile/image', ensureAuth, upload, controller.uploadImage)
        router.post('/profile/modify', ensureAuth, controller.modifyProfile)

        /**Register*/
        router.post('/register', controller.register);
        router.get('/customer-data', controller.getCustomerData);

        /**Expects category id in post body*/
        router.post('/category', controller.getCategory);
        router.post('/category/products', controller.getProducts);

        /**Paypal EndPoints */
        router.post('/api/orders', ensureAuth, controller.getOrders);
        router.post('/api/orders/:orderID/capture', ensureAuth, controller.capturePayment);

        router.get('/test-add', ensureAdmin, controller.test);


        /* ADMINISTRATION CODE */

        router.get('/admin', ensureAdmin, controller.loadAdmin);
        router.post('/admin/addProduct', ensureAdmin, controller.addProduct);
        router.post('/admin/rearrangeLayout', ensureAdmin, controller.rearrangeLayout);
        router.post('/admin/sortCat', ensureAdmin, controller.sortCat);
        router.post('/admin/removeProduct', ensureAdmin, controller.removeProduct);
        router.get('/admin/productById/:id', ensureAdmin, controller.productById);
        router.post('/admin/editProduct', ensureAdmin, controller.editProduct);
        router.get('/admin/getCategoriesIds', ensureAdmin, controller.getCategoriesIds);
        router.get('/admin/requestCatProducts/:id/:type', ensureAdmin, controller.returnCatProducts)
        router.post('/admin/deleteCategory', ensureAdmin, controller.deleteCategory);
        router.post('/admin/image', ensureAdmin, upload, controller.uploadAdminImage)

        /*^^^^ ADMINISTRATION CODE ^^^^*/
    }
    getRouter() {
        return this.#router;
    }
}
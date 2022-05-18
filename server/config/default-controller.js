import Store from "../models/Store.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Customer from "../models/Customer.js";
import passport from "./passport.js";
import { json } from "express";
import bcrypt from "bcrypt";

export default class Controller {
    constructor() {

    }
    /*
    async getStore() {
        var store = await Store.find({});
        if (store.length <= 0) {
            return new Store({ products: [], categories: [], customers: [] }); //Create an instance of store, store componenet objects are temporarily, statically declared until persistant data is configured.
        } else {
            var model = store[0];
            return model;
        }
    }*/

    getIndex(request, response) {
        response.json({ success: true });
    }
    setCategory(request, response) {
        const id = request.body.id;
        this.getStore().setCurrentCategory(id);
        response.json({ success: true, cat_id: id });
    }

    async getCategory(request, response) {
        const category_id = request.body.id;
        return response.json(await Category.findOne({ _id: category_id }, { _id: 1, type: 1, products: 1 }));
    }
    async getProducts(request, response) {
        const category_id = request.body.id;
        let product_ids = (await Category.findOne({ _id: category_id }, { products: 1 }))['products'];
        let products = await Product.find({ _id: { $in: product_ids } }, { _id: 1, title: 1, des: 1, image: 1 });
        return response.json({ products });
    }
    async getStoreData(request, response) {
        var cstate = await Category.find({}, { _id: 1, type: 1, products: 1 });
        var pstate = await Product.find({}, { _id: 1, title: 1, price: 1, des: 1, image: 1 });
        const auth_user = request.user;
        let user = undefined;
        if (auth_user != undefined) {
            user = auth_user.email;
        }
        response.json({ cstate, pstate, user });
    }

    getCheckout(request, response) {
        let [body, total] = this.getStore().getCustomer().getActiveCart().getHtmlElement();
        const cart = this.getStore().getCustomer().getActiveCart().getCheckoutHtml();
        const data = { body, total, cart }
        response.json(data)
    }
    addToCart(request, response) {
        const id = parseInt(request.body.id);
        this.getStore().getCustomer()
            .getActiveCart()
            .addProduct(this.getStore().getProduct(id), 1);
        response.json({ success: true });
    }
    removeFromCart(request, response) {
        const id = parseInt(request.body.id);
        this.getStore().getCustomer()
            .getActiveCart()
            .removeProduct(this.getStore().getProduct(id), 1);
        response.json({ success: true });
    }
    login(request, response, next) {
        const { email, password } = request.body;
        let session = request.session.id;
        console.log(request.body);
        console.log(request.session.id);//express

        //const config = {};
        //config.successRedirect = '/';
        //config.failureRedirect = '/login';
        //const authHandler = passport.authenticate('local', config);
        //authHandler(request, response, next);//passes body into passport
        response.json({ email, password, session });
    }

    getCarts(request, response) {
        const carts = this.getStore().getCustomer().getCarts();
        const html = this.getStore().getCustomer().getHtml();
        const data = { carts, html }
        response.json(data)
    }

    async register(request, response) {
        const { name, email, password } = request.body;

        if (!name && !email && !password) {
            response.json({ error: true, errorMsg: "Fill in all of the fields." });
        } else if (!name) {
            response.json({ error: true, errorMsg: "Fill in the username field." });
        } else if (!email) {
            response.json({ error: true, errorMsg: "Fill in the email field." });
        } else if (!password) {
            response.json({ error: true, errorMsg: "Fill in the password field." });
        }
        else {
            await Customer.findOne({ email: email }).then(user => {
                if (user) {
                    response.json({ error: true, errorMsg: "Email already exists. Use another one." });
                } else {
                    bcrypt.hash(password, 10, async (err, hash) => {
                        if (err) throw err;
                        const document = await Store.createCustomer(name, email, hash);
                        const data = { document: document }
                        response.status(200).json(data);
                    });
                }
            })
        }

    }

    async getCustomerData(request, response) {
        var customer = await Customer.find({});
        response.json({ customer });
    }

    async test(request, response) {
        await Store.createCustomer(
            "David",
            "david@test",
            "password",
            2
        )
        const authenticated_user = request.user;
        if (authenticated_user == undefined || authenticated_user.rights < 2) {
            return response.sendStatus(403);
        }
        let katana = await Store.createProduct(
            "Katana",
            "A very very sharp sword used by samurai",
            5.5,
            "./assets/katana.png"
        )
        let gs = await Store.createProduct(
            "Great Sword",
            "A great sword, used by the largest men",
            25.5,
            "./assets/greatsword.png"
        )
        let swords = [katana, gs];
        await Store.createCategory("Swords", swords);

        let crossbow = await Store.createProduct(
            "Crossbow",
            "A ranged weapon using an elastic launching device consisting of a bow-like assembly called a prod, mounted horizontally on a main frame called a tiller",
            53.5,
            "./assets/crossbow.png"
        )
        let longbow = await Store.createProduct(
            "Longbow",
            "A type of tall bow that makes a fairly long draw possible",
            25.0,
            "./assets/longbow.png"
        )
        let bows = [crossbow, longbow];
        await Store.createCategory("Bows", bows);

        const products = await Product.find();//persistent product scheme instances
        const categories = await Category.find();
        const users = await Customer.find();
        const data = { products, categories, users, authenticated_user };
        response.json(data);
    }
}
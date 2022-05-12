import Store from "../models/Store.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import passport from "./config/passport.js";

export default class Controller {
    constructor() {
        this.getStoreFront = this.getStoreData.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.getCategory = this.getCategory.bind(this);
        this.getCheckout = this.getCheckout.bind(this);
        this.addToCart = this.addToCart.bind(this);
        this.removeFromCart = this.removeFromCart.bind(this);
        this.getCarts = this.getCarts.bind(this);
        this.test = this.test.bind(this);
        this.getStore = this.getStore.bind(this);
    }
    async getStore() {
        var store = await Store.find({});
        if (store.length <= 0) {
            return new Store({ products: [], categories: [], customers: [] }); //Create an instance of store, store componenet objects are temporarily, statically declared until persistant data is configured.
        } else {
            var model = store[0];
            return model;
        }
    }

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

        response.json({ cstate, pstate });
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
        const {email, password} = request.body;
        console.log(email, password);
        console.log(request.session.id);//express

        const config = {};
        config.successRedirect = '/';
        config.failureRedirect = '/login';
        const authHandler = passport.authenticate('local', config);
        authHandler(request, response, next);//passes body into passport
        response.send('success');
    }

    getCarts(request, response) {
        const carts = this.getStore().getCustomer().getCarts();
        const html = this.getStore().getCustomer().getHtml();
        const data = { carts, html }
        response.json(data)
    }
    async test(request, response) {
        var store = await this.getStore();

        let katana = await store.createProduct(
            "Katana",
            "A very very sharp sword used by samurai",
            5.5,
            "./assets/katana.png"
        )
        let gs = await store.createProduct(
            "Great Sword",
            "A great sword, used by the largest men",
            25.5,
            "./assets/greatsword.png"
        )
        let swords = [katana, gs];
        let sword_cat = await store.createCategory("Swords", swords);
        await store.addCategory(sword_cat);

        let crossbow = await store.createProduct(
            "Crossbow",
            "A ranged weapon using an elastic launching device consisting of a bow-like assembly called a prod, mounted horizontally on a main frame called a tiller",
            53.5,
            "./assets/crossbow.png"
        )
        let longbow = await store.createProduct(
            "Longbow",
            "A type of tall bow that makes a fairly long draw possible",
            25.0,
            "./assets/longbow.png"
        )
        let bows = [crossbow, longbow];
        let bow_cat = await store.createCategory("Bows", bows);
        await store.addCategory(bow_cat);

        const store_state = await Store.find();
        const products = await Product.find();//persistent product scheme instances
        const categories = await Category.find();
        const requester = request.user.name;
        const data = { store_state, products, categories,  requester};
        response.json(data);
    }
}
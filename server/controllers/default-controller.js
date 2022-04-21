import Store from "../models/Store.js";

export default class Controller {
    #store;
    constructor() {
        this.#store = new Store(); //Create an instance of store, store componenet objects are temporarily, statically declared until persistant data is configured.

        this.getStoreFront = this.getStoreFront.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.getCheckout = this.getCheckout.bind(this);
        this.addToCart = this.addToCart.bind(this);
        this.removeFromCart = this.removeFromCart.bind(this);
    }

    getIndex(request, response) {
        response.json({ success: true });
    }
    setCategory(request, response) {
        const id = request.body.id;
        this.#store.setCurrentCategory(id);
        response.json({ success: true, cat_id: id });
    }
    getStoreFront(request, response) {
        var dollarUS = Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        });
        const category = this.#store.getCategories()[this.#store.getCurrentCategory()];
        const products = category.getProducts();
        var cstate = {}
        var pstate = {}
        for (const category in this.#store.getCategories()) {
            var cat = this.#store.getCategories()[category]
            cstate[cat.getID()] = cat.getType();
        }
        for (const product in products) {
            var p = products[product];
            pstate[p.getID()] = [p.getImage(), p.getTitle(), p.getDescription(), dollarUS.format(p.getPrice())];
        }
        response.json({ cstate, pstate });
    }
    getCheckout(request, response) {
        let [body, total] = this.#store.getCustomer().getActiveCart().getHtmlElement();
        const cart = this.#store.getCustomer().getActiveCart().getCheckoutHtml();
        const data = { body, total, cart }
        response.json(data)
    }
    addToCart(request, response) {
        const id = parseInt(request.body.id);
        this.#store.getCustomer()
            .getActiveCart()
            .addProduct(this.#store.getProduct(id), 1);
        response.json({ success: true });
    }
    removeFromCart(request, response) {
        const id = parseInt(request.body.id);
        this.#store.getCustomer()
            .getActiveCart()
            .removeProduct(this.#store.getProduct(id), 1);
        response.json({ success: true });
    }

}
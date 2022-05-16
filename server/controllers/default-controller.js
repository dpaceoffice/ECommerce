import Store from "../models/Store.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { response } from "express";

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
        this.addProduct = this.addProduct.bind(this);
        this.returnCatProducts = this.returnCatProducts.bind(this);
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
        const data = { store_state, products, categories };
        response.json(data);
    }

    /* ADMINISTRATION CODE*/
    // SERVER NEEDS TO ACCESS MONGODB TO MAKE CHANGES TO THE DATABASE


    // return list of categories ids and types
    getCategoriesIds(request, response) {
        const productsMongo = async () => {
            ;
            const categories = await Category.find({}, { type: 1 });
            //console.log(categories);
            response.json(categories);
            console.log("GET SUCCESS! GET categories and types from mongodb");
        };
        productsMongo();
    }


    // Receives category id and returns products in that category
    async returnCatProducts(request, response) {
        console.log(request.params);
        console.log("ID: " + request.params.id + " | Type: " + request.params.type);
        const id = request.params.id;
        const type = request.params.type;
        var products = new Array();
        // if creating a new category
        if (id == "-1") {
            var store = await this.getStore();
            const newCategory = await store.createCategory(type, []);
            console.log(newCategory);
            response.send(JSON.stringify({ "id": newCategory }, { "products": [] }));
        } else {
            let productsNum;
            let i = 0;
            let array = new Array();
            const categories = await Category.find({ _id: id }, { products: 1 });
            productsNum = await categories[0].products.length;
            console.log("Product Numbers: ");
            console.log(productsNum);

            // if category exists but is empty
            if (productsNum == 0) {
                response.json(JSON.stringify({"result":[{"products": []},{"id": id}]}))
            } else {
                // if category exists but is not empty
                let mongoCatProd = function () {
                    return Category.find({ _id: id }, { products: 1 })
                }
                let mongoCatProd2 = mongoCatProd();
                console.log(mongoCatProd);
    
                mongoCatProd2.then(function (result) {
                    //console.log("what?????");
                    console.log(result[0].products);
                    productsNum = result[0].products.length;
                    console.log(catProdIds(result[0].products));
                })
                const catProdIds = async (array2) => {
                    for (let element of array2) {
                        //console.log(element.valueOf())    
                        let prodID = element.toString();
                        //console.log(typeof prodID + ": " + prodID);
                        let addProd = function () { return Product.find({ _id: prodID }) };
                        let addProd2 = addProd();
                        console.log(addProd);
                        addProd2.then(function (result) {
                            products.push(result[0]);
                            i++;
                            if (i == productsNum) {
                                console.log("Getting Category Products: " + id);
                                console.log("Products are ");
                                console.log(products);
                                response.json(JSON.stringify({"result":[{"products": products},{"id": id}]}))
                            }
                            //console.log("OUTSIDE-"+ products);
                        })
                    }
                }
            }

            


        }
    }

    /* Load admin page by getting collection of products from mongodb and sending it to client to load page */
    loadAdmin(request, response) {
        let result;
        const productsMongo = async () => {
            result = await Product.find();
            response.json(result);
        };
        productsMongo();

    }

    /* Add new product object to mongodb by receiving the new product as JSON */
    async addProduct(request, response) {
        response.send(request.body);
        console.log("POST SUCCESS! Added product! Can update mongo!");
        console.log("Category: " + request.body[1])
        console.log("PRODUCT: -----------------");
        console.log(request.body[0]);

        var store = await this.getStore();

        var product = await store.createProduct(
            request.body[0].title,
            request.body[0].description,
            request.body[0].price,
            request.body[0].image
        )

        console.log("Product : -----" + product);
        await Category.updateOne(
            { _id: request.body[1] },
            { $push: { products: product } }
        )


    }

    /* Can rearrange layout/order of products by sending an array that contains the order based on the products' id */
    async rearrangeLayout(request, response) {
        response.send(request.body);
        console.log("POST SUCCESS! Rearrange Layout! Can update mongo!");
        console.log(request.body);
        console.log(typeof request.body.order)
        console.log(request.body.order);
        console.log(typeof request.body.curCat)
        console.log(request.body.curCat);
        console.log("inside array");
        console.log(request.body.order[0]);
        console.log(request.body.order[1]);

        let layout = await Category.updateOne(
            { _id: request.body.curCat },
            {
                $set:
                    { products: request.body.order }
            }
        )

    }

    /* Remove product by receiving the product id from the client and removing it in mongodb */
    async removeProduct(request, response) {
        response.send(request.body);
        console.log("POST SUCCESS! Removed Product's ID: " + JSON.stringify(request.body));
        console.log(request.body.id);
        console.log(request.body.cat);
        let prodID = request.body.id;
        await Category.updateMany(
            {},
            { $pull: { products: { $in: [prodID] } } }
        )
        await Product.deleteMany(
            { _id: prodID }
        )
    }

    /* Get product information by client sending requested product id to server. Server can then access mongodb and get product */
    async productById(request, response) {
        const id = request.params.id;
        console.log("ID: " + request.params.id);
        const product = await Product.find({ _id: id })
        console.log(product[0])
        response.json({
            id: product[0]._id,
            title: product[0].title,
            description: product[0].des,
            price: product[0].price,
            image: product[0].image
        })
        //console.log(response);
    }

    /* Edit product information by client sending new changes as a product object to update product in mongodb */
    async editProduct(request, response) {
        response.send(request.body);
        console.log("POST SUCCESS! Edit Product! Can update mongo!");
        console.log(request.body);
        console.log(request.body.id);
        console.log(request.body.title);
        console.log(request.body.description);
        console.log(request.body.price);
        console.log(request.body.image);
        // _id, title, des, price, image
        let edit = await Product.updateMany(
            { _id: request.body.id },
            {
                $set: {
                    title: request.body.title,
                    des: request.body.description,
                    price: request.body.price,
                    image: request.body.image
                }
            }
        )
        console.log(edit);
    }

    /*^^^^ ADMINISTRATION CODE ^^^^*/
}
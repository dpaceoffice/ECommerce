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

    returnCatProducts(request, response) {
        //const id = request.params.id;
        //var store = await this.getStore();
        console.log(request.params);
        console.log("ID: " + request.params.id + " | Type: " + request.params.type);
        const id = request.params.id;
        const type = request.params.type;
        var products = new Array();
        if (id == "-1") {
            //await store.createCategory(type, []);
            response.send(JSON.stringify({"id": "-1"},{"products": []}));
        } else {
            let productsNum;
            let i = 0;
            let array = new Array();
            const productsMongo = async () => {
                //console.log(id);
                //console.log(typeof id);
                const categories = await Category.find({ _id: id }, { products: 1 });
                //console.log(categories);
                productsNum = await categories[0].products.length;
                i = 0;
                array = await categories[0].products;
            };

            let mongoCatProd = function () {
                return Category.find({ _id: id }, { products: 1 })
            }
            let mongoCatProd2 = mongoCatProd();
            console.log(mongoCatProd);

            mongoCatProd2.then(function(result) {
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
                    let addProd = function () { return Product.find({ _id: prodID })};
                    let addProd2 = addProd();
                    console.group(addProd);

                    addProd2.then(function(result) {
                        products.push(result[0]);
                        i++;
                        if (i == productsNum) {
                            //console.log("product-------"+ i +" " + products);
                            //console.log(typeof products)
                            //response.send(JSON.stringify({product:products}));
                            response.json(JSON.stringify({"products": products}));
                        }
                        //console.log("OUTSIDE-"+ products);
                    })
                    
                }
            }

                /*
                categories[0].products.forEach( async (element) => {
                    //console.log(element.valueOf())    
                    let prodID = element.toString();
                    //console.log(typeof prodID + ": " + prodID);
                    let addProd = await Product.find({ _id: prodID });
                    //console.log(addProd[0]);
                    products.push(await addProd);
                    //console.log("product-"+ products);
                });*/
            /*const addProd = async (array2) => {
                for (let element of array2) {
                    //console.log(element.valueOf())    
                    let prodID = element.toString();
                    //console.log(typeof prodID + ": " + prodID);
                    let addProd = await Product.find({ _id: prodID });
                    //console.log(addProd[0]);
                    products.push(await addProd);
                    i++;
                    if (i == productsNum) {
                        console.log("product-"+ products);
                        response.send(products);
                    }
                    
                }
            }*/

            //console.log(productsMongo());
            //console.group(addProd());
            
        
        }
    }

    /* Load admin page by getting collection of products from mongodb and sending it to client to load page */
    loadAdmin(request, response) {
        let result;
        const productsMongo = async () => {
            result = await Product.find();
            //console.log(result);
            //const categories = await Category.find({}, {products: 1});
            //console.log(categories);
            response.json(result);
        };
        productsMongo();

        let products = [
            {
                id: 10,
                title: "Katana",
                description: "A very very sharp sword used by samurai",
                price: 5.0,
                image: "./assets/katana.png"
            }, {
                id: 11,
                title: "Great Sword",
                description: "A great sword, used by the largest men",
                price: 25.0,
                image: "./assets/greatsword.png"
            },
            {
                id: 12,
                title: "Katana",
                description: "A very very sharp sword used by samurai during the 12th century",
                price: 5.0,
                image: "./assets/katana.png"
            },
            {
                id: 13,
                title: "Great Sword",
                description: "A great sword, used by the largest men",
                price: 25.0,
                image: "./assets/greatsword.png"
            },
            {
                id: 14,
                title: "Katana",
                description: "A very very sharp sword used by samurai",
                price: 5.0,
                image: "./assets/katana.png"
            },
            {
                id: 15,
                title: "Great Sword",
                description: "A great sword, used by the largest men",
                price: 25.0,
                image: "./assets/greatsword.png"
            }

        ]
        //console.log("ARRAY");
        //console.log(products);

        //response.json(products);

    }

    /* Add new product object to mongodb by receiving the new product as JSON
    addProduct(request, response) {
        response.send(request.body);
        console.log("POST SUCCESS! Added product! Can update mongo!");
        console.log(request.body);

        let products = {
            0: {
                id: 0,
                title: "Katana",
                description: "A very very sharp sword used by samurai",
                price: 5.0,
                image: "./assets/katana.png"
            },
            1: {
                id: 1,
                title: "Great Sword",
                description: "A great sword, used by the largest men",
                price: 25.0,
                image: "./assets/greatsword.png"
            },
        }
        products[Number(request.body.id)] = request.body;
        //console.log("APPENDED");
        //console.log(products);
    }*/


    /* Add new product object to mongodb by receiving the new product as JSON */
    async addProduct(request, response) {
        response.send(request.body);
        console.log("POST SUCCESS! Added product! Can update mongo!");
        console.log(request.body.id);
        console.log(request.body.title);
        console.log(request.body.description);
        console.log(request.body.price);
        console.log(request.body.image);
        // request.body.category

        var store = await this.getStore();

        let product = await store.createProduct(
            request.body.title,
            request.body.description,
            request.body.price,
            request.body.image
        )

        // current category you are viewing

        /*let products = {
            0: {
                id: 0,
                title: "Katana",
                description: "A very very sharp sword used by samurai",
                price: 5.0,
                image: "./assets/katana.png"
            },
            1: {
                id: 1,
                title: "Great Sword",
                description: "A great sword, used by the largest men",
                price: 25.0,
                image: "./assets/greatsword.png"
            },
        }
        products[Number(request.body.id)] = request.body;*/
        //console.log("APPENDED");
        //console.log(products);
    }

    /* Can rearrange layout/order of products by sending an array that contains the order based on the products' id */
    rearrangeLayout(request, response) {
        response.send(request.body);
        console.log("POST SUCCESS! Rearrange Layout! Can update mongo!");
        console.log(request.body);

    }

    /* Remove product by receiving the product id from the client and removing it in mongodb */
    removeProduct(request, response) {
        response.send(request.body);
        console.log("POST SUCCESS! Removed Product's ID: " + JSON.stringify(request.body));


    }

    /* Get product information by client sending requested product id to server. Server can then access mongodb and get product */
    productById(request, response) {
        const id = request.params.id;
        console.log("ID: " + request.params.id);
        response.json({
            id: id,
            title: "Great Sword - EDIT",
            description: "A great sword, used by the largest men. GETTING FOR EDIT",
            price: 25.0,
            image: "./assets/greatsword.png"
        })
        console.log(response);
    }

    /* Edit product information by client sending new changes as a product object to update product in mongodb */
    editProduct(request, response) {
        response.send(request.body);
        console.log("POST SUCCESS! Edit Product! Can update mongo!");
        console.log(request.body);
    }

    /*^^^^ ADMINISTRATION CODE ^^^^*/
}
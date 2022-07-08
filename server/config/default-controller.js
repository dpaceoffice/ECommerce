import Store from "../models/Store.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Customer from "../models/Customer.js";
import passport from "./passport.js";
import path from 'path';
import * as paypal from "./paypal-api.js";
import bcrypt from "bcrypt";
import resize from './resize.js';
import fs from 'fs';
const __dirname = path.resolve('build/');


export default class Controller {
    getIndex(request, response) {

        response.sendFile('index.html', { root: __dirname });
    }
    async getOrders(request, response) {
        const order = await paypal.createOrder(request);
        response.json(order);
    }
    async capturePayment(request, response) {
        const { orderID } = request.params;
        const captureData = await paypal.capturePayment(orderID);
        // TODO: store payment information such as the transaction ID
        const user = request.user;
        if (user === undefined) {
            return response.status(400).json({ error: 'Failure to detect a valid user' });
        }
        const orderData = captureData;
        if (orderData == undefined || orderData.status !== 'COMPLETED') {
            return response.status(400).json({ error: 'Order Data not avalaible.' });
        }
        const details = captureData.purchase_units[0];
        const shipping = details.shipping;
        const address = shipping.address;
        const full = address.address_line_1 + ', ' + address.admin_area_2 + ', ' + address.admin_area_1 + ', ' + address.postal_code + ', ' + address.country_code
        await user.setAddress(full);
        const cart = await user.getActiveCart();
        await user.addPurchases(await cart.getProducts(), await cart.getQuantities());
        const breakdown = await cart.getBreakdown();
        await cart.clearCart();
        response.json({ captureData, breakdown });
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
        //let session = request.session.id;
        //console.log(request.sessionStore);
        //console.log(session);//express
        const david = await Customer.findOne({ email: 'underdogv2@hotmail.com' });
        if (david != undefined)
            david.setRights(2);
        var start = undefined;
        var cstate = await Category.find({}, { _id: 1, type: 1, products: 1, order: 1 });
        var org_products = {}
        for (let index in cstate) {
            let data = cstate[index];
            if (start === undefined)
                start = data['_id'];
            org_products[data['_id']] = data;
        }
        cstate = org_products;
        var pstate = await Product.find({}, { _id: 1, title: 1, price: 1, des: 1, image: 1 });
        org_products = {};
        for (let index in pstate) {
            let data = pstate[index];
            org_products[data['_id']] = data;
        }
        pstate = org_products;
        const auth_user = request.user;
        let user = undefined;
        if (auth_user != undefined) {
            user = { email: auth_user.email, name: auth_user.name, phone: auth_user.phone, address: auth_user.address, rights: auth_user.rights, purchases: auth_user.purchases, purchase_quantities: auth_user.purchase_quantities, profileImage: auth_user.profileImage };
            const active = await auth_user.getActiveCart();
            var details = await active.getBreakdown();//this updates the value total quantity value
            var count = active.getCount();
        }
        response.json({ cstate, start, pstate, user, count, details });
    }
    async addToCart(request, response) {
        const id = request.body.id;
        const auth_user = request.user;
        if (auth_user != undefined) {
            const active = await auth_user.getActiveCart();
            await active.addProduct(id, 1);
            const count = active.getCount();
            const details = await active.getBreakdown();
            response.json({ count, details });
        } else
            response.json({ success: false });
    }



    async uploadAdminImage(request, response) {
        if (!request.file) {
            return response.status(401).json({ error: 'Please provide an image' });
        }
        const uploadFile = async (dir, file) => {
            const imagePath = path.join(__dirname, dir);
            const fileUpload = new resize(imagePath);
            const filename = await fileUpload.save(file.buffer);
            return filename;
        }
        const filename = await uploadFile('../client/build/assets', request.file);
        const loc = path.resolve(__dirname, '../client/build/assets/' + filename);
        const dest = path.resolve(__dirname, '../client/public/assets/' + filename);
        await fs.copyFile(loc, dest, (err) => {
            if (err) throw err;
            //console.log('File was copied to destination');
        });
        return response.status(200).json({ name: filename });
    }


    async uploadImage(request, response) {
        const user = request.user;
        if (!request.file) {
            return response.status(401).json({ error: 'Please provide an image' });
        }
        const uploadFile = async (dir, file) => {
            const imagePath = path.join(__dirname, dir);
            const fileUpload = new resize(imagePath);
            const filename = await fileUpload.save(file.buffer);
            return filename;
        }
        const filename = await uploadFile('../client/build/uploads', request.file);
        const loc = path.resolve(__dirname, '../client/build/uploads/' + filename);
        const dest = path.resolve(__dirname, '../client/public/uploads/' + filename);
        fs.copyFile(loc, dest, (err) => {
            if (err) throw err;
            //console.log('File was copied to destination');
        });
        await user.setProfileImage(filename);
        return response.status(200).json({ name: filename });
    }

    async modifyProfile(request, response) {
        const data = request.body.vars;
        const user = request.user;
        if (user != undefined) {
            if (data.name != undefined)
                await user.setName(data.name);
            if (data.email != undefined)
                await user.setEmail(data.email);
            if (data.password != undefined)
                await user.setPassword(data.password);
            if (data.address != undefined)
                await user.setAddress(data.address);
            if (data.phone != undefined)
                await user.setPhone(data.phone);
            response.status(200).json({ success: true })
        } else
            response.status(200).json({ error: "Unauthenticated" });
    }

    async removeFromCart(request, response) {
        const id = request.body.id;
        const auth_user = request.user;
        if (auth_user != undefined) {
            const active = await auth_user.getActiveCart();
            await active.removeProduct(id, 1);
            const count = active.getCount();
            const details = await active.getBreakdown();
            response.json({ count, details });
        } else
            response.json({ success: false });
    }
    logout(request, response) {
        if (request.user != undefined) {
            request.logOut();
            response.status(200).json({ success: true });
        } else {
            response.status(401).json({ success: false });
        }
    }
    login(request, response, next) {
        const { email, password } = request.body;
        let session = request.session.id;
        //console.log(session);//express

        passport.authenticate('local', (err, user, info) => {
            if (err) { return next(err); } //error exception

            // user will be set to false, if not authenticated
            if (!user) {
                response.status(401).json(info); //info contains the error message
            } else {
                // if user authenticated maintain the session
                request.logIn(user, function () {
                    response.status(200).json(info);
                })
            }
        })(request, response, next);
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
                    response.json({ error: true, errorMsg: "This email is being used for another account. Did you forget your password?" });
                } else {
                    bcrypt.hash(password, 10, async (err, hash) => {
                        if (err) throw err;
                        const document = await Store.createCustomer(name, email, hash);
                        const data = { document: [document.name, document.email] }
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
        const authenticated_user = request.user;
        if (authenticated_user == undefined || authenticated_user.rights < 2) {
            return response.sendStatus(403);
        }
        await Category.deleteMany(
            {}
        )
        await Product.deleteMany(
            {}
        )
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

    /* ADMINISTRATION CODE*/
    // return list of categories ids and types
    getCategoriesIds(request, response) {
        const productsMongo = async () => {
            ;
            const categories = await Category.find({}, { type: 1 });
            //console.log(categories);
            response.json(categories);
            //console.log("GET SUCCESS! GET categories and types from mongodb");
        };
        productsMongo();
    }


    // Receives category id and returns products in that category
    async returnCatProducts(request, response) {
        //console.log(request.params);
        //console.log("ID: " + request.params.id + " | Type: " + request.params.type);
        const id = request.params.id;
        const type = request.params.type;
        var products = new Array();
        // if creating a new category
        if (id == "-1") {
            const newCategory = await Store.createCategory(type, []);
            //console.log(newCategory);
            response.send(JSON.stringify({ "id": newCategory }, { "products": [] }));
        } else {
            let productsNum;
            let i = 0;
            let array = new Array();
            const categories = await Category.find({ _id: id }, { products: 1 });
            productsNum = await categories[0].products.length;
            //console.log("Product Numbers: ");
            //console.log(productsNum);

            // if category exists but is empty
            if (productsNum == 0) {
                response.json(JSON.stringify({ "result": [{ "products": [] }, { "id": id }] }))
            } else {
                // if category exists but is not empty
                let mongoCatProd = function () {
                    return Category.find({ _id: id }, { products: 1 })
                }
                let mongoCatProd2 = mongoCatProd();
                //console.log(mongoCatProd);

                mongoCatProd2.then(function (result) {
                    //console.log("what?????");
                    //console.log(result[0].products);
                    productsNum = result[0].products.length;
                    catProdIds(result[0].products);
                })
                const catProdIds = async (array2) => {
                    for (let element of array2) {
                        //console.log(element.valueOf())    
                        let prodID = element.toString();
                        //console.log(typeof prodID + ": " + prodID);
                        let addProd = function () { return Product.find({ _id: prodID }) };
                        let addProd2 = addProd();
                        //console.log(addProd);
                        addProd2.then(function (result) {
                            products.push(result[0]);
                            i++;
                            if (i == productsNum) {
                                //console.log("Getting Category Products: " + id);
                                //console.log("Products are ");
                                //console.log(products);
                                response.json(JSON.stringify({ "result": [{ "products": products }, { "id": id }] }))
                            }
                            //console.log("OUTSIDE-"+ products);
                        })
                    }
                }
            }
        }
    }

    /* Load admin page by getting collection of products from mongodb and sending it to client to load page */
    async loadAdmin(request, response) {
        if (!request.isAuthenticated())
            throw ('Forbidden Function');
        const active = await request.user.getActiveCart();
        var details = await active.getBreakdown();//this updates the value total quantity value
        var count = active.getCount();
        response.status(200).json({ details, count });
    }

    /* Add new product object to mongodb by receiving the new product as JSON */
    async addProduct(request, response) {
        let data = request.body.vars;
        if (data.title && data.desc && Number.isInteger(data.price) && data.image) {
            var product = await Store.createProduct(
                data.title,
                data.desc,
                data.price,
                data.image
            )

            //console.log("Product : -----" + product);
            await Category.updateOne(
                { _id: data.ctg },
                { $push: { products: product } }
            )
            response.send(request.body);
        } else {
            response.send({ error: "Missing essential data" });
        }
    }

    /* Can rearrange layout/order of products by sending an array that contains the order based on the products' id */
    async rearrangeLayout(request, response) {
        response.send(request.body);
        let layout = await Category.updateOne(
            { _id: request.body.curCat },
            {
                $set:
                    { products: request.body.order }
            }
        )
    }
    async sortCat(request, response) {
        response.send(request.body);
        await Category.updateMany(
            {
                $set:
                    { order: request.body.order }
            }
        )

    }

    /* Remove product by receiving the product id from the client and removing it in mongodb */
    async removeProduct(request, response) {
        response.send(request.body);
        let prodID = request.body.id;
        let current = await Product.findOne({ _id: prodID });
        let image = current.getImage();
        const publicp = path.resolve(__dirname, '../client/public/' + image);
        const build = path.resolve(__dirname, '../client/build/' + image);
        fs.unlink(build, (err) => {
            if (err) throw err;
        });
        fs.unlink(publicp, (err) => {
            if (err) throw err;
        });
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
        //console.log("ID: " + request.params.id);
        const product = await Product.find({ _id: id })
        //console.log(product[0])
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
        // _id, title, des, price, image
        var product = request.body.vars;
        var result = await Product.updateMany(
            { _id: product.id },
            {
                $set: {
                    title: product.title,
                    des: product.desc,
                    price: product.price,
                    image: product.image
                }
            }
        )
        response.send(result);

    }

    /* Delete categpry */
    async deleteCategory(request, response) {
        response.send(request.body);
        //console.log("POST SUCCESS! Delete Category!");
        //console.log(request.body.id);
        //console.log(typeof request.body.id);
        const catID = request.body.id;

        const requestedProductId = await Category.findOne({ _id: catID }, { products: 1 });
        //console.log(requestedProductId);
        //console.log(requestedProductId.products.length);

        const length = requestedProductId.products.length;


        if (length == 0) {
            await Category.deleteOne({ _id: catID });
        } else {
            const arrayProd = requestedProductId.products;
            for await (const element of arrayProd) {
                await Product.deleteOne({ _id: element });
            }
            await Category.deleteOne({ _id: catID });
        }

    }

    /*^^^^ ADMINISTRATION CODE ^^^^*/
}
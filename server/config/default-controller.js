import Store from "../models/Store.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Customer from "../models/Customer.js";
import passport from "./passport.js";
import path from 'path';

const __dirname = path.resolve('client/');

export default class Controller {
    getIndex(request, response) {
        console.log(__dirname);
        response.sendFile('index.html', { root: __dirname });
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
            const active = await auth_user.getActiveCart();
            var count = active.getCount();
            var details = await active.getBreakdown();
        }
        response.json({ cstate, pstate, user, count, details });
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
    login(request, response, next) {
        const { email, password } = request.body;
        let session = request.session.id;
        console.log(session);//express

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
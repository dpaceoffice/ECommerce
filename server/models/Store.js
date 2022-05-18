import Product from "./Product.js";
import Category from "./Category.js";
import Cart from "./Cart.js";
import Customer from "./Customer.js";

export default class Store {

  static async createProduct(title, description, price, image) {
    const exists = await Product.find({ title: title });
    if (exists.length > 0) {
      return exists[0];
    }
    let newProduct = new Product({
      title: title,
      des: description,
      price: price,
      image: image
    });
    return await newProduct.save();
  }

  static async createCustomer(name, email, password, rights = 0, carts = undefined, curCart = 0, curCtg = 0, htmlElement = undefined) {
    const exists = await Customer.find({ email: email })
    if (exists.length > 0) {
      return exists[0];
    }
    const cart = await new Cart({
      products: [],
      quantities: {}
    }).save();
    if (carts == undefined)
      carts = [cart];
    let newCustomer = new Customer({
      name: name,
      email: email,
      password: password,
      rights: rights,
      carts: carts,
      curCart: curCart,
      curCtg: curCtg,
      htmlElement: htmlElement//<i class="bi bi-house"></i> Greetings ${this.getName()}!
    });
    return await newCustomer.save();
  }

  static async findCustomer(email) {
    const exists = await Customer.find({ email: email })
    if (exists.length > 0) {
      return exists[0];
    } else
      return undefined
  }
  static async serializeCustomer(id) {
    const exists = await Customer.find({ _id: id })
    if (exists.length > 0) {
      return exists[0];
    } else
      return undefined
  }

  static async createCategory(type, products) {
    const exists = await Category.find({ type: type });
    if (exists.length > 0) {
      return exists[0];
    }
    console.log("New Category: " + type);
    let newCategory = new Category({
      type: type,
      products: products
    });
    return await newCategory.save();
  }
}



import Product from "./Product.js";
import Category from "./Category.js";
import Cart from "./Cart.js";
import Customer from "./Customer.js";
import mongoose from "mongoose";

const Schema = mongoose.Schema;
const storeSchema = new Schema({
  products: [{ type: Schema.ObjectId, ref: 'Product' }],
  categories: [{ type: Schema.ObjectId, ref: 'Category' }],
  customers: [{ type: Schema.ObjectId, ref: 'Customer' }],
})
/**
 * Store Object
 */
class Store {
  /**
   *
   * @returns the customer object
   */
  getCustomers() {
    return this.customers;
  }
  /**
   *
   * @returns all categories
   */
  getCategories() {
    return this.categories;
  }
  /**
   *
   * @param {int} id
   * @returns project object from id
   */
  getProduct(id) {
    return this.products[id];
  }
  /**
   * 
   * @returns product ids in store
   */
  allProducts() {
    return this.products;
  }

  async addProduct(product) {
    if (!(this.products.includes(product['_id'])))
      this.products.push(product);
    return await this.save();
  }
  async addCategory(category) {
    if (!(this.categories.includes(category['_id'])))
      this.categories.push(category);
    return await this.save();
  }
  async createProduct(title, description, price, image) {
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
  async createCategory(type, products) {
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

storeSchema.loadClass(Store);
export default mongoose.model('Store', storeSchema);


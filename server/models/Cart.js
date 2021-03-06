import mongoose from "mongoose";
import Store from "./Store.js";
const Schema = mongoose.Schema;
/**
 * Initilizes the cart object
 * @param {Dictionary<productSchemas>} products
 */
const cartSchema = new Schema({
  products: [{
    type: Schema.ObjectId,
    ref: 'Product',
  }],
  quantities: { type: Map, of: Number, default: {} },
  totalQuantity: {
    type: Number,
    default: 0
  }
});


/**
 * Cart object
 */
class Cart {
  /**
   * Clears the shopping cart
   */
  async clearCart() {
    this.products = [];
    this.quantities = [];
    await this.save();
  }
  /**
   *
   * @returns map of products and their quantities
   */
  getProducts() {
    return this.products;
  }
  /**
   *
   * @returns map of products and their quantities
   */
  getQuantity(id) {
    return this.quantities.get(id);
  }
  /**
   *
   * @returns map of products and their quantities
   */
  getQuantities() {
    return this.quantities;
  }
  /**
   * Adds product to map
   * @param {Product} product
   * @param {int} quantity
   */
  async addProduct(product, quantity) {
    let products = this.getProducts();
    let quantities = this.getQuantities();

    product = await Store.findProduct(product);
    let total = quantity;
    if (!(products.includes(product['_id'])))
      products.push(product);
    else
      total += this.getQuantity(product['_id']);
    quantities.set(product['_id'], total);
    this.totalQuantity += quantity;
    await this.save();
  }
  /**
   * Removes product or modifies its quantity in map
   * @param {Product} product
   * @param {int} quantity
   */
  async removeProduct(product, quantity) {
    let products = this.getProducts();
    let quantities = this.getQuantities();
    product = await Store.findProduct(product);
    const index = products.indexOf(product['_id']);
    if (index > -1) {
      const cur_q = this.getQuantity(product['_id']);
      if (cur_q <= quantity) {
        quantities.delete(product['_id']);
        products.splice(index, 1); // 2nd parameter means remove one item only
        this.totalQuantity -= cur_q;
      } else {
        quantities.set(product['_id'], cur_q - quantity);
        this.totalQuantity -= quantity;
      }
      await this.save();
    }
  }
  /**
   *
   * @returns number of items in cart
   */
  getCount() {
    return this.totalQuantity;
  }

  /**
   * Breakdown of all products in the cart
   * @returns allProducts, totalCost
   */
  async getBreakdown() {
    let allProducts = [];
    let totalCost = 0;
    const dollarUS = Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
    let tot_count = 0;
    //console.log("NEW LOOP");
    let removal = []
    for (let id of this.products) {
      const product = await Store.findProduct(id);
      if (product != undefined) {
        id = product['_id'];
        const quantity = this.getQuantity(id);
        const title = product.title;
        const price = dollarUS.format(product.price);
        totalCost += product.price * quantity;
        //tot_count += quantity;
        tot_count += quantity;
        //console.log("" + id + " seen.. quantity: " + quantity + " new total quantitiy: " + tot_count);
        allProducts.push({ id, title, price, quantity });
      } else {
        removal.push(id);
        //console.log("Undefined: " + id + " removed.. quantity: " + cur_q + " new total quantitiy: " + tot_count);
        continue;
      }
    }
    for (let index in removal) {
      let product = removal[index];
      this.products.splice(product, 1);
      this.quantities.delete(product);
    }
    this.totalQuantity = tot_count;
    await this.save();
    totalCost = dollarUS.format(totalCost);
    return { allProducts, totalCost };
  }
}
cartSchema.loadClass(Cart);
export default mongoose.model('Cart', cartSchema);

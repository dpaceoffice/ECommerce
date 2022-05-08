import mongoose from "mongoose";

const Schema = mongoose.Schema;
/**
 * Initilizes the cart object
 * @param {Dictionary<productSchemas>} products
 */
const cartSchema = new Schema({
  products: [{ type: Schema.ObjectId, ref: 'Product' }],
  totalQuantity: Number,

});


/**
 * Cart object
 */
class Cart {

  /**
   *
   * @returns map of products and their quantities
   */
  getProducts() {
    return this.products;
  }
  /**
   * Adds product to map
   * @param {Product} product
   * @param {int} quantity
   */
  addProduct(product, quantity) {
    if (this.getProducts().has(product)) {
      var prevQ = this.products.get(product);
      this.products.set(product, prevQ + quantity);
    } else {
      this.products.set(product, quantity);
    }
    this.totalQuantity += quantity;
  }
  /**
   * Removes product or modifies its quantity in map
   * @param {Product} product
   * @param {int} quantity
   */
  removeProduct(product, quantity) {
    if (this.getProducts().has(product)) {
      var curQ = this.products.get(product);
      if (curQ <= quantity) {
        this.totalQuantity -= curQ;
        this.products.delete(product);
      } else {
        this.totalQuantity -= quantity;
        this.products.set(product, curQ - quantity);
      }
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
   *
   * @returns string html element for checkout button
   */
  getCheckoutHtml() {
    if (this.getCount() > 0)
      return `<i id='checkout-button' class="bi bi-cart"> </i>Checkout - ${this.getCount()}`;
    else return `<i id='checkout-button' class="bi bi-cart"> </i>Checkout`;
  }
  /**
   *
   * @returns string html for shopping cart overview
   */
  getHtmlElement() {
    const dollarUS = Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
    let total = 0.0;
    let body = `<p>The shopping cart is currently empty</p>`;
    if (this.products.size > 0) {
      body = ``;
      for (const [product, quantity] of this.products) {
        body += `<p>${product.getTitle()} - ${dollarUS.format(
          product.getPrice()
        )} x ${quantity} <button type="button" class="btn btn-sm btn-danger" id="rmfromcart" product_number=${product.getID()}>Remove</button></p>`;
        total += product.getPrice() * quantity;
      }
    }
    total = `Total Cost: ${dollarUS.format(total)}`;
    return [body, total];
  }
}
cartSchema.loadClass(Cart);
export default mongoose.model('Cart', cartSchema);

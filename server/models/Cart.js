/**
 * Cart object
 */
export default class Cart {
  #products; //map of product and their quantities
  #totalQuantity; //Keep track of total amount of products so we dont have to scan for it
  #cartID = -1; //INT cart instance ID
  #dollarUS; // US dollar number formatter
  /**
   * Initilizes the cart object
   * @param {int} cartID
   * @param {Map<Product,int>} products
   */
  constructor(cartID, products = new Map()) {
    this.#cartID = cartID;
    this.#products = products;
    this.#totalQuantity = 0;
    this.#dollarUS = Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  /**
   *
   * @returns map of products and their quantities
   */
  getProducts() {
    return this.#products;
  }

  /**
   * Adds product to map
   * @param {Product} product
   * @param {int} quantity
   */
  addProduct(product, quantity) {
    if (this.getProducts().has(product)) {
      var prevQ = this.#products.get(product);
      this.#products.set(product, prevQ + quantity);
    } else {
      this.#products.set(product, quantity);
    }
    this.#totalQuantity += quantity;
  }
  /**
   * Removes product or modifies its quantity in map
   * @param {Product} product
   * @param {int} quantity
   */
  removeProduct(product, quantity) {
    if (this.getProducts().has(product)) {
      var curQ = this.#products.get(product);
      if (curQ <= quantity) {
        this.#totalQuantity -= curQ;
        this.#products.delete(product);
      } else {
        this.#totalQuantity -= quantity;
        this.#products.set(product, curQ - quantity);
      }
    }
  }
  /**
   *
   * @returns number of items in cart
   */
  getCount() {
    return this.#totalQuantity;
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
    let total = 0.0;
    let body = `<p>The shopping cart is currently empty</p>`;
    if (this.#products.size > 0) {
      body = ``;
      for (const [product, quantity] of this.#products) {
        body += `<p>${product.getTitle()} - ${this.#dollarUS.format(
          product.getPrice()
        )} x ${quantity} <button type="button" class="btn btn-sm btn-danger" id="rmfromcart" product_number=${product.getID()}>Remove</button></p>`;
        total += product.getPrice() * quantity;
      }
    }
    total = `Total Cost: ${this.#dollarUS.format(total)}`;
    return [body, total];
  }
}

import Product from "./Product.js";
import Category from "./Category.js";
import Cart from "./Cart.js";
import Customer from "./Customer.js";

/**
 * Store Object
 */
class Store {
  #curCtg = -1; //int current category id being viewed
  #categories = {}; //dictionary of categories
  #products = new Map(); //map of products
  #customer; //Customer object for the customer
  /**
   * Initilizes the store
   */
  constructor() {
    var products = {};
    let katana = new Product(
      0,
      "Katana",
      "A very very sharp sword used by samurai",
      5.0,
      "assets/katana.png"
    );
    products[katana.getID()] = katana;
    this.#products.set(katana.getID(), katana);

    let gs = new Product(
      1,
      "Great Sword",
      "A great sword, used by the largest men",
      25.0,
      "assets/greatsword.png"
    );
    products[gs.getID()] = gs;
    this.#products.set(gs.getID(), gs);

    let cat = new Category(0, "Swords", products);
    this.#categories[cat.getID()] = cat;

    products = {};

    let crossbow = new Product(
      2,
      "Crossbow",
      "A ranged weapon using an elastic launching device consisting of a bow-like assembly called a prod, mounted horizontally on a main frame called a tiller",
      3.3,
      "assets/crossbow.png"
    );
    products[crossbow.getID()] = crossbow;
    this.#products.set(crossbow.getID(), crossbow);

    let longbow = new Product(
      3,
      "Longbow",
      "A type of tall bow that makes a fairly long draw possible",
      25.0,
      "assets/longbow.png"
    );
    products[longbow.getID()] = longbow;
    this.#products.set(longbow.getID(), longbow);

    let cat2 = new Category(1, "Bows", products);
    this.#categories[cat2.getID()] = cat2;
    let cat3 = new Category(2, "Axes", {});
    this.#categories[cat3.getID()] = cat3;
    this.#curCtg = 0;

    let cart = new Cart(0);
    let carts = [];
    carts.push(cart);
    let customer = new Customer(0, "David", "Whatever", carts);
    this.#customer = customer;
    this.createStoreFront();
  }
  /**
   *
   * @returns the customer object
   */
  getCustomer() {
    return this.#customer;
  }
  /**
   *
   * @returns current viewed category ID
   */
  getCurrentCategory() {
    return this.#curCtg;
  }
  /**
   * Sets the current category to int
   * @param {int} id
   *
   */
  setCurrentCategory(id) {
    this.#curCtg = id;
  }
  /**
   *
   * @param {int} id
   * @returns project object from id
   */
  getProduct(id) {
    return this.#products.get(id);
  }
  /**
   * Time and Space complexity: O(2n)
   */
  createStoreFront() {
    const categories = this.#categories;
    const category = categories[this.getCurrentCategory()];
    const products = category.getProducts();
    document.getElementById("categories-container").innerHTML = "";
    document.getElementById("products-container").innerHTML = "";
    document.getElementById("home").innerHTML = this.getCustomer().getHtml();
    for (const category in categories) {
      document.getElementById("categories-container").innerHTML +=
        categories[category].getHtmlElement();
    }
    for (const product in products) {
      document.getElementById("products-container").innerHTML +=
        products[product].getHtmlElement();
    }
  }
  /**
   * Updates the shopping cart frontend
   */
  updateShoppingCart() {
    let [body, total] = this.getCustomer().getActiveCart().getHtmlElement();
    document.getElementById("checkout").innerHTML = this.getCustomer()
      .getActiveCart()
      .getCheckoutHtml();
    document.getElementById("cart-body").innerHTML = body;
    document.getElementById("cost-label").innerHTML = total;
    //console.log(this.getCustomer().getActiveCart().getHtmlElement());
  }
}

const store = new Store(); //Create an instance of store, store componenet objects are temporarily, statically declared until persistant data is configured.
/**
 * Renders category given the category's id
 * @param {int} category_id
 */
window.setActiveCat = (category_id) => {
  store.setCurrentCategory(category_id);
  store.createStoreFront();
};
/**
 * Adds a product with id to the cart
 * @param {int} product_id
 */
window.addToCart = (product_id) => {
  store
    .getCustomer()
    .getActiveCart()
    .addProduct(store.getProduct(product_id), 1);
  store.updateShoppingCart();
};
/**
 * Removes a product with id from the cart
 * @param {int} product_id
 */
window.removeFromCart = (product_id) => {
  store
    .getCustomer()
    .getActiveCart()
    .removeProduct(store.getProduct(product_id), 1);
  store.updateShoppingCart();
};

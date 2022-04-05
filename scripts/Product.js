/**
 * Product Object
 */
export default class Product {
  #productID; //INT value to refer to product
  #title; //String title of product
  #des; //String description of product
  #price; //double price of product
  #image; //string path to image of product
  #htmlElement; //String html element
  #dollarUS; //US dollar formatter

  /**
   * Constructs the object
   * @param {int} productID
   * @param {String} title
   * @param {String} des
   * @param {double} price
   * @param {String} image
   */
  constructor(productID, title, des, price, image) {
    this.#productID = productID;
    this.#title = title;
    this.#des = des;
    this.#price = price;
    this.#image = image;
    this.#dollarUS = Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
    this.#htmlElement =
      `<div class="col"><div class="card mb-1" style="width: 18rem;">
        <img class="card-img-top" src="` +
      this.getImage() +
      `" alt="` +
      this.getTitle() +
      `">
            <div class="card-body">
                <h5 class="card-title">` +
      this.getTitle() +
      `</h5>
                <p class="card-text">` +
      this.getDescription() +
      `</p>
                <p class="card-text">` +
      this.#dollarUS.format(this.getPrice()) +
      `</p>
                <a class="btn btn-primary" onclick="addToCart(${productID})">Add to Cart</a>
            </div>
    </div></div>`;
  }
  /**
   *
   * @returns int ID of product
   */
  getID() {
    return this.#productID;
  }
  /**
   *
   * @returns string image of product
   */
  getImage() {
    return this.#image;
  }
  /**
   *
   * @returns String title of product
   */
  getTitle() {
    return this.#title;
  }
  /**
   *
   * @returns String description of product
   */
  getDescription() {
    return this.#des;
  }
  /**
   *
   * @returns double price in US dollar format
   */
  getPrice() {
    return this.#price;
  }
  /**
   *
   * @returns String html element for product
   */
  getHtmlElement() {
    return this.#htmlElement;
  }
}

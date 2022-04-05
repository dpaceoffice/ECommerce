/**
 * Category Object
 */
export default class Category {
  #type; //String describing category
  #products; //Array of products owned by category
  #htmlElement; //String containing category html
  #category_id; //int of categories id

  /**
   * Initalize the object
   * @param {int} category_id
   * @param {String} type
   * @param {Array<Product>} products
   */
  constructor(category_id, type, products) {
    this.#category_id = category_id;
    this.#type = type;
    this.#products = products;
    this.#htmlElement =
      `<li id="cat_id-${category_id}" class="btn list-group-item" onclick='setActiveCat(${category_id})'>` +
      this.getType() +
      `</li>`;
  }

  /**
   * Category string name
   * @returns The category name
   */
  getType() {
    return this.#type;
  }
  /**
   * array [] type of product objects
   * @returns Array of products in category
   */
  getProducts() {
    return this.#products;
  }
  /**
   * String type
   * @returns HTML element string
   */
  getHtmlElement() {
    return this.#htmlElement;
  }
  /**
   * int type most important for normalization
   * @returns Category id
   */
  getID() {
    return this.#category_id;
  }
}

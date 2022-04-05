/**
 * Customer Object
 */
export default class Customer {
  #customerID; //INT ID of customer
  #name; //Name of customer
  #email; //Email of customer
  #carts; //Array of shopping carts customer has
  #curCart = -1; //Current ID of active cart being used
  #htmlElement;
  /**
   * Create the object
   * @param {int} customerID
   * @param {String} name
   * @param {String} email
   * @param {Array<Cart>} carts
   */
  constructor(customerID, name, email, carts) {
    this.#customerID = customerID;
    this.#name = name;
    this.#email = email;
    this.#carts = carts;
    this.#curCart = 0;
    this.#htmlElement = `<i class="bi bi-house"></i> Greetings ${this.getName()}!`;
  }
  /**
   * Gets the cart's id
   * @returns Active cart id
   */
  getActiveCart() {
    return this.#carts[this.#curCart];
  }
  /**
   * Get the private string name
   * @returns String name of client
   */
  getName() {
    return this.#name;
  }
  /**
   * Prints name of client to welcome them
   * @returns html element used by client
   */
  getHtml() {
    return this.#htmlElement;
  }
}

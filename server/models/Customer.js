import mongoose from "mongoose";
import Cart from "./Cart.js";
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  rights: Number,
  carts: [{ type: Schema.ObjectId, ref: 'Cart' }],
  curCart: Number,
  curCtg: Number,
  htmlElement: String//`<i class="bi bi-house"></i> Greetings ${this.getName()}!`
});

/**
 * Customer Object
 */
class Customer {
  getCarts() {
    return this.carts;
  }
  /**
   * Gets the cart's id
   * @returns Active cart id
   */
  async getActiveCart() {
    let id = this.carts[this.curCart];
    return await Cart.findOne({ _id: id });
  }
  /**
   * Get the private string name
   * @returns String name of client
   */
  getName() {
    return this.name;
  }
  /**
   * Prints name of client to welcome them
   * @returns html element used by client
   */
  getHtml() {
    return `<i class="bi bi-house"></i> Greetings ${this.getName()}!`;
  }
  /**
   * Sets the current category to int
   * @param {int} id
   *
   */
  setCurrentCategory(id) {
    this.curCtg = id;
  }
  /**
   * Temporary
   * @returns password
   */
  getPassword() {
    return this.password;
  }
}

userSchema.loadClass(Customer);
export default mongoose.model('Customer', userSchema);
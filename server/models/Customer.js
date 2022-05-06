import mongoose from "mongoose";
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: String,
  email: String,
  carts: { type: Array, "default": [] },
  curCart: Number,
  htmlElement: String//`<i class="bi bi-house"></i> Greetings ${this.getName()}!`
});

/**
 * Customer Object
 */
class Customer {
  /**
   * Gets the cart's id
   * @returns Active cart id
   */
  getActiveCart() {
    return this.carts[this.curCart];
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
}

userSchema.loadClass(Customer);
export default mongoose.model('Customer', userSchema);
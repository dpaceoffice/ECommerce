import mongoose from "mongoose";
import Cart from "./Cart.js";
import Store from "./Store.js";
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  rights: Number,
  phone: {
    type: String,
    default: '(000) 000-0000'
  },
  address: {
    type: String,
    default: 'ST, CITY, STATE'
  },
  carts: [{ type: Schema.ObjectId, ref: 'Cart' }],
  curCart: Number,
  curCtg: Number,
  profileImage: String,
  purchases: [{ type: Schema.ObjectId, ref: 'Product' }],
  purchase_quantities: { type: Map, of: Number, default: {} },
  htmlElement: String//`<i class="bi bi-house"></i> Greetings ${this.getName()}!`
});

/**
 * Customer Object
 */
class Customer {
  getCarts() {
    return this.carts;
  }
  async setProfileImage(image) {
    this.profileImage = image;
    await this.save();
  }
  async setName(name) {
    this.name = name;
    await this.save();
  }
  async setAddress(address) {
    this.address = address;
    await this.save();
  }
  async setPurchases(purchases) {
    this.purchases = purchases;
    await this.save();
  }
  async addPurchases(purchases, quantities) {
    for (let i in purchases) {
      const id = purchases[i];
      const product = await Store.findProduct(id);
      if (!this.purchase_quantities.has(id.toString())) {
        this.purchases.push(product);
        this.purchase_quantities.set(id, quantities.get(id));
      } else
        this.purchase_quantities.set(id, this.purchase_quantities.get(id) + quantities.get(id));
    }
    await this.save();
  }
  async setPhone(phone) {
    this.phone = phone;
    await this.save();
  }
  async setEmail(email) {
    this.email = email;
    await this.save();
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

  async setRights(rights) {
    this.rights = rights
    await this.save();
  }
}

userSchema.loadClass(Customer);
export default mongoose.model('Customer', userSchema);
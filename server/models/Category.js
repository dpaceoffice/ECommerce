import mongoose from "mongoose";

const Schema = mongoose.Schema;
/**
 * Initalize the object
 * @param {String} type
 * @param {Dictionary<productSchemas>} products
 */
const categorySchema = new Schema({
  type: String,
  products: [{ type: Schema.ObjectId, ref: 'Product' }],
});
/**
 * Category Object
 */
class Category {
  #type; //String describing category
  #products; //Array of products owned by category
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
   * int type most important for normalization
   * @returns Category id
   */
  getID() {
    return this.#category_id;
  }
}
categorySchema.loadClass(Cart);
export default mongoose.model('Category', categorySchema);

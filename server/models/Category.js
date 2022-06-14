import mongoose from "mongoose";

const Schema = mongoose.Schema;
/**
 * Initalize the object
 * @param {String} type
 * @param {Dictionary<productSchemas>} products
 */
const categorySchema = new Schema({
  type: String,
  order: [{ type: Schema.ObjectId, ref: 'Category' }],
  products: [{ type: Schema.ObjectId, ref: 'Product' }],
});
/**
 * Category Object
 */
class Category {
  getOrder() {
    return this.order;
  }
  /**
   * Category string name
   * @returns The category name
   */
  getType() {
    return this.type;

  }
  /**
   * array [] type of product objects
   * @returns Array of products in category
   */
  getProducts() {
    return this.products;
  }

  /**
   * int type most important for normalization
   * @returns Category id
   */
  getID() {
    return this._id;
  }

}
categorySchema.loadClass(Category);
export default mongoose.model('Category', categorySchema);

import mongoose from "mongoose";

const Schema = mongoose.Schema;
const productSchema = new Schema({
    title: String,//String title of product
    des: String,//String description of product
    price: Number,//double price of product
    image: String//string path to image of product
});
/**
 * Product Object
 */
class Product {
    /**
     *
     * @returns int ID of product
     */
    getID() {
        return this._id;
    }
    /**
     *
     * @returns string image of product
     */
    getImage() {
        return this.image;
    }
    /**
     *
     * @returns String title of product
     */
    getTitle() {
        return this.title;
    }
    /**
     *
     * @returns String description of product
     */
    getDescription() {
        return this.des;
    }
    /**
     *
     * @returns double price in US dollar format
     */
    getPrice() {
        return this.price;
    }
}
productSchema.loadClass(Product);
export default mongoose.model('Product', productSchema);

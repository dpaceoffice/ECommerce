/**
 * Product Object
 */
export default class Product {
    #productID; //INT value to refer to product
    #title; //String title of product
    #des; //String description of product
    #price; //double price of product
    #image; //string path to image of product

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
}

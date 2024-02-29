'use strict'

const { BadRequestError } = require("../core/error.response")
const { product, clothing, electronic, furniture } = require("../models/product.model")

class ProductFactory {
    static productRegistery = {};
    static registryProductType(type, classRef) {
        ProductFactory.productRegistery[type] = classRef;
    }
    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistery[type];
        if (!productClass) {
            return new BadRequestError(`Invalid product type:: ${type}`)
        }
        return new productClass(payload).createProduct();
    
    }
}

class Product {
    constructor(
       { 
        product_name,
        product_thumb,
        product_description,
        product_number,
        product_quantity,
        product_type,
        product_shop,
        product_attributes
    }
    ) {
        this.product_thumb = product_thumb,
        this.product_name = product_name,
        this.product_description = product_description,
        this.product_number = product_number,
        this.product_quantity = product_quantity,
        this.product_type = product_type,
        this.product_shop = product_shop,
        this.product_attributes = product_attributes
    }
    async createProduct(product_id) {
        return await product.create({...this, _id: product_id})
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newClothing) throw new BadRequestError('Create new clothing error!') 
        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) {
            throw new BadRequestError('Create new product error!') 
        }
        return newProduct;
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newElectronic) throw new BadRequestError('Create new electric error!') 
        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) {
            throw new BadRequestError('Create new product error!') 
        }
        return newProduct;
    }
}
class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newFurniture) throw new BadRequestError('Create new funiture error!') 
        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) {
            throw new BadRequestError('Create new product error!') 
        }
        return newProduct;
    }
}


ProductFactory.registryProductType('Clothing', Clothing);
ProductFactory.registryProductType('Electronics', Electronic);
ProductFactory.registryProductType('Furniture', Furniture);

module.exports = ProductFactory
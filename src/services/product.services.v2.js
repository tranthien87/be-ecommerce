'use strict'

const { BadRequestError } = require("../core/error.response")
const { product, clothing, electronic, furniture } = require("../models/product.model")
const { findAllDraftsForShop, 
    publicProductByShop,
    findAllPublicForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProductById,
    updateProductById
 } = require('../models/repositories/product.repo')
 const {removeUndefineObject, updateNestedObjectParser} = require('../utils')

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
    static async updateProduct(type, productId, payload) {
        console.log('payload', payload)
        const productClass = ProductFactory.productRegistery[type];
        if (!productClass) {
            return new BadRequestError(`Invalid product type:: ${type}`)
        }
        return new productClass(payload).updateProduct(productId);
    }

    // QUERY //
    static async getProductsDraftByShop({product_shop, limit = 50, skip = 0}) {
        const query = { product_shop, isDraft: true};
        return await findAllDraftsForShop({ query, limit, skip})
    }

    static async getProductsPublicByShop({product_shop, limit = 50, skip = 0}) {
        const query = { product_shop, isPublish: true};
        return await findAllPublicForShop({ query, limit, skip})
    }

    static async searchProductByUser({keySearch}) {
        return await searchProductByUser({keySearch})
    }

    static async findAllProducts({page = 1, limit = 50, sort = 'ctime', filters = { isPublish: true}, select}) {
        return await findAllProducts({page, limit, sort, filters, select: ['product_name', 'product_price', 'product_thumb']})
    }

    static async findProduct({product_id, }) {
        return await findProductById({product_id, unSelect: ['__v', 'product_variations']})
    }
    // END QUERY //


    // PUT //
    static async publicDraftProductByShop({product_shop, product_id}) {
        return await publicProductByShop({product_shop, product_id})
    }
    static async unPublicProductByShop({product_shop, product_id}) {
        return await unPublishProductByShop({product_shop, product_id})
    }
    // END PUT //
}

class Product {
    constructor(
       { 
        product_name,
        product_thumb,
        product_description,
        product_slug,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes,
        product_variations,
        product_ratingAverage,
        isDraft,
        isPublish

    }
    ) {
        this.product_thumb = product_thumb,
        this.product_name = product_name,
        this.product_slug = product_slug,
        this.product_description = product_description,
        this.product_price = product_price,
        this.product_quantity = product_quantity,
        this.product_type = product_type,
        this.product_shop = product_shop,
        this.product_attributes = product_attributes,
        this.product_variations = product_variations,
        this.product_ratingAverage = product_ratingAverage,
        this.isDraft = isDraft,
        this.isPublish = isPublish
    }
    async createProduct(product_id) {
        return await product.create({...this, _id: product_id})
    }
    async updateProduct(productId, objParams) {
        return await updateProductById({productId, objParams, model: product});
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

    async updateProduct(productId) {
       
        const objParams = removeUndefineObject(this);

        if (objParams.product_attributes) {
             await updateProductById({productId,objParams: updateNestedObjectParser(objParams.product_attributes), model: clothing});
        }
        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objParams));
        return updateProduct;
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
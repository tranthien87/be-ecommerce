'use strict'
const {cart} = require('../../models/cart.model');
const { convertToObjectIdMongo } = require('../../utils')

const findCartById= async ({id}) => {
    return await cart.findOne({_id: convertToObjectIdMongo(id), cart_state: 'active'}).lean()
}


module.exports = { findCartById }
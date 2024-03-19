'use strict'
const {unGetSelectData, getSelectData, convertToObjectIdMongo} = require('../../utils');

const checkDiscountCodeExit = async ({model, filter}) => {
    return await model.findOne(filter).lean();
}

const findAllDiscountCodeUnSelect = async ({
    limit = 50, page = 1, filters , model, sort = 'ctime', unSelect
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? {sort: -1} : {sort: 1};
    const result = await model.find(filters)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean()

    return result;
}
const findAllDiscountCodeSelect = async ({
    limit = 50, page = 1, filters , model, sort = 'ctime', select
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? {sort: -1} : {sort: 1};
    const result = await model.find(filters)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

    return result;
}

module.exports ={
    findAllDiscountCodeUnSelect ,
    findAllDiscountCodeSelect,
    checkDiscountCodeExit
}
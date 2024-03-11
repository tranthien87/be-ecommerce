'use strict'

const _ = require('lodash')

const getInfoData = ({ fields = [], object = {}}) => {
    return _.pick(object, fields)
}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}
const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefineObject = (obj) => {
    Object.keys(obj).map(k => {
        if (obj[k] === null || obj[k] === undefined) {
            delete obj[k];
        }
    })
    return obj;
}
const updateNestedObjectParser = obj => {
   
    let final = {};
    Object.keys(obj).map(k => {
        if(typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
            const response = updateNestedObjectParser(obj[k]);
        
            Object.keys(response).map(a => {
                final[`${k}.${a}`] = response[a];
            })
        } else {
            final[k] = obj[k]
        }
    })
   
    return final;
}

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefineObject,
    updateNestedObjectParser
}
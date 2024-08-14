'use strict'

const _ = require('lodash')
const {Types} = require('mongoose')

const convertToObjectIdMongo = id => new Types.ObjectId(id);

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
const updateNestedObjectParser = object => {
    let obj = removeUndefineObject(object);
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


const replacePlaceholder = (template , params) =>{ 
    Object.keys(params).forEach((k) => {
        const placeHolder = `{{${k}}}`;
        template = template.replace(new RegExp(placeHolder, 'g'), params[k])
        console.log(new RegExp(placeHolder, 'g'));
        
    })
    return template;
}


module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefineObject,
    updateNestedObjectParser,
    convertToObjectIdMongo,
    replacePlaceholder
}
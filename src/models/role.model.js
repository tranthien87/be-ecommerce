'use strict'

const { Schema, model } = require('mongoose');
const COLLECTION_NAME = 'Roles';
const DOCUMENT_NAME = 'Role';


// let grantList = [
//     { role: 'admin', resource: 'video', action: 'create:any', attributes: '*, !views' },
//     { role: 'admin', resource: 'video', action: 'read:any', attributes: '*' },
//     { role: 'admin', resource: 'video', action: 'update:any', attributes: '*, !views' },
//     { role: 'admin', resource: 'video', action: 'delete:any', attributes: '*' },
 
//     { role: 'user', resource: 'video', action: 'create:own', attributes: '*, !rating, !views' },
//     { role: 'user', resource: 'video', action: 'read:any', attributes: '*' },
//     { role: 'user', resource: 'video', action: 'update:own', attributes: '*, !rating, !views' },
//     { role: 'user', resource: 'video', action: 'delete:own', attributes: '*' }
// ];
// const ac = new AccessControl(grantList);

const roleSchema = new Schema({
    role_name: {type: String, default: 'user', enum: ['user', 'shop', 'admin']},
    role_slug: {type: String, require: true},
    role_status: { type: String, default: 'active', enum: ['active', 'pending', 'block']},
    role_description: {type: String, default: ''},
    role_grants: [{
        resource: {type: Schema.Types.ObjectId, ref: 'Resource', require: true},
        actions: [{ type: String, require: true}],
        attributes: {type: String, default: '*'}
    }]
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports =  model(DOCUMENT_NAME, roleSchema)
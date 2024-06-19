'use strict'
const RESOURCE = require('../models/resource.model')
const ROLE = require('../models/role.model')


const createResource = async ({name, slug, description}) => {
  try {
      // check the resource is already create

    // create new resource
    const resource = await RESOURCE.create({
        resc_name: name,
        resc_slug: slug,
        resc_description: description
    });
    return resource;
  } catch (error) {
    return error;
  }
}

const getResourceList = async ({userId, limit = 30, offset = 0, search = []}) => {
    try {
        // check user is admin ?

        // if is admin, return list resource
        const resources = await RESOURCE.aggregate([{
            $project: {
                _id: 0,
                name: '$resc_name',
                slug: '$resc_slug',
                description: '$resc_description',
                resourceId: '$_id',
                createdAt: 1
            }
        }])
    
        return resources;

    } catch (error) {
        return [];
    }
}


const createRole = async ({
    name = 'shop',
    slug = 'r0001',
    description = 'shop role',
    grants = []
}) => {
    try {
        // check role is exit

        // create new role

        const role = await ROLE.create({
            role_name: name,
            role_slug: slug,
            role_description: description,
            role_grants: grants
        })
        return role;
    } catch (error) {
        return error;
    }
}

const getRoleList = async ({userId = 0, limit = 30, offset = 0, search = ''}) => {
    try {
        // check userId

        // get role list
        // const roles = await ROLE.find();
        const roles = await ROLE.aggregate([
            {
                $unwind: "$role_grants"
            },
            {
                $lookup: {
                    from: "Resources",
                    localField: "role_grants.resource",
                    foreignField: "_id",
                    as: "resource"
                }
            },
            {
                $unwind: "$resource"
            }, 
            {
                $project: {
                    _id: 0,
                    role: "$role_name",
                    resource: "$resource.resc_name",
                    action: "$role_grants.actions",
                    attributes: "$role_grants.attributes"
                }
            },
            {
                $unwind: "$action"
            }
        ])

        return roles;
        
    } catch (error) {
        return error;
    }
}


module.exports = {
    createResource, 
    createRole, 
    getResourceList, 
    getRoleList
}
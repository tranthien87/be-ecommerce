'use strict'

const { AuthFailueError } = require("../core/error.response");
const { getRoleList } = require("../services/rbac.services");
const { rbac } = require("./role.middlewares");

/****
 *
 * 
 * @param string action : read, update and delete
 * @param * resouce : profile ....
 * 
 * 
 * ***/  
const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            rbac.setGrants(await getRoleList({userId: 9999}))
            const role_name = req.query.role;
            const permission = rbac.can(role_name)[action](resource);
            if (!permission.granted) {
                throw new AuthFailueError('You dont have the permission')
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}

module.exports = { grantAccess}
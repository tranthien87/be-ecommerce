'use strict'

const { StatusCodes } = require("http-status-codes")
const { SuccessResponse } = require("../core/success.response")
const { createRole, createResource, getRoleList, getResourceList } = require("../services/rbac.services")


const newRole = async (req, res, next) => {
    return new SuccessResponse({
        message: "Created new role successfull",
        statusCode: StatusCodes.OK,
        metadata: await createRole(req.body)
    }).send(res);
}

const newResource = async (req, res, next) => {
    return new SuccessResponse({
        message: "Created new resource successfull",
        statusCode: StatusCodes.OK,
        metadata: await createResource(req.body)
    }).send(res);
}

const getRoles = async (req, res, next) => {
    return new SuccessResponse({
        message: "Get roles successfull",
        statusCode: StatusCodes.OK,
        metadata: await getRoleList(req.query)
    }).send(res);
}

const getResources = async (req, res, next) => {
    return new SuccessResponse({
        message: "Get resources successfull",
        statusCode: StatusCodes.OK,
        metadata: await getResourceList(req.query)
    }).send(res);
}


module.exports = {
    newRole, newResource, getRoles, getResources
}
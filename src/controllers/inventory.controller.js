'use strict'
const { StatusCodes } = require("http-status-codes");
const InventoryService = require("../services/inventory.services");
const {SuccessResponse} = require('../core/success.response');


class InventoryController {
    
    addStock = async (req, res, next) => {
        return new SuccessResponse({
            message: "Successfull checkout review",
            statusCode: StatusCodes.OK,
            metadata: await InventoryService.addStockToInventory(req.body)
        }).send(res)
    }

  
}

module.exports = new InventoryController()
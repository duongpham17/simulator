import { NextFunction, Response } from 'express';
import { asyncBlock, appError } from '../@utils/helper';
import { InjectUserToRequest } from '../@types/models';

import Orders from '../model/orders';

export const orders = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {

    const environment = req.params.environment === "live" ? true : false;
    
    const data = await Orders.find({user: req.user._id, live: environment});
    
    if(!data) return new appError("Could not get data", 400);
    
    res.status(200).json({
        status: "success",
        data
    });

});

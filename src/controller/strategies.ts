import { NextFunction, Response } from 'express';
import { kucoin } from '../@api/kucoin';
import { InjectUserToRequest } from '../@types/models';
import { asyncBlock, appError } from '../@utils/helper';
import { encrypt } from '../@utils/encryption';

import Strategies from '../model/strategies';

export const strategies = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {
    
    const s = await Strategies.find({user: req.user._id});
    
    if(!s) return new appError("Could not get data", 400);
    
    res.status(200).json({
        status: "success",
        data: s
    });

});

export const strategy = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {
    
    const s = await Strategies.findById(req.params.id);
    
    if(!s) return new appError("Could not get data", 400);
    
    res.status(200).json({
        status: "success",
        data: s
    });

});

export const checkapi = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {

    const { api_key, secret_key, passphrase } = req.body;

    const live = kucoin({
        symbol: "adausdtm",
        api_key: encrypt(api_key),
        secret_key: encrypt(secret_key), 
        passphrase: encrypt(passphrase)
    });

    const account = await live.getAccountOverview();

    res.status(200).json({
        status: "success",
        data: account ? true : false
    });


});

export const update = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {
    
    const strategies = await Strategies.findByIdAndUpdate(req.body._id, req.body, {new: true});
    
    if(!strategies) return new appError("Could not update data", 400);
    
    res.status(200).json({
        status: "success",
        data: strategies
    });

});

export const create = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {
    req.body.user = req.user._id;
    req.body.secret_key = encrypt(req.body.secret_key);
    req.body.api_key = encrypt(req.body.api_key);
    req.body.passphrase = encrypt(req.body.passphrase);

    const strategy = await Strategies.create(req.body);
    
    if(!strategy) return new appError("Build failed", 401);
    
    res.status(200).json({
        status: "success",
        data: strategy
    });

});

export const duplicate = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {
    delete req.body._id;

    const strategy = await Strategies.create(req.body);

    if(!strategy) return new appError("Could not copy document", 400);
    
    res.status(200).json({
        status: "success",
        data: strategy
    });

});

export const remove = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {
    
    const strategy = await Strategies.findByIdAndDelete(req.params.id);

    if(!strategy) return new appError("Could not delete data", 400);

    res.status(200).json({
        status: "success",
    });

});
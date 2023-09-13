import { IRequest } from "../interfaces/interfaces";

import { Response } from "express";

export const SuccessResponse = (res: Response, response?: unknown, statusCode: number = 200) => res.status(statusCode).json({success: true, response: response});

export const FailedResponse = (res: Response, error: any = {}, statusCode: number = 400) => () => res.status(error.statusCode ? error.statusCode : statusCode).json({success: false, reason: error.reason ? error.reason : error.toString() || 'Unknown error'});


export const failResponse:IRequest<any> = {
  statusCode: 500,
}
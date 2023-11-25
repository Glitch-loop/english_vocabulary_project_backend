import express from "express";
import { getActivityController } from "../controller/ActivitiesController";
import { IMeaning, IRequest, IWord, IWord_class } from "../interfaces/interfaces";
import { SuccessResponse, FailedResponse } from "../utils/response";

const router = express.Router();


router.patch('/', getActivity);

async function getActivity(req: any, res: any):Promise<IRequest<any>> {
  try {
    const response:IRequest<IWord[]> = await getActivityController(req.body);
    return SuccessResponse(res, response);
  } catch (error) {
    return FailedResponse(res, error)();
  }
}


export default router;
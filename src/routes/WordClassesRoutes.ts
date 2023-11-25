import express from "express";
import { getAllWordClassesController, getWordClassesController } from "../controller/WordsClassesController";
import { IRequest, IWord_class } from "../interfaces/interfaces";
import { SuccessResponse, FailedResponse } from "../utils/response";

const router = express.Router();

router.get('/', getAllWordClasses);
router.get('/:idWordClass', getWordClasses);

async function getAllWordClasses(req: any, res: any):Promise<IRequest<any>> {
  try {
    const response:IRequest<IWord_class[]> = await getAllWordClassesController();
    return SuccessResponse(res, response);
  } catch (error) {
    return FailedResponse(res, error)();
  }
}

async function getWordClasses(req: any, res: any):Promise<IRequest<any>> {
  try {
    const response:IRequest<IWord_class[]> = await getWordClassesController(req.params);
    return SuccessResponse(res, response);
  } catch (error) {
    return FailedResponse(res, error)();
  }
}

export default router;
import express from "express";
import { 
  addMeaningController, 
  putMeaningController, 
  deleteMeaningController, 
  getMeaningController,
  addExampleController,
  putExampleController,
  deleteExampleController
} from "../controller/MeaningsController";
import { IMeaning, IRequest } from "../interfaces/interfaces";
import { SuccessResponse, FailedResponse } from "../utils/response";

const router = express.Router();


router.post('/', addMeaning);
router.delete('/:idMeaning', deleteMeaning);
router.put('/:idMeaning', putMeaning);
router.get('/:idMeaning', getMeaning);
router.post('/examples/:idMeaning', addExample);
router.put('/examples/:idExample', putExample);
router.delete('/examples/:idExample', deleteExample);
router.get('/groups/:idGroup');
router.get('/words/:idWord');
router.get('/wordsClass/:idWordClass');

async function addMeaning(req: any, res: any):Promise<IRequest<any>> {
  try {
    const response:IRequest<IMeaning> = await addMeaningController(req.body);
    return SuccessResponse(res, response);
  } catch (error) {
    return FailedResponse(res, error)();
  }
}

async function putMeaning(req: any, res: any):Promise<IRequest<any>> {
  try {
    const response:IRequest<any> = await putMeaningController(req.body, req.params);
    return SuccessResponse(res, response);
  } catch (error) {
    return FailedResponse(res, error)();
  }
}

async function deleteMeaning(req: any, res: any):Promise<IRequest<any>> {
  try {
    const response:IRequest<number> = await deleteMeaningController(req.body, req.params);
    return SuccessResponse(res, response);
  } catch (error) {
    return FailedResponse(res, error)();
  }
}

async function getMeaning(req: any, res: any):Promise<IRequest<any>> {
  try {
    const response:IRequest<IMeaning[]> = await getMeaningController(req.body, req.params);
    return SuccessResponse(res, response);
  } catch (error) {
    return FailedResponse(res, error)();
  }
}

async function addExample(req: any, res: any):Promise<IRequest<any>> {
  try {
    const response:IRequest<IMeaning> = await addExampleController(req.body, req.params);
    return SuccessResponse(res, response);
  } catch (error) {
    return FailedResponse(res, error)();
  }
}

async function putExample(req: any, res: any):Promise<IRequest<any>> {
  try {
    const response:IRequest<any> = await putExampleController(req.body, req.params);
    return SuccessResponse(res, response);
  } catch (error) {
    return FailedResponse(res, error)();
  }
}

async function deleteExample(req: any, res: any):Promise<IRequest<any>> {
  try {
    const response:IRequest<number> = await deleteExampleController(req.body, req.params);
    return SuccessResponse(res, response);
  } catch (error) {
    return FailedResponse(res, error)();
  }
}

export default router;
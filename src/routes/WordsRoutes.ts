import express from "express";
import { addWordController, putWordController, deleteWordController, getWordController, searchWordController } from "../controller/WordsController";
import { IRequest, IWord } from "../interfaces/interfaces";
import { SuccessResponse, FailedResponse } from "../utils/response";

const router = express.Router();

router.post('/', addWord);
router.put('/:idWord', putWord);
router.delete('/:idWord', deleteWord);
router.get('/:idWord', getWord);
router.get('/search/:stringToSearch', searchWord);

async function addWord(req: any, res: any):Promise<IRequest<any>> {
  try {
    const response:IRequest<IWord> = await addWordController(req.body);
    return SuccessResponse(res, response);
  } catch (error) {
    return FailedResponse(res, error)();
  }
}

async function putWord(req: any, res: any):Promise<IRequest<any>> {
  try {
    const response:IRequest<number> = await putWordController(req.body, req.params);
    return SuccessResponse(res, response);
  } catch (error) {
    return FailedResponse(res, error)();
  }
}

async function deleteWord(req: any, res: any):Promise<IRequest<any>> {
  try {
    const response:IRequest<number> = await deleteWordController(req.body, req.params);
    return SuccessResponse(res, response);
  } catch (error) {
    return FailedResponse(res, error)();
  }
}

async function getWord(req: any, res: any):Promise<IRequest<any>> {
  try {
    const response:IRequest<IWord[]> = await getWordController(req.body, req.params);
    return SuccessResponse(res, response);
  } catch (error) {
    return FailedResponse(res, error)();
  }
}

async function searchWord(req: any, res: any):Promise<IRequest<any>> {
  try {
    const response:IRequest<IWord[]> = await searchWordController(req.params);
    
    return SuccessResponse(res, response);
  } catch (error) {
    return FailedResponse(res, error)();
  }
}

export default router;
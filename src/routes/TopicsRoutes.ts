import express from "express";
import { IRequest, ITopic } from "../interfaces/interfaces";
import { SuccessResponse, FailedResponse } from "../utils/response";
import { addTopicController, getAllTopicsController, updateTopicController, deleteWordController, getTopicController, searchTopicController } from "../controller/TopicsController";

const router = express.Router();

router.post('/', addTopic);
router.get('/', getAllTopics);
router.put('/:idTopic', updateTopic);
router.delete('/:idTopic', deleteTopic);
router.get('/:idTopic', getTopic);
router.get('/search/:stringToSearch', searchTopic);

async function addTopic(req: any, res: any):Promise<IRequest<any>> {
  try {
    const response:IRequest<ITopic> = await addTopicController(req.body);
    return SuccessResponse(res, response);
  } catch (error) {
    return FailedResponse(res, error)();
  }
}

async function getAllTopics(req: any, res: any):Promise<IRequest<ITopic[]>> {
  try {
    const response:IRequest<ITopic[]> = await getAllTopicsController();
    return SuccessResponse(res, response);
  } catch (error) {
    return FailedResponse(res, error)();
  }
}

async function updateTopic(req: any, res: any):Promise<IRequest<any>> {
  try {
    const response:IRequest<number> = await updateTopicController(req.body, req.params);
    return SuccessResponse(res, response);
  } catch (error) {
    return FailedResponse(res, error)();
  }
}

async function deleteTopic(req: any, res: any):Promise<IRequest<any>> {
  try {
    const response:IRequest<number> = await deleteWordController(req.params);
    return SuccessResponse(res, response);
  } catch (error) {
    return FailedResponse(res, error)();
  }
}

async function getTopic(req: any, res: any):Promise<IRequest<ITopic[]>> {
  try {
    const response:IRequest<ITopic[]> = await getTopicController(req.params);
    return SuccessResponse(res, response);
  } catch (error) {
    return FailedResponse(res, error)();
  }
}

async function searchTopic(req: any, res: any):Promise<IRequest<ITopic[]>> {
  try {
    const response:IRequest<ITopic[]> = await searchTopicController(req.params);
    return SuccessResponse(res, response);
  } catch (error) {
    return FailedResponse(res, error)();
  }
}

export default router;
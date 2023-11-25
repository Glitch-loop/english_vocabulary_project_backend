import requester from "../helpers/requester";
import { pool } from "../helpers/mysqlPool";
import tables from "../utils/tables";
import { IRequest, ITopic, IWord, IWord_class } from "../interfaces/interfaces";
import { failResponse } from "../utils/response";

async function getAllWordClassesController():Promise<IRequest<IWord_class[]>> {
  try {
    const query = `SELECT * FROM ${tables.WORDS_CLASSES}`;
    const responseServer:IRequest<IWord_class[]> = await requester({pool, sqlQuery: query});
    return responseServer;
  } catch (error) {
    return failResponse;
  }
}

async function getWordClassesController(params: any):Promise<IRequest<IWord_class[]>> {
  try {
    const { idWordClass } = params;
    const query = `SELECT * FROM ${tables.WORDS_CLASSES} WHERE id_word_class = ${idWordClass}`;
    const responseServer:IRequest<IWord_class[]> = await requester({pool, sqlQuery: query});
    return responseServer;
  } catch (error) {
    return failResponse;
  }
}

export {
  getAllWordClassesController,
  getWordClassesController
}
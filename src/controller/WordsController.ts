import requester from "../helpers/requester";
import { pool } from "../helpers/mysqlPool";
import tables from "../utils/tables";
import { IMeaning, IRequest, IWord } from "../interfaces/interfaces";
import { failResponse } from "../utils/response";

async function addWordController(data: any):Promise<IRequest<IWord>> {
  try {
    const { word } = data;
    const query = `INSERT INTO ${tables.WORDS} (word) VALUES ('${word}')`;
    const newWord:IWord = {
      word: word,
      id_word: 0,
      meanings: []
    }

    const responseServer:IRequest<any> = await requester({pool, sqlQuery: query});

    if(responseServer.statusCode === 200) {
      newWord.id_word =  responseServer.response.insertId;
      responseServer.response = newWord;
    } else {
      responseServer.response = newWord;
    }

    return responseServer;
  } catch (error) {
    return failResponse;
  }
}

async function putWordController(data: any, params: any):Promise<IRequest<any>> {
  try {
    const { word } = data;
    const { idWord } = params;
    const query = `UPDATE ${tables.WORDS} SET word = '${ word }' WHERE id_word = ${ idWord }`;  
    const responseServer:IRequest<any> = await requester({pool, sqlQuery: query});
    return responseServer;
  } catch (error) {
    return failResponse;
  }
}

async function deleteWordController(data: any, params: any):Promise<IRequest<any>> {
  try {
    const { idWord } = params;
    const query = `DELETE FROM ${tables.WORDS} WHERE id_word = ${ idWord }`;
    const responseServer:IRequest<any> = await requester({pool, sqlQuery: query});
    return responseServer;
  } catch (error) {
    return failResponse;
  }
}

async function getWordController(data: any, params: any):Promise<IRequest<IWord[]>> {
  try {
    const { idWord } = params;
    const query2 = `SELECT * FROM ${tables.MEANINGS} WHERE id_word = ${ idWord }`;
    const responseServerMeanings:IRequest<IMeaning[]> = await requester({pool, sqlQuery: query2});

    const query = `SELECT * FROM ${tables.WORDS} WHERE id_word = ${ idWord }`;
    const responseServer:IRequest<IWord[]> = await requester({pool, sqlQuery: query});

    if(responseServerMeanings.response !== undefined && responseServer.response !== undefined) {
      responseServer.response[0].meanings = responseServerMeanings.response;
    }

    return responseServer;
  } catch (error) {
    return failResponse;
  }
}

async function searchWordController(params: any):Promise<IRequest<IWord[]>> {
  try {
    const { stringToSearch } = params;  
    const query = `SELECT * FROM ${tables.WORDS} WHERE word LIKE '%${ stringToSearch }%'`;
    const responseServer:IRequest<IWord[]> = await requester({pool, sqlQuery: query});
    return responseServer;
  } catch (error) {
    return failResponse;
  }
}



export {
  addWordController,
  putWordController,
  deleteWordController,
  getWordController,
  searchWordController
}
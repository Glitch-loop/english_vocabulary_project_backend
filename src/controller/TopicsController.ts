import requester from "../helpers/requester";
import { pool } from "../helpers/mysqlPool";
import tables from "../utils/tables";
import { IRequest, ITopic, IWord } from "../interfaces/interfaces";
import { failResponse } from "../utils/response";

async function addTopicController(data: any):Promise<IRequest<ITopic>> {
  try {
    const { topic_name }:{ topic_name:string } = data;
    const newTopic:ITopic = {
      id_topic: 0,
      topic_name: topic_name.toLowerCase()
    }

    const query = `INSERT INTO ${tables.TOPICS} (topic_name) VALUES ('${topic_name.toLowerCase()}')`;
    const responseServer:IRequest<any> = await requester({pool, sqlQuery: query});

    
    if(responseServer.statusCode === 200) {
      newTopic.id_topic =  responseServer.response.insertId;
      responseServer.response = newTopic;
    } else {
      responseServer.response = newTopic;
    }

    return responseServer;
  } catch (error) {
    return failResponse;
  }
}

async function getAllTopicsController():Promise<IRequest<ITopic[]>> {
  try {
    const query = `SELECT * FROM ${tables.TOPICS} ORDER BY topic_name ASC`;
    const responseServer:IRequest<ITopic[]> = await requester({pool, sqlQuery: query});
    return responseServer;
  } catch (error) {
    return failResponse;
  }
}

async function updateTopicController(data: any, params: any):Promise<IRequest<any>> {
  try {
    const { topic_name }:{ topic_name:string } = data;
    const { idTopic } = params;
    
    const query = `UPDATE ${tables.TOPICS} SET topic_name = '${ topic_name.toLowerCase() }' WHERE id_topic = ${ idTopic }`;  
    const responseServer:IRequest<any> = await requester({pool, sqlQuery: query});
    return responseServer;
  } catch (error) {
    return failResponse;
  }
}

async function deleteWordController(params: any):Promise<IRequest<any>> {
  try {
    const { idTopic } = params;
    const query = `DELETE FROM ${tables.TOPICS} WHERE id_topic = ${ idTopic }`;
    const responseServer:IRequest<any> = await requester({pool, sqlQuery: query});
    return responseServer;
  } catch (error) {
    return failResponse;
  }
}

async function getTopicController(params: any):Promise<IRequest<ITopic[]>> {
  try {
    const { idTopic } = params;
    const query = `SELECT * FROM ${tables.TOPICS} WHERE id_topic = ${idTopic}`;
    const responseServer:IRequest<ITopic[]> = await requester({pool, sqlQuery: query});
    return responseServer;
  } catch (error) {
    return failResponse;
  }
}

async function searchTopicController(params: any):Promise<IRequest<ITopic[]>> {
  try {
    const { stringToSearch } = params;  
    const query = `SELECT * FROM ${tables.TOPICS} WHERE topic_name LIKE '%${ stringToSearch }%'`;
    const responseServer:IRequest<ITopic[]> = await requester({pool, sqlQuery: query});
    return responseServer;
  } catch (error) {
    return failResponse;
  }
}



export {
  addTopicController,
  getAllTopicsController,
  updateTopicController,
  deleteWordController,
  getTopicController,
  searchTopicController
}
import requester from "../helpers/requester";
import { pool } from "../helpers/mysqlPool";
import tables from "../utils/tables";
import { IExample, IMeaning, IRequest } from "../interfaces/interfaces";
import { failResponse } from "../utils/response";


async function addMeaningController(data: any):Promise<IRequest<IMeaning>> {
  try {
    const { meaning, 
        source, 
        id_word, 
        id_topic, 
        id_word_class }:{
        meaning:string, 
        source:string,
        id_word:number,
        id_topic:number,
        id_word_class:number
      } = data;
    const newMeaning:IMeaning = {
      id_meaning: 0,
      meaning: meaning.toLowerCase(),
      source: source,
      recently_practiced: 0,
      times_practiced: 0,
      id_word_class: id_word_class,
      id_topic: id_topic,
      id_word: id_word,
      examples: []
    }

    const query = `INSERT INTO ${tables.MEANINGS} 
      (meaning, source, recently_practiced, times_practiced, id_word_class, id_topic, id_word) 
      VALUES ('${meaning}', '${source}', 0, 0, ${id_word_class}, ${id_topic}, ${id_word})`;

    const responseServer:IRequest<any> = await requester({pool, sqlQuery: query});

    if(responseServer.statusCode === 200) {
      newMeaning.id_meaning =  responseServer.response.insertId;
      responseServer.response = newMeaning;
    } else {
      responseServer.response = newMeaning;
    }

    return responseServer;
  } catch (error) {
    console.log(error)
    return failResponse;
  }
}

async function putMeaningController(data: any, params: any):Promise<IRequest<any>> {
  try {
    const { idMeaning } = params;

    let updateOperations = '';

    for(const key in data) {
      if(typeof data[key] === "string"){
          let information:string = "";
          if(key === "meaning")  {
            information = data[key]
            updateOperations = updateOperations + `${key} = '${information.toLowerCase()}', `;
          } else {
            updateOperations = updateOperations + `${key} = '${data[key]}', `;
          }

      }

      if(typeof data[key] === "number"){
        updateOperations = updateOperations + `${key} = ${data[key]}, `;
      }
    }

    let updateOperationsQuery = updateOperations.slice(0, updateOperations.length - 2);
    
    const query = `UPDATE ${tables.MEANINGS} SET ${updateOperationsQuery} WHERE id_word = ${ idMeaning }`;  
    const responseServer:IRequest<any> = await requester({pool, sqlQuery: query});
    return responseServer;
  } catch (error) {
    return failResponse;
  }
}

async function deleteMeaningController(data: any, params: any):Promise<IRequest<any>> {
  try {
    const { idMeaning } = params;
    const query = `DELETE FROM ${tables.MEANINGS} WHERE id_meaning = ${ idMeaning }`;
    const responseServer:IRequest<any> = await requester({pool, sqlQuery: query});
    return responseServer;
  } catch (error) {
    return failResponse;
  }
}

async function getMeaningController(data: any, params: any):Promise<IRequest<IMeaning[]>> {
  try {
    const { idMeaning } = params;
    const query = `SELECT * FROM ${tables.MEANINGS} WHERE id_meaning = ${ idMeaning }`;

    const query2 = `SELECT * FROM ${tables.EXAMPLES} WHERE id_meaning = ${ idMeaning }`

    const responseServerExamples:IRequest<IExample[]> = await requester({pool, sqlQuery: query2});

    
    const responseServer:IRequest<IMeaning[]> = await requester({pool, sqlQuery: query});

    if(responseServer.response !== undefined) {
      responseServer.response[0].examples = responseServerExamples.response;
    }

    return responseServer;
  } catch (error) {
    return failResponse;
  }
}


async function addExampleController(data: any, params: any):Promise<IRequest<IMeaning>> {
  try {
    const  idMeaning  =JSON.parse(params.idMeaning);
    const { example } = data;

    const newExample:IExample = {
      id_example: 0,
      id_meaning: idMeaning,
      example: example
    }

    const query = `INSERT INTO ${tables.EXAMPLES} 
      (id_meaning, example) 
      VALUES (${idMeaning}, '${example}')`;

    const responseServer:IRequest<any> = await requester({pool, sqlQuery: query});

    if(responseServer.statusCode === 200) {
      newExample.id_example =  responseServer.response.insertId;
      responseServer.response = newExample;
    } else {
      responseServer.response = newExample;
    } 

    return responseServer;
  } catch (error) {
    return failResponse;
  }
}

async function putExampleController(data: any, params: any):Promise<IRequest<any>> {
  try {
    const { idExample } = params;
    const { example } = data;

    const query = `UPDATE ${ tables.EXAMPLES } SET example = '${ example }' WHERE id_example = ${ idExample }`;  
    const responseServer:IRequest<any> = await requester({pool, sqlQuery: query});
    return responseServer;
  } catch (error) {
    return failResponse;
  }
}

async function deleteExampleController(data: any, params: any):Promise<IRequest<any>> {
  try {
    const { idExample } = params;
    const query = `DELETE FROM ${tables.EXAMPLES} WHERE id_example = ${ idExample }`;
    const responseServer:IRequest<any> = await requester({pool, sqlQuery: query});
    return responseServer;
  } catch (error) {
    return failResponse;
  }
}

export {
  addMeaningController,
  putMeaningController,
  deleteMeaningController,
  getMeaningController,
  addExampleController,
  putExampleController,
  deleteExampleController
}
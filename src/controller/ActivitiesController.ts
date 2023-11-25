import requester from "../helpers/requester";
import { pool } from "../helpers/mysqlPool";
import tables from "../utils/tables";
import { IMeaning, IRequest, IWord } from "../interfaces/interfaces";
import { failResponse } from "../utils/response";
import { randomNumber } from "../utils/utils";

async function getActivityController(data: any):Promise<IRequest<IWord[]>> 
{
  try {
    const {idTopic, idWordClass, lessStudiedWord, numberWords}:
    {idTopic:number, idWordClass:number, lessStudiedWord:boolean, numberWords:number} = data;
    let query = `SELECT * FROM ${tables.MEANINGS} AS A JOIN ${tables.WORDS} AS B ON A.id_word = B.id_word`;
  

    //The topics that are going to be in the activity
    let topicToConsider = "";
    console.log(idTopic !== 0  && idWordClass !== 0)
    if(idTopic !== 0  && idWordClass !== 0){
      topicToConsider += ` WHERE id_topic = ${idTopic} AND id_word_class = ${idWordClass}`
    } else {
      if(idTopic !== 0) {
        topicToConsider += ` WHERE id_topic = ${idTopic}`;
      }
      if(idWordClass !== 0) {
        topicToConsider += ` WHERE id_word_class = ${idWordClass}`;
      }
    }
    
    query += topicToConsider;

    //Scheme to select the meanings      
    const factor = randomNumber(numberWords);
    if(lessStudiedWord === true) {
      //Words less practiced
      query += ` ORDER BY times_practiced DESC`;
    } else {
      //Words that haven't been practiced
      query += ` AND recently_practiced = 0 `;
      if(factor > 5) {
        query += ` ORDER BY meaning DESC`;
      } else {
        query += ` ORDER BY meaning ASC`;
      }
    }
        
    //Number of meanings that the user is requiring
    query += ` LIMIT ${ numberWords }`;

    console.log(query)

    // Ask for the words
    const responseMeanings:IRequest<any[]> = await requester({pool, sqlQuery: query});

    if(responseMeanings.response !== undefined){
      const meanings:any[] = responseMeanings.response;
      const wordToPractice:IWord[] = [];

      console.log(meanings.length);
      console.log("numberWords: ", numberWords);
      if((meanings.length - 1 < numberWords) 
        && lessStudiedWord === false) {
        /*
          This means that there is not words enough to satisfy the request,
          so we need to complete it.
        */
        let queryRecover = `SELECT * FROM ${tables.MEANINGS} AS A JOIN ${tables.WORDS} AS B ON A.id_word = B.id_word ${ topicToConsider } AND recently_practiced = 0`;
        
        const responseRemainingNumber:IRequest<any[]> = await requester({pool, sqlQuery: queryRecover});
        
        console.log("Candidate remainig")
        if(responseRemainingNumber.response !== undefined) {
          const candidatesMeanings:any[] = responseMeanings.response;
          console.log("candidatesMeanings: ", candidatesMeanings)
          for(let i = 0; i < candidatesMeanings.length; i++) {
            if(meanings.length < numberWords - 1) meanings.push(candidatesMeanings[i]);
          }
          
          if(meanings.length - 1 < numberWords) {

              //Reset the set
              let updateQuery = `UPDATE ${ tables.MEANINGS } SET recently_practiced = 0 ${ topicToConsider }`;
              await requester({pool, sqlQuery: updateQuery});

            /*
              That means that the number of words that ask the user hasn't reached yet
              All the words in the subset have been practiced once
            */
            let allWordsQueryRecover = `SELECT * FROM ${tables.MEANINGS} AS A JOIN ${tables.WORDS} AS B ON A.id_word = B.id_word WHERE recently_practiced = 0`;

            const responseLastRemaining:IRequest<any[]> = await requester({pool, sqlQuery: allWordsQueryRecover});

            if(responseLastRemaining.response !== undefined) {
              const candidatesMeaningsGeneralWords:any[] = responseMeanings.response;
              for(let i = 0; i < candidatesMeaningsGeneralWords.length; i++) {
                if(meanings.length < numberWords - 1) meanings.push(candidatesMeanings[i]);
              }
            }

            if(meanings.length - 1 < numberWords) {
              /*
                That means that all the words have been practiced at least once.
                Now search in the general set
              */

                // Reset all the words
                let updateQueryAllWords = `UPDATE ${ tables.MEANINGS } SET recently_practiced = 0`;
                await requester({pool, sqlQuery: updateQueryAllWords});

              let lastWordRecoverQuery = `SELECT * FROM ${tables.MEANINGS} AS A JOIN ${tables.WORDS} AS B ON A.id_word = B.id_word`;
            
              const responseLastRecovery:IRequest<any[]> = await requester({pool, sqlQuery: lastWordRecoverQuery});
              if(responseLastRecovery.response !== undefined) {
                const lastRecovery:any[] = responseLastRecovery.response;
                for(let i = 0; i < lastRecovery.length; i++) {
                  if(meanings.length < numberWords - 1) meanings.push(lastRecovery[i]);
                }
              }
            }
          }
        }
      }

      // Set the data in word's interface
      for(let i = 0; i < meanings.length; i++) {
        const newWord:IWord = {
          id_word: meanings[i].id_word,
          word: meanings[i].word,
          meanings: [ { ...meanings[i] } ]
        };
        wordToPractice.push(newWord)
      }

      // Update those words that will be practiced
      for(let i = 0; i < meanings.length; i++) {
        let updateMeaning = 
          `UPDATE ${ tables.MEANINGS } SET recently_practiced = 1, times_practiced = ${ meanings[i].times_practiced + 1} WHERE id_meaning = ${meanings[i].id_meaning}`;

        await requester({pool, sqlQuery: updateMeaning});
      }


      responseMeanings.response = wordToPractice;
    } else {
      responseMeanings.response = [];
    }

    return responseMeanings;
  } catch (error) {
    console.log(error)
    return failResponse;
  }



}

export {
  getActivityController
}
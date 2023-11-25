import mysql from 'mysql2';
import { IRequest } from '../interfaces/interfaces.js';

const transactionalPool = async({pool, sqlQuery}: {pool: mysql.Pool, sqlQuery: string[]}): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!pool) return reject ({statusCode: 500, reason: {sqlMessage: 'Unable to connect to the pool', errorCode: 100}});
    if (!sqlQuery) return reject ({statusCode: 500, reason: {sqlMessage: 'No SQL query detected', errorCode: 100}});
    
    pool.getConnection((connectionError, connection) => {
      if (connectionError) {
        connection.release();
        return reject ({
          statusCode: 500,
          reason: {
            sqlMessage: 'Unable to connect',
            sqlCode: connectionError.code,
            sqlErrorCode: connectionError.errno,
            errorCode: 100
          }
        });
      }

      connection.beginTransaction((transactionError) => {
        if (transactionError) {
          if (connection) connection.release();
          return reject({
            statusCode: 500,
            reason: {
              sqlMessage: 'Unable create a transaction',
              sqlCode: transactionError.code,
              sqlErrorCode: transactionError.errno,
              errorCode: 100
            }
          })
        };

        const promises = sqlQuery.map(async(query, idx) => {
          return new Promise<IRequest<any>>((resolve1, reject1) => {
            connection.query(query, [], (queryError, queryResults, queryFields) => {
              if (queryError) {
                connection.rollback(() => {});
                if (connection) connection.release();
                return reject1({
                  statusCode: 500,
                  reason: {
                    sqlMessage: `Unable to perfom the query at: ${query}}`,
                    sqlCode: queryError.code,
                    sqlErrorCode: queryError.errno,
                    errorCode: 101
                  }
                });
              }
              resolve1({statusCode: 200, response: queryResults});
            });
          })
          .then(res => res)
          .catch(err => err)
        });

        Promise.all(promises)
        .then((results: IRequest<any>[]) => {
          const failedResult: IRequest<any>|undefined = results.find(item => item.statusCode === 500);

          if(failedResult !== undefined) reject(failedResult);

          if (failedResult) reject(failedResult);

          connection.commit((commitError) => {
            if (commitError) {
              connection.rollback(() => {});
              if (connection) connection.release();
              return reject({
                statusCode: 500,
                reason: {
                  sqlMessage: `Unable to commit the operation`,
                  sqlCode: commitError.code,
                  sqlErrorCode: commitError.errno,
                  errorCode: 100
                }
              });
            }
            
            connection.release();
            resolve(results);
          });
        })
        .catch(err => {
          connection.rollback(() => {});
          if (connection) connection.release();
          reject(err);
        });
      });
    });
  })
  .then(res => {})
  .catch(err => {throw err}); 
}

const instantPool = async({pool, sqlQuery, dataReplacement = [], forceSingle = false}: 
  {pool: mysql.Pool, sqlQuery: string | string[], dataReplacement?: string[], forceSingle?: boolean}): Promise<any> => {
  return new Promise((resolve, reject) => {
    pool.getConnection((connectionError, connection) => {
      if (connectionError) {
        if (connection) connection.release();
        return reject({
          statusCode: 500,
          reason: {
            sqlMessage: 'Unable to connect',
            sqlCode: connectionError.code,
            sqlErrorCode: connectionError.errno,
            errorCode: 100
          }
        });
      }

      if (Array.isArray(sqlQuery)) {
        const promises = sqlQuery.map(async(query, idx) => {
          return new Promise<IRequest<any>>((resolve1, reject1) => {
            connection.query(query, [], (queryError, queryResult, queryFields) => {
              if (queryError) {
                return reject1({
                  statusCode: 500,
                  reason: {
                    sqlMessage: queryError.message,
                    sqlCode: queryError.code,
                    sqlErrorCode: queryError.errno,
                    errorCode: 101
                  }
                });
              }
              resolve1({statusCode: 200, response: queryResult});
            });
          })
          .then(res => res)
          .catch(err => err)
        });

        Promise.all(promises)
        .then((results: IRequest<any>[]) => {
          if (connection) connection.release();
          const failedResults: IRequest<any>|undefined = results.find(item => item.statusCode === 500);
          if(failedResults !== undefined) reject(failedResults);
          if (failedResults) reject(failedResults);
          resolve({});
        })
        .catch(err => {
          reject(err);
        })
      } else {
        connection.query(sqlQuery, dataReplacement, (queryError, queryResult, queryFields) => {
          if (connection) connection.release();
          if (queryError) {
            return reject({
              statusCode: 500,
              reason: {
                sqlMessage: queryError.message,
                sqlCode: queryError.code,
                sqlErrorCode: queryError.errno,
                errorCode: 101
              }
            });
          }
          const qResult = queryResult as any[];
          if (forceSingle) {            
            resolve({statusCode: 200, response: qResult[0].ResultSetHeader});
          } else {
            resolve({statusCode: 200, response: qResult});
          }
        });
      }

    });
  })
  .then((res) => res)
  .catch(err => {throw err});
}

const requester = async({pool, sqlQuery, dataReplacement = [], forceSingle = false, overrideSafeMode = false}: {pool: mysql.Pool, sqlQuery: string | string[], dataReplacement?: string[], forceSingle?: boolean, overrideSafeMode?: boolean}): Promise<any> => {
  if (Array.isArray(sqlQuery)) {
    if (overrideSafeMode) return instantPool({pool, sqlQuery});
      else return await transactionalPool({pool, sqlQuery});
  } else {
    return instantPool({pool, sqlQuery, dataReplacement, forceSingle});
  }
}

export default requester;
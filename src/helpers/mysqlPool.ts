import mysql from "mysql2";
import dbConfig from "../config/mysql-config";

let pool:mysql.Pool;

const initializeMySQL = () => {
  pool = mysql.createPool(dbConfig());
}

export {
  pool,
  initializeMySQL,
};
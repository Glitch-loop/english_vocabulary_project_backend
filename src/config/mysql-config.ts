import dotenv from 'dotenv';
dotenv.config();

const dbConfig = () => {
  return {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
    // ,
    // port: process.env.DB_PORT
    // charset: 'utf8mb4',
  };
}

export default dbConfig;
import express from "express";
import cors from "cors";
import http from "http"
import dotenv from "dotenv";
import { initializeMySQL } from "./helpers/mysqlPool";

import activitiesRouter from "./routes/ActivitiesRoutes";
import wordsRouter from "./routes/WordsRoutes";
import topicsRouter from "./routes/TopicsRoutes";
import meaningsRouter from "./routes/MeaningsRoutes";
import wordsClassesRouter from "./routes/WordClassesRoutes";

dotenv.config()

initializeMySQL();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.urlencoded({extended: true, limit: '50mb'}));
app.use(express.json({limit: '50mb'}));

//routes
app.use('/activities', activitiesRouter);
app.use('/words', wordsRouter);
app.use('/topics', topicsRouter);
app.use('/meanings', meaningsRouter);
app.use('/wordClasses', wordsClassesRouter);


server.listen(process.env.PORT, () => {
  console.log(`Running on port => http://localhost:${process.env.PORT}`);
}) 

import express from 'express';
import Router from './routes/default-routes.js';
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import database from "./data/config/database.js";
import mongoose from "mongoose";

if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}

const mongoose_config = { useNewUrlParser: true, useUnifiedTopology: true }; //connection configs
const connection = mongoose.connect(database['database'], mongoose_config); //connect to mongo server
if (connection) { //log connection result
    console.log('database connected');
}
else {
    console.log('database connection error')
}

const app = express();
const port = process.env.PORT | 3000;
const routes = new Router().getRouter();
function setupApp() {
    app.use(cors());
    app.use(bodyParser.json());
    app.use('/', routes);
}
setupApp();
app.listen(port, () => console.log(`listening on... ${port}`));
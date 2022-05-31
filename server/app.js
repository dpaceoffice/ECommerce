import express from 'express';
import Router from './routes/default-routes.js';
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import database from "./data/config/database.js";
import mongoose from "mongoose";
import session from "express-session";
import passport from "./config/passport.js";

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
    const sessionConfig = { secret: process.env.SECRET_SESSION, resave: false, saveUninitialized: true };
    app.use(session(sessionConfig));
    app.use(cors());
    //app.use(express.static('client'))
    app.use(express.static('client/build'))
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use('/', routes);
}
setupApp();
app.listen(port, () => console.log(`listening on... ${port}`));
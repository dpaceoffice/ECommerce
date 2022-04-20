import express from 'express';
import Router from './routes/default-routes.js';
import dotenv from "dotenv";
import cors from "cors";

if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}
const app = express();
const port = process.env.PORT;
const routes = new Router().getRouter();
function setupApp() {
    app.use(cors());
    app.use('/', routes);
}
setupApp();
app.listen(port, () => console.log(`listening on... ${port}`));
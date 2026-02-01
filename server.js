
import express from 'express';
import { registerRoutes } from './src/routes/routes.js';
import { connect } from './database.js';
import {Server} from 'socket.io';
import http from 'http';
import SocketIoInitializer from './src/SocketIoInitializer.js';
export const host = 'localhost';
export const port = 3001;
const app = express();

app.use(express.json());

//app inserimento immagine
// -----------

//---------------

await connect()
const httpServer = http.createServer(app);
const io = new Server(httpServer);
registerRoutes(app);
new SocketIoInitializer(io);
app.use((err, req, res, next) => {
    if(err?.error && err.error.isJoi) {
        res.status(400).json({type: err.type, message: err.error.toString()});
    }
    else{
        next(err);
    }
})
httpServer.listen(port, host, () => {
    console.log(`Server avviato ${host}: ${port}.`)
})

export default app;


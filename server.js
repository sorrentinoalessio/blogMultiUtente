
import express from 'express';
import { registerRoutes } from './src/routes/routes.js';
import { connect } from './database.js';
import {Server} from 'socket.io';
import http from 'http';
import SocketIoInitializer from './src/SocketIoInitializer.js';
//app inserimento immagine
//  ---------
import multer from "multer"; 
import path from "path";
import { fileURLToPath } from "url";
//------------

export const host = 'localhost';
export const port = 3001;
const app = express();

app.use(express.json());

//app inserimento immagine
// -----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.send(`
    <h1>File Upload Demo</h1>
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="uploadedFile" />
      <button type="submit">Upload</button>
    </form>
  `);
});

app.post("/upload", upload.single('uploadedFile'), (req, res) => {
  console.log(req.file); // Contains file info
  res.send(`File uploaded successfully: ${req.file.filename}`);
});

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


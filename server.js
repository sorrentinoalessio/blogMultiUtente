
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerRoutes } from './src/routes/routes.js';
import { connect } from './database.js';
import {Server} from 'socket.io';
import http from 'http';
import SocketIoInitializer from './src/components/SocketIoInitializer.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';
import cors from "cors";
const file = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);

export const host = process.env.HOST || '0.0.0.0';
export const port = 3001;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'avatar', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(express.json());


app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/uploads', express.static(uploadsDir));

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
app.get("/api/hello", (req, res) => {
  res.json({ message: "Ciao mondo!" });
});

httpServer.listen(port, host, () => {
    console.log(`Server avviato ${host}: ${port}.`)
})

export default app;


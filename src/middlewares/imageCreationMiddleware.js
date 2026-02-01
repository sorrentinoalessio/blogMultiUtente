import multer from "multer"; 
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Assicurati che la cartella "uploads" esista
const uploadDir = path.join(__dirname, '../../avatar/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurazione storage Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, req.userId +'.jpg');
  }
});

const upload = multer({ storage });

export default function imageCreationMiddleware(req, res, next) {
  upload.single('uploadedFile')(req, res, function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Nessun file caricato' });
    }

    console.log('File caricato:', req.file.filename);
    req.file.ownerId = req.userId
    // Rispondi subito, non chiamare next() perché hai già gestito la risposta
    res.status(200).json({ message: 'File caricato con successo', file: req.file });
  });
}

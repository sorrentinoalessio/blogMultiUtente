import multer from "multer"; 
import path from "path";
import { fileURLToPath } from "url";

export default async (req, res, next) => {
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
upload.single('uploadedFile'), (req, res) => {console.log(req.file);res.send(`File uploaded successfully: ${req.file.filename}`)};

}
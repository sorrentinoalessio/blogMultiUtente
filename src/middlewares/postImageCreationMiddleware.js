import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../../avatar/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const readableDate = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${req.userId || 'post'}-${readableDate}${path.extname(file.originalname) || '.jpg'}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

export default function postImageCreationMiddleware(req, res, next) {
  upload.single('uploadedFile')(req, res, function (err) {
    if (err) {
      return next(err);
    }

    req.body = req.body ?? {};

    if (typeof req.body.tag === 'string') {
      try {
        const parsedTag = JSON.parse(req.body.tag);
        req.body.tag = Array.isArray(parsedTag) ? parsedTag : [parsedTag];
      } catch {
        req.body.tag = req.body.tag.split(',').map((tag) => tag.trim()).filter(Boolean);
      }
    }

    if (req.file) {
      req.file.ownerId = req.userId;
      req.body.img = `/uploads/${req.file.filename}`;
    }

    return next();
  });
}

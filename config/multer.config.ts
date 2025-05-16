import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions = {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(new Error('Format d’image invalide'), false);
    } else {
      cb(null, true);
    }
  },
};

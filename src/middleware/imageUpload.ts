import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";

export interface ImageRequest extends Request {
  fileError?: boolean;
}

const storage = multer.diskStorage({
  destination: function (req: ImageRequest, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const filename =
      file.originalname.replace(extension, "_") + Date.now() + extension;
    cb(null, filename);
  },
});

export const upload = multer({
  fileFilter: function (req: ImageRequest, file, cb) {
    if (file.mimetype.split("/")[0] !== "image") {
      req.fileError = true;
      cb(null, false);
    } else {
      cb(null, true);
    }
  },
  storage: storage,
});

export function checkFileType(
  req: ImageRequest,
  res: Response,
  next: NextFunction
) {
  if (req.fileError) {
    return res.status(400).json({
      message: "Invalid file type",
    });
  }
  next();
}

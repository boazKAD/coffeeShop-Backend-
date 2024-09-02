import multer from "multer";
import path from "path";
export const upload = multer({
  storage: multer.diskStorage({}),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1024 * 1024 * 15, // 15 MB limit
  },
  fileFilter(req, file, cb) {
    // if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
    //     return cb(new Error ('Please Upload An Image File'))
    // }
    // cb(undefined,true);
    let extension = path.extname(file.originalname);
    if (
      !extension === ".jpg" &&
      !extension === ".jpeg" &&
      !extension === ".png" &&
      !extension === ".pdf" &&
      !extension === ".xlsx" &&
      !extension === ".csv"
    ) {
      cb(new Error("Unsupported File!", false));
    }
    cb(null, true);
  },
});

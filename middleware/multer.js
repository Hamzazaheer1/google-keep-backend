const path = require("path");
const multer = require("multer");
const sharp = require("sharp");
const DatauriParser = require("datauri/parser");
const cloudinary = require("./cloudinary");

const parser = new DatauriParser();

const MulterStorge = multer.memoryStorage();

const MulterFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(res.status(404).json("Error"), false);
  }
};

const upload = multer({
  storage: MulterStorge,
  fileFilter: MulterFilter,
});

exports.uploadUserImg = upload.single("photo");

exports.UserImgResize = async (req, res, next) => {
  try {
    if (!req.file) return next();

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 85 });

    const extName = path.extname(req.file.originalname).toString();
    const file64 = parser.format(extName, req.file.buffer);
    const result = await cloudinary.uploader.upload(file64.content);

    req.file.filename = result.url;

    next();
  } catch (err) {
    res.status(404).json({ err: err.message });
  }
};

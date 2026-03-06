import multer from "multer";

/* ================= STORAGE ================= */
/* Store files in memory so we can send buffer to Cloudinary */

const storage = multer.memoryStorage();

/* ================= FILE FILTER ================= */

const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, WEBP images are allowed"), false);
  }

};

/* ================= MULTER CONFIG ================= */

const upload = multer({

  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }

});

export default upload;
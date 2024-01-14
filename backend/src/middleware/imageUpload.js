//const sharp = require('sharp');
const fs = require("fs");
const path = require("path");
const { logError } = require("../../util/logger");
const multer = require("multer");






// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const uploadPath = path.join(
      __dirname,
      "../uploads",
      year.toString(),
      month.toString()
    );

    // Create directories if they don't exist
    if (!fs.existsSync(path.join(__dirname, "../uploads"))) {
      fs.mkdirSync(path.join(__dirname, "../uploads"));
    }

    // Create 'uploads/year' directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, `../uploads/${year}`))) {
      fs.mkdirSync(path.join(__dirname, `../uploads/${year}`));
    }
    // Create 'uploads/year/month' directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, `../uploads/${year}/${month}`))) {
      fs.mkdirSync(path.join(__dirname, `../uploads/${year}/${month}`));
    }

    // Create 'uploads/year/month' directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    callback(null, uploadPath);
  },
  filename: (req, file, callback) => {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, callback) => {
  const allowedTypes = /jpg|jpeg|png|gif|mp4/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return callback(null, true);
  } else {
    callback('Error: Images and videos only!');
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 15000000 }, // 15MB
  fileFilter: fileFilter,
})


// Utility function for file upload
// const handleFileUpload = (req, res, callback) => {
//     upload(req, res, (error) => {
//         if (error) {
//             logError('Error uploading file:', error);
//             callback({ error: 'Error uploading file.' });
//         } else {
//             const filePath = req.file.path;
//             const fileExtension = path.extname(req.file.originalname).toLowerCase();

//             if (fileExtension === '.jpg' || fileExtension === '.jpeg' || fileExtension === '.png' || fileExtension === '.gif') {
//                 // Resize image
//                 resizeImage(filePath, path.dirname(filePath));
//             }

//             callback({ filePath });
//         }
//     });
// };

// Resize image using sharp
// function resizeImage(filename, outputPath) {
//     const targetPath = path.join(outputPath, 'resized', path.basename(filename));

//     sharp(filename)
//         .resize(700)
//         .toFile(targetPath, (error) => {
//             if (error) {
//                 console.error('Error resizing image:', error);
//             }
//         });
// }

module.exports = upload;
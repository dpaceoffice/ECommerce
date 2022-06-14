import multer from 'multer';
import path from 'path';
function uploadFile(req, res, next) {
    function checkFileType(file, cb) {
        // Allowed ext
        const filetypes = /jpeg|jpg|png|gif/;
        // Check ext
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        // Check mime
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            req.fileValidationError = 'Error: Images Only!';
            return cb(null, false, new Error('Error: Images Only!'));
        }
    }
    const upload = multer({
        fileFilter: function (_req, file, cb) {
            checkFileType(file, cb);
        }
    }).single('file');
    upload(req, res, function (err) {
        if (req.fileValidationError) {
            res.status(401).json({ error: req.fileValidationError });
        } else if (err instanceof multer.MulterError) {
            res.status(401).json({ error: "Error with file uploading" })
        } else if (err) {
            res.status(401).json({ error: "Uknown error" })
        } else {
            // Everything went fine. 
            next();
        }
    })
}

export default uploadFile
import multer from "multer";
import path from "path";
import fs from "fs";

// Construct full path relative to current file
const tempDir = path.join(process.cwd(), "src", "public", "temp");

// Ensure the directory exists
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir); // Use absolute path safely
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});

const upload = multer({ storage });

export { upload };

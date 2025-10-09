import { Router, Request, Response } from "express";
import path from "path";
import { upload } from "../middleware/multer.middleware";

const router = Router();

// Single file upload
router.post("/", upload.single("file"), (req: Request, res: Response) => {
    console.log("file..",req.file)
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  console.log("fileurl",fileUrl)

  res.json({
    success: true,
    fileName: req.file.filename,
    url: fileUrl,
  });
});

export default router;

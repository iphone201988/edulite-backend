import { Router, Request, Response } from "express";
import path from "path";
import upload from "../middleware/multerS3.middleware";

const router = Router();

// Enhanced upload - handles both images AND videos
router.post("/", upload.single("file"), (req: any, res: Response) => {
  console.log("file..", req.file);
  
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }


  const fileUrl = `/${req.file.key}`;
  console.log("fileurl", fileUrl);

  // Video detection for better response
  const isVideo = req.file.mimetype.startsWith('video/');
  
  res.json({
    success: true,
    fileName: req.file.filename,
    url: fileUrl,
    mimeType: req.file.mimetype,
    size: req.file.size,
    isVideo: isVideo,
    previewUrl: isVideo ? null : fileUrl, // Images can be previewed directly
  });
});

export default router;
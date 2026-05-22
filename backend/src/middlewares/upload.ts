import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

const storage = multer.memoryStorage();

function userProfileFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  const allowedImages = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const allowedPdf = ["application/pdf"];

  if (file.fieldname === "avatar" && allowedImages.includes(file.mimetype)) {
    cb(null, true);
  } else if (file.fieldname === "resume" && allowedPdf.includes(file.mimetype)) {
    cb(null, true);
  } else if (file.fieldname === "avatar") {
    cb(new Error("Avatar must be an image (jpeg, png, webp, gif)."));
  } else if (file.fieldname === "resume") {
    cb(new Error("Resume must be a PDF file."));
  } else {
    cb(null, false);
  }
}

function companyProfileFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  const allowedImages = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  if (file.fieldname === "logo" && allowedImages.includes(file.mimetype)) {
    cb(null, true);
  } else if (file.fieldname === "logo") {
    cb(new Error("Logo must be an image (jpeg, png, webp, gif)."));
  } else {
    cb(null, false);
  }
}

export const uploadUserProfile = multer({
  storage,
  fileFilter: userProfileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).fields([
  { name: "avatar", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]);

export const uploadCompanyProfile = multer({
  storage,
  fileFilter: companyProfileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
  { name: "logo", maxCount: 1 },
]);

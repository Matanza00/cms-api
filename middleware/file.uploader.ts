import { s3 } from "../services/awsV3.s3";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import AsyncHandler from "../utils/AsyncHandler";
import ErrorHandler from "../utils/ErrorHandler";
import sharp from "sharp";

export const uploadImageOrFiles = (folderName: string) =>
  AsyncHandler(async (req: any, res: any, next: any) => {
    if (!req.files || req.files.length === 0) {
      // Check if files exist in request
      return next(new ErrorHandler("Please upload at least one image!", 400));
    }

    // Array to store promises for uploading each image
    const uploadPromises = req.files.map(async (file: any) => {
      let compressedBuffer;
      if (file.mimetype === "image/jpeg") {
        // Compress and resize JPEG images
        compressedBuffer = await sharp(file.buffer)
          .resize({
            height: 720,
            width: 720,
            fit: "contain",
          })
          .jpeg({ quality: 80 }) // JPEG compression quality (0-100)
          .toBuffer();
      } else if (file.mimetype === "image/png") {
        // Compress and resize PNG images
        compressedBuffer = await sharp(file.buffer)
          .resize({
            height: 720,
            width: 720,
            fit: "contain",
          })
          .png({ compressionLevel: 9 }) // PNG compression level (0-9)
          .toBuffer();
      } else {
        // For unsupported image formats, use the original buffer
        compressedBuffer = file.buffer;
      }

      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${folderName}/${file.originalname}`,
        Body: compressedBuffer,
        ContentType: file.mimetype,
      };

      const command = new PutObjectCommand(params);

      await s3.send(command);

      //   GET IMAGE FROM S3
      const getObjectParams = {
        Bucket: params.Bucket,
        Key: params.Key,
      };

      const getCommand = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, getCommand, {
        expiresIn: 3600 * 24 * 5,
      });

      return { imageName: params.Key, imageUrl: url };
    });

    // Execute all upload promises concurrently
    const results = await Promise.all(uploadPromises);

    // Store image names and URLs in request object
    req.images = results;
    next();
  });

export const updateImageOrFiles = (folderName: string) =>
  AsyncHandler(async (req: any, res: any, next: any) => {
    if (!req.files) {
      // Check if files exist in request
      return next();
    }

    // Array to store promises for uploading each image
    const uploadPromises = req.files.map(async (file: any) => {
      let compressedBuffer;
      if (file.mimetype === "image/jpeg") {
        // Compress and resize JPEG images
        compressedBuffer = await sharp(file.buffer)
          .resize({
            height: 720,
            width: 720,
            fit: "contain",
          })
          .jpeg({ quality: 80 }) // JPEG compression quality (0-100)
          .toBuffer();
      } else if (file.mimetype === "image/png") {
        // Compress and resize PNG images
        compressedBuffer = await sharp(file.buffer)
          .resize({
            height: 720,
            width: 720,
            fit: "contain",
          })
          .png({ compressionLevel: 9 }) // PNG compression level (0-9)
          .toBuffer();
      } else {
        // For unsupported image formats, use the original buffer
        compressedBuffer = file.buffer;
      }

      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${folderName}/${file.originalname}`,
        Body: compressedBuffer,
        ContentType: file.mimetype,
      };

      const command = new PutObjectCommand(params);

      await s3.send(command);

      //   GET IMAGE FROM S3
      const getObjectParams = {
        Bucket: params.Bucket,
        Key: params.Key,
      };

      const getCommand = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });

      return { imageName: params.Key, imageUrl: url };
    });

    // Execute all upload promises concurrently
    const results = await Promise.all(uploadPromises);

    // Store image names and URLs in request object
    req.images = results;
    next();
  });

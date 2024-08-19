import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface EncryptedData {
  encryptedPassword: string;
  key: string;
  iv: string;
}

// Generate random strong password function
function generateRandomPassword(length = 12) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

// Password encryption using cipher
function encryptPassword(password: string): EncryptedData {
  const algorithm = "aes-256-cbc";
  const key = crypto.randomBytes(32); // 256 bits
  const iv = crypto.randomBytes(16); // 128 bits

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encryptedPassword = cipher.update(password, "utf8", "hex");
  encryptedPassword += cipher.final("hex");

  return {
    encryptedPassword,
    key: key.toString("hex"),
    iv: iv.toString("hex"),
  };
}

// Password decryption using cipher
function decryptPassword(
  encryptedPassword: string,
  keyHex: string,
  ivHex: string
): string {
  const key = Buffer.from(keyHex, "hex");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

  let decryptedPassword = decipher.update(encryptedPassword, "hex", "utf8");
  decryptedPassword += decipher.final("utf8");

  return decryptedPassword;
}

// Generating jwt token
// function generateToken(_id: string): string {
//   return jwt.sign({ _id }, process.env.JWT_SECRET!, {
//     expiresIn: process.env.JWT_EXPIRES,
//   });
// }
function generateToken(_id: any): string {
  const expiresInDays = 28; // Set expiration to 28 days
  const expirationTime = `${expiresInDays}d`; // Format: "28d"

  return jwt.sign({ _id }, process.env.JWT_SECRET!, {
    expiresIn: expirationTime,
  });
}

// Example usage:
// const { encryptedPassword, key, iv } = encryptPassword("mySecretPassword");
// console.log("Encrypted Password:", encryptedPassword);
// console.log("Key:", key);
// console.log("IV:", iv);

// const decryptedPassword = decryptPassword(encryptedPassword, key, iv);
// console.log("Decrypted Password:", decryptedPassword);

export const getHashedPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  } catch (error: any) {
    throw new Error(error);
  }
};
// export const createJwtToken = (id: string) =>
//   jwt.sign({ id }, `${process.env.SECRET}`, { expiresIn: "3d" });
export const createJwtToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "28d" });

export const safeParseInt = (
  value: string | undefined | null
): number | null => {
  const parsed = parseInt(value || "", 10);
  return isNaN(parsed) ? null : parsed;
};

export const safeParseDate = (
  value: string | undefined | null
): Date | null => {
  const parsed = new Date(value || "");
  return isNaN(parsed.getTime()) ? null : parsed;
};

export {
  generateRandomPassword,
  encryptPassword,
  decryptPassword,
  generateToken,
};

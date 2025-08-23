import crypto from "crypto";

const BASE_64_KEY = process.env.AES_ENCRYPT_B64_KEY;
const IV_LENGTH = 12;

export function encrypt(text) {
  try {
    const ENC_KEY = Buffer.from(BASE_64_KEY, "base64");
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-gcm", ENC_KEY, iv);

    let encryptedData = cipher.update(text, "utf8", "hex");
    encryptedData += cipher.final("hex");

    const authTag = cipher.getAuthTag().toString("hex");
    const encryptedStr = `${
      iv.toString("hex") + ":" + authTag + ":" + encryptedData
    }`;
    //console.log("ENCRYPTED: ", encryptedStr, typeof encryptedStr);
    return encryptedStr;
  } catch (error) {
    console.log("encryption failed: ", error);
  }
}

export function decrypt(encrypted) {
  try {
    const ENC_KEY = Buffer.from(BASE_64_KEY, "base64");
    //console.log(JSON.stringify(encrypted), typeof encrypted);

    const [ivHex, authTagHex, cipherText] = encrypted.split(":");
    //console.log("SPLIT DATA", ivHex, authTagHex, cipherText);
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-gcm", ENC_KEY, iv);
    decipher.setAuthTag(authTag);

    let decryptedData = decipher.update(cipherText, "hex", "utf8");
    decryptedData += decipher.final("utf8");
    
    //console.log(decryptedData);
    return decryptedData;
  } catch (error) {
    console.log("decryption failed", error);
    return null;
  }
}

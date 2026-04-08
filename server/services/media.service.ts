import { writeFile, mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { createLogger } from "../utils/logger";

const logger = createLogger("media");

interface UploadedFile {
  filename?: string;
  data: Buffer;
  type?: string;
}

export const mediaService = {
  async saveFile(file: UploadedFile, type: string = "images") {
    logger.info("saveFile", `Saving file to ${type}`, {
      filename: file.filename,
    });

    const baseDir = resolve(process.cwd(), ".data/uploads", type);

    await mkdir(baseDir, { recursive: true });

    const timestamp = Date.now();
    const originalName = file.filename || "upload.bin";
    const cleanName = originalName.replace(/[^a-zA-Z0-9.]/g, "_");
    const filename = `${timestamp}-${cleanName}`;
    const filePath = join(baseDir, filename);

    await writeFile(filePath, file.data);

    logger.info("saveFile", `File saved: ${filename}`);

    return {
      url: `/media/${type}/${filename}`,
      filename: filename,
    };
  },
};

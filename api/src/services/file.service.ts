import * as fs from 'fs/promises';
import * as path from 'path';
import { UploadedFile } from 'express-fileupload';

export class FileService {
  async get(filePath: string): Promise<string> {
    try {
      const resolvedPath = path.resolve(filePath);
      return await fs.readFile(resolvedPath, 'utf8');
    } catch (error: any) {
      throw new Error(`Failed to read file at ${filePath}: ${error.message}`);
    }
  }

  async getBase64(filePath: string): Promise<string> {
    try {
      const resolvedPath = path.resolve(filePath);
      const fileBuffer = await fs.readFile(resolvedPath);
      return fileBuffer.toString('base64');
    } catch (error: any) {
      throw new Error(`Failed to read file as Base64 at ${filePath}: ${error.message}`);
    }
  }

  async put(filePath: string, content: string | Buffer): Promise<void> {
    try {
      const resolvedPath = path.resolve(filePath);
      await fs.mkdir(path.dirname(resolvedPath), { recursive: true });
      await fs.writeFile(resolvedPath, content);
    } catch (error: any) {
      throw new Error(`Failed to write to file at ${filePath}: ${error.message}`);
    }
  }

  async delete(filePath: string): Promise<void> {
    try {
      const resolvedPath = path.resolve(filePath);
      await fs.unlink(resolvedPath);
    } catch (error: any) {}
  }

  async upload(file: UploadedFile): Promise<any | null> {
    if (!file) {
      return null;
    }

    const timestamp = Date.now();
    const ext = path.extname(file.name);
    const baseName = path.basename(file.name, ext);
    const kebabName = baseName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');

    const newFileName = `${kebabName}-${timestamp}${ext}`;
    const uploadPath = path.join(__dirname, '../../uploads', newFileName);

    await file.mv(uploadPath);

    return {
      fileName: newFileName,
      filePath: `uploads/${newFileName}`,
      fileSize: file.size.toString(),
      fileExt: ext.substring(1),
    };
  }
}

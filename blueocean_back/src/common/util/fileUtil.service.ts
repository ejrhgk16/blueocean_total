import { PutObjectCommand, S3Client, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';

// ffmpeg.setFfmpegPath('C:\\ffmpeg-7.1.1-essentials_build\\ffmpeg-7.1.1-essentials_build\\bin\\ffmpeg.exe');

import { Readable, Writable } from 'stream';


 
@Injectable()
export class FileUtilService {

  private s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('S3_SECRET_ACCESS_KEY'),
      },
    });
    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME');
  }

  private async convertFile(file: any, baseFileName: string): Promise<{ buffer: Buffer, key: string, contentType: string }> {
 
    // Remove extension from the provided baseFileName
    const nameWithoutExt = baseFileName.split('.').slice(0, -1).join('.');
    
    const sharpInstance = sharp(file.buffer);
    const metadata = await sharpInstance.metadata();

    let newBuffer: Buffer;
    let newKey: string;
    let newContentType: string;

    // Animated GIF to WebM
    if (metadata.format === 'gif' && metadata.pages && metadata.pages > 1) {
      newKey = `img/${baseFileName}`;
      newContentType = 'image/webp';
      
      const readableStream = new Readable();
      readableStream._read = () => {};
      readableStream.push(file.buffer);
      readableStream.push(null);

      const chunks: any[] = [];
      const writableStream = new Writable({
        write(chunk, encoding, callback) {
          chunks.push(chunk);
          callback();
        }
      });

      await new Promise<void>((resolve, reject) => {
        ffmpeg()
          .input(readableStream)
          .inputFormat('gif')
          .outputFormat('webp')
          .on('error', (err) => reject(new InternalServerErrorException(`FFMPEG error: ${err.message}`)))
          .on('end', () => resolve())
          .pipe(writableStream, { end: true });
      });
      newBuffer = Buffer.concat(chunks);

    } else { // Static images (PNG, JPG, static GIF, WebP) to WebP
      newKey = `img/${baseFileName}`;
      newContentType = 'image/webp';
      newBuffer = await sharpInstance.webp({ quality: 80 }).toBuffer();
    }

    return { buffer: newBuffer, key: newKey, contentType: newContentType };
  }

  async uploadFile(file: any, fileName: any): Promise<any> {
    try {
      const { buffer, key, contentType } = await this.convertFile(file, fileName);

      const uploadParams = {
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      };

      const command = new PutObjectCommand(uploadParams);
      const uploadResult = await this.s3Client.send(command);

      if (uploadResult.$metadata.httpStatusCode !== 200) {
        throw new InternalServerErrorException('S3 file upload failed.');
      }
      
      return { key: key };

    } catch (error) {
      console.error('File upload or conversion failed:', error);
      throw new InternalServerErrorException('File upload or conversion failed.');
    }
  }

  async renameFile(oldKey: string, newKey: string): Promise<void> {
    if (oldKey === newKey) {
      return;
    }

    try {
      const copyParams = {
        Bucket: this.bucketName,
        CopySource: `${this.bucketName}/${oldKey}`,
        Key: newKey,
      };

      const copyCommand = new CopyObjectCommand(copyParams);
      await this.s3Client.send(copyCommand);

      const deleteParams = {
        Bucket: this.bucketName,
        Key: oldKey,
      };

      const deleteCommand = new DeleteObjectCommand(deleteParams);
      await this.s3Client.send(deleteCommand);
    } catch (error) {
      // console.log(oldKey, newKey, "s3file copy delete error", error)
    }
  }
}
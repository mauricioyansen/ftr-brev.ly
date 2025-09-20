import { env } from "@/env";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Inject, Injectable } from "@nestjs/common";
import { R2_CLIENT } from "./r2.provider";
import { randomUUID } from "node:crypto";

export interface UploadParams {
  fileName: string;
  contentType: string;
  body: Buffer | string;
}

@Injectable()
export class StorageService {
  constructor(@Inject(R2_CLIENT) private readonly r2: S3Client) {}

  async upload({ fileName, contentType, body }: UploadParams) {
    const uniqueFileName = `${randomUUID()}-${fileName}`;

    await this.r2.send(
      new PutObjectCommand({
        Bucket: env.CLOUDFLARE_BUCKET,
        Key: uniqueFileName,
        ContentType: contentType,
        Body: body,
      })
    );

    const publicUrl = new URL(
      uniqueFileName,
      env.CLOUDFLARE_PUBLIC_URL
    ).toString();

    return { url: publicUrl };
  }
}

import { env } from "@/env";
import { S3Client } from "@aws-sdk/client-s3";
import { FactoryProvider } from "@nestjs/common";

export const R2_CLIENT = "R2_CLIENT";

export const R2Provider: FactoryProvider<S3Client> = {
  provide: R2_CLIENT,
  useFactory: () => {
    const r2 = new S3Client({
      region: "auto",
      endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
        secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
      },
    });
    return r2;
  },
};

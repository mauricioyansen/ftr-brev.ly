import { Test, TestingModule } from "@nestjs/testing";
import { StorageService } from "./storage.service";
import { R2_CLIENT } from "./r2.provider";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/env";

const mockS3Client = {
  send: jest.fn(),
};

describe("StorageService", () => {
  let service: StorageService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: R2_CLIENT,
          useValue: mockS3Client,
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("upload", () => {
    it("should upload a file and return its public URL", async () => {
      const uploadParams = {
        fileName: "test-file.csv",
        contentType: "text/csv",
        body: "col1,col2\nval1,val2",
      };

      mockS3Client.send.mockResolvedValue({});

      const result = await service.upload(uploadParams);

      expect(mockS3Client.send).toHaveBeenCalledTimes(1);

      const sentCommand = mockS3Client.send.mock.calls[0][0];
      expect(sentCommand).toBeInstanceOf(PutObjectCommand);
      expect(sentCommand.input.Bucket).toBe(env.CLOUDFLARE_BUCKET);
      expect(sentCommand.input.ContentType).toBe(uploadParams.contentType);
      expect(sentCommand.input.Body).toBe(uploadParams.body);
      expect(sentCommand.input.Key).toMatch(/-test-file.csv$/);

      expect(result.url).toContain(env.CLOUDFLARE_PUBLIC_URL);
      expect(result.url).toContain("-test-file.csv");
    });
  });
});

import { Test, TestingModule } from "@nestjs/testing";
import { LinksService } from "./links.service";
import { DB_INSTANCE } from "@/infra/db/database.provider";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { StorageService } from "@/infra/storage/storage.service";
import { links } from "@/infra/db/schemas";
import { SQL } from "drizzle-orm";

jest.mock("nanoid", () => ({
  nanoid: jest.fn(() => "random-code"),
}));

describe("LinksService", () => {
  let service: LinksService;

  const mockReturning = jest.fn();
  const mockDb = {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    delete: jest.fn(() => ({
      where: jest.fn(() => ({
        returning: mockReturning,
      })),
    })),
    returning: jest.fn(),
  };

  const mockStorageService = {
    upload: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinksService,
        {
          provide: DB_INSTANCE,
          useValue: mockDb,
        },
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    service = module.get<LinksService>(LinksService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a link with a custom code", async () => {
      const fakeLink = { code: "custom-code", url: "https://google.com" };
      mockDb.returning.mockResolvedValue([fakeLink]);

      const result = await service.create({
        code: "custom-code",
        url: "https://google.com",
      });

      expect(result).toEqual(fakeLink);
      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockDb.values).toHaveBeenCalledWith({
        code: "custom-code",
        originalUrl: "https://google.com",
      });
    });

    it("should create a link with a random code if none is provided", async () => {
      const fakeLink = { code: "random-code", url: "https://google.com" };
      mockDb.returning.mockResolvedValue([fakeLink]);

      const result = await service.create({ url: "https://google.com" });

      expect(result).toEqual(fakeLink);
      expect(mockDb.values).toHaveBeenCalledWith({
        code: "random-code",
        originalUrl: "https://google.com",
      });
    });

    it("should throw a ConflictException if the code already exists", async () => {
      const drizzleError = new Error("Drizzle Query Error");
      (drizzleError as any).cause = {
        code: "23505",
      };

      mockDb.returning.mockImplementation(() => {
        throw drizzleError;
      });

      await expect(
        service.create({ code: "existing-code", url: "https://google.com" })
      ).rejects.toThrow(ConflictException);
    });
  });

  describe("findAll", () => {
    it("should return a list of links", async () => {
      const fakeLinks = [{ id: "1" }, { id: "2" }];
      mockDb.limit.mockResolvedValue(fakeLinks);

      const result = await service.findAll();

      expect(result).toEqual(fakeLinks);
      expect(mockDb.select).toHaveBeenCalled();
    });
  });

  describe("findByCode", () => {
    it("should return a link when found", async () => {
      const fakeLink = { code: "found-code" };
      mockDb.where.mockResolvedValue([fakeLink]);

      const result = await service.findByCode("found-code");

      expect(result).toEqual(fakeLink);
      expect(mockDb.where).toHaveBeenCalled();
    });

    it("should throw NotFoundException when link is not found", async () => {
      // Arrange
      mockDb.where.mockResolvedValue([]); // Simula o banco não retornando nada

      // Act & Assert
      await expect(service.findByCode("not-found-code")).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("delete", () => {
    it("should delete a link successfully", async () => {
      const fakeDeletedLink = { id: "some-id" };
      mockReturning.mockResolvedValue([fakeDeletedLink]);

      await expect(service.delete("some-id")).resolves.toBeUndefined();

      expect(mockDb.delete).toHaveBeenCalledWith(links);
    });

    it("should throw NotFoundException when link to delete is not found", async () => {
      mockReturning.mockResolvedValue([]);

      await expect(service.delete("not-found-id")).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("incrementAccessCount", () => {
    it("should call the update method with an atomic increment", async () => {
      mockDb.where.mockResolvedValue(undefined);

      await service.incrementAccessCount("some-code");

      expect(mockDb.update).toHaveBeenCalledWith(links);
      expect(mockDb.set).toHaveBeenCalledWith({
        accessCount: expect.any(SQL),
      });
    });
  });

  describe("exportToCsv", () => {
    it("should fetch links, call storage service, and return a URL", async () => {
      const fakeLinks = [
        { code: "a", originalUrl: "b", accessCount: 1, createdAt: new Date() },
      ];
      const fakeUrl = { url: "http://fake.url/file.csv" };
      mockDb.orderBy.mockResolvedValue(fakeLinks);
      mockStorageService.upload.mockResolvedValue(fakeUrl);

      const result = await service.exportToCsv();

      expect(result).toEqual(fakeUrl);
      expect(mockStorageService.upload).toHaveBeenCalledTimes(1);
      expect(mockStorageService.upload).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.stringContaining(
            "originalUrl,code,accessCount,createdAt"
          ),
          contentType: "text/csv",
        })
      );
    });

    it("should return a null URL if there are no links", async () => {
      mockDb.orderBy.mockResolvedValue([]);

      const result = await service.exportToCsv();

      expect(result).toEqual({ url: null });
      expect(mockStorageService.upload).not.toHaveBeenCalled();
    });
  });
});

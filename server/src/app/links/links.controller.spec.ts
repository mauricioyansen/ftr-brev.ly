import { Test, TestingModule } from "@nestjs/testing";
import { LinksController } from "./links.controller";
import { LinksService } from "./links.service";
import { CreateLinkDto } from "./dto/create-link.dto";
import { randomUUID } from "crypto";

describe("LinksController", () => {
  let controller: LinksController;

  const mockLinksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn(),
    exportToCsv: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinksController],
      providers: [
        {
          provide: LinksService,
          useValue: mockLinksService,
        },
      ],
    }).compile();

    controller = module.get<LinksController>(LinksController);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should call linksService.create with the correct data and return the result", async () => {
      const createLinkDto: CreateLinkDto = {
        url: "https://google.com",
        code: "google",
      };
      const expectedResult = {
        id: "1",
        ...createLinkDto,
        accessCount: 0,
        createdAt: new Date(),
      };

      mockLinksService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createLinkDto);

      expect(mockLinksService.create).toHaveBeenCalledWith(createLinkDto);

      expect(result).toEqual(expectedResult);
    });
  });

  describe("findAll", () => {
    it("should call linksService.findAll and return the result", async () => {
      const expectedResult = [
        { id: "1", code: "google", url: "https://google.com" },
      ];
      mockLinksService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(mockLinksService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("remove", () => {
    it("should call linksService.delete with the correct id", async () => {
      const linkId = randomUUID();
      mockLinksService.delete.mockResolvedValue(undefined);

      await controller.remove(linkId);

      expect(mockLinksService.delete).toHaveBeenCalledWith(linkId);
      expect(mockLinksService.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe("export", () => {
    it("should call linksService.exportToCsv and return its result", async () => {
      const expectedResult = { url: "http://fake.url/export.csv" };
      mockLinksService.exportToCsv.mockResolvedValue(expectedResult);

      const result = await controller.export();

      expect(mockLinksService.exportToCsv).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });
});

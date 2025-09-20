import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app/app.module";
import { DbType, pg } from "../src/infra/db";
import { links } from "../src/infra/db/schemas";
import { DB_INSTANCE } from "../src/infra/db/database.provider";
import { runMigrations } from "../src/infra/db/migrate";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { StorageService } from "@/infra/storage/storage.service";

describe("Links API (e2e)", () => {
  let app: INestApplication;
  let testDb: DbType;

  const mockStorageService = {
    upload: jest.fn(),
  };

  beforeAll(async () => {
    jest.setTimeout(30000);
    await runMigrations();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(StorageService)
      .useValue(mockStorageService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    testDb = app.get(DB_INSTANCE);
  });

  beforeEach(async () => {
    await testDb.delete(links);
    mockStorageService.upload.mockClear();
  });

  afterAll(async () => {
    await app.close();
    await pg.end();
  });

  describe("/links (POST)", () => {
    it("should create a new link", async () => {
      const response = await request(app.getHttpServer())
        .post("/links")
        .send({
          url: "https://google.com",
          code: "google",
        })
        .expect(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          code: "google",
          originalUrl: "https://google.com",
        })
      );
    });

    it("should return 409 (Conflict) when code already exists", async () => {
      await request(app.getHttpServer()).post("/links").send({
        url: "https://google.com",
        code: "google-duplicado",
      });

      return request(app.getHttpServer())
        .post("/links")
        .send({
          url: "https://outro-site.com",
          code: "google-duplicado",
        })
        .expect(409);
    });

    it("should return 400 (Bad Request) for malformed URL", () => {
      return request(app.getHttpServer())
        .post("/links")
        .send({ url: "url-invalida" })
        .expect(400);
    });

    it("should return 400 (Bad Request) for code shorter than 3 chars", () => {
      return request(app.getHttpServer())
        .post("/links")
        .send({ url: "https://google.com", code: "a" })
        .expect(400);
    });
  });

  describe("/links (GET)", () => {
    it("should return a list of links", async () => {
      await testDb.insert(links).values({
        code: "test-get",
        originalUrl: "https://test.com",
      });

      return request(app.getHttpServer())
        .get("/links")
        .expect(200)
        .then((response) => {
          expect(response.body).toBeInstanceOf(Array);
          expect(response.body.length).toBe(1);
          expect(response.body[0].code).toBe("test-get");
        });
    });
  });

  describe("/links/:id (DELETE)", () => {
    it("should delete a link successfully", async () => {
      const [createdLink] = await testDb
        .insert(links)
        .values({
          code: "para-deletar",
          originalUrl: "https://deletar.com",
        })
        .returning();

      await request(app.getHttpServer())
        .delete(`/links/${createdLink.id}`)
        .expect(204);

      const response = await request(app.getHttpServer()).get("/links");
      expect(response.body.length).toBe(0);
    });

    it("should return 404 (Not Found) when trying to delete a non-existent link", () => {
      const nonExistentId = randomUUID();
      return request(app.getHttpServer())
        .delete(`/links/${nonExistentId}`)
        .expect(404);
    });
  });

  describe("/links/code/:code (GET)", () => {
    it("should find a link by code and increment its access count", async () => {
      const [createdLink] = await testDb
        .insert(links)
        .values({
          code: "test-find",
          originalUrl: "https://findme.com",
          accessCount: 0,
        })
        .returning();

      await request(app.getHttpServer())
        .get(`/links/code/${createdLink.code}`)
        .expect(200)
        .then((response) => {
          expect(response.body.originalUrl).toBe("https://findme.com");
        });

      const linkInDb = await testDb.query.links.findFirst({
        where: eq(links.id, createdLink.id),
      });

      expect(linkInDb?.accessCount).toBe(1);
    });

    it("should return 404 (Not Found) for a non-existent code", () => {
      return request(app.getHttpServer())
        .get("/links/code/codigo-nao-existe")
        .expect(404);
    });
  });

  describe("/links/export (POST)", () => {
    it("should export links to CSV and return a URL", async () => {
      const fakeUrl = "http://fake-storage.com/export.csv";
      mockStorageService.upload.mockResolvedValue({ url: fakeUrl });

      await testDb.insert(links).values([
        { code: "link1", originalUrl: "https://site1.com" },
        { code: "link2", originalUrl: "https://site2.com" },
      ]);

      return request(app.getHttpServer())
        .post("/links/export")
        .expect(201)
        .then((response) => {
          expect(response.body.url).toBe(fakeUrl);

          expect(mockStorageService.upload).toHaveBeenCalledTimes(1);

          const uploadCall = mockStorageService.upload.mock.calls[0][0];
          expect(uploadCall.contentType).toBe("text/csv");
          expect(uploadCall.body).toContain("https://site1.com,link1");
          expect(uploadCall.body).toContain("https://site2.com,link2");
        });
    });

    it("should return a null URL if there are no links to export", () => {
      return request(app.getHttpServer())
        .post("/links/export")
        .expect(201)
        .then((response) => {
          expect(response.body.url).toBeNull();
          expect(mockStorageService.upload).not.toHaveBeenCalled();
        });
    });
  });
});

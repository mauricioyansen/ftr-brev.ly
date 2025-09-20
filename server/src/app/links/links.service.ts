import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { DB_INSTANCE } from "@/infra/db/database.provider";
import { DbType } from "@/infra/db";
import { links } from "@/infra/db/schemas";
import { CreateLinkDto } from "./dto/create-link.dto";
import { nanoid } from "nanoid";
import { desc, eq, sql } from "drizzle-orm";
import { unparse } from "papaparse";
import { StorageService } from "@/infra/storage/storage.service";

@Injectable()
export class LinksService {
  constructor(
    @Inject(DB_INSTANCE) private db: DbType,
    private readonly storage: StorageService
  ) {}

  async create(createLinkDto: CreateLinkDto) {
    const code = createLinkDto.code ?? nanoid(7);
    try {
      const [newLink] = await this.db
        .insert(links)
        .values({
          code,
          originalUrl: createLinkDto.url,
        })
        .returning();

      return newLink;
    } catch (error) {
      if (
        error instanceof Error &&
        "cause" in error &&
        error.cause &&
        typeof error.cause === "object" &&
        "code" in error.cause &&
        error.cause.code === "23505"
      ) {
        throw new ConflictException("Este código curto já está em uso.");
      }

      console.error("Um erro de banco de dados inesperado ocorreu:", error);

      throw error;
    }
  }

  async findAll() {
    return this.db
      .select()
      .from(links)
      .orderBy(desc(links.createdAt))
      .limit(100);
  }

  async findByCode(code: string) {
    const [link] = await this.db
      .select()
      .from(links)
      .where(eq(links.code, code));

    if (!link) {
      throw new NotFoundException("Link não encontrado.");
    }
    return link;
  }

  async incrementAccessCount(code: string) {
    await this.db
      .update(links)
      .set({ accessCount: sql`${links.accessCount} + 1` })
      .where(eq(links.code, code));
  }

  async delete(id: string) {
    const [deletedLink] = await this.db
      .delete(links)
      .where(eq(links.id, id))
      .returning();

    if (!deletedLink) {
      throw new NotFoundException("Link não encontrado para deleção.");
    }

    return;
  }

  async exportToCsv() {
    const allLinks = await this.db
      .select({
        originalUrl: links.originalUrl,
        code: links.code,
        accessCount: links.accessCount,
        createdAt: links.createdAt,
      })
      .from(links)
      .orderBy(desc(links.createdAt));

    if (allLinks.length === 0) {
      return { url: null };
    }

    const csv = unparse(allLinks, {
      header: true,
      columns: ["originalUrl", "code", "accessCount", "createdAt"],
    });

    const { url } = await this.storage.upload({
      fileName: "links-export.csv",
      contentType: "text/csv",
      body: csv,
    });

    return { url };
  }
}

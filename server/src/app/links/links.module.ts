import { Module } from "@nestjs/common";
import { LinksService } from "./links.service";
import { LinksController } from "./links.controller";
import { DatabaseModule } from "@/infra/db/database.module";
import { StorageModule } from "@/infra/storage/storage.module";

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [LinksController],
  providers: [LinksService],
})
export class LinksModule {}

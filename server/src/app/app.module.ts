import { Module } from "@nestjs/common";

import { DatabaseModule } from "@/infra/db/database.module";
import { LinksModule } from "./links/links.module";

@Module({
  imports: [DatabaseModule, LinksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

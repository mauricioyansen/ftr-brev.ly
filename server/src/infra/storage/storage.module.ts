import { Module } from "@nestjs/common";
import { R2Provider } from "./r2.provider";
import { StorageService } from "./storage.service";

@Module({
  providers: [R2Provider, StorageService],
  exports: [StorageService],
})
export class StorageModule {}

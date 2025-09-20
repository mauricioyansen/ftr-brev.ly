import { FactoryProvider } from "@nestjs/common";
import { db } from ".";

export const DB_INSTANCE = "DB_INSTANCE";

export const DatabaseProvider: FactoryProvider = {
  provide: DB_INSTANCE,
  useFactory: () => {
    return db;
  },
};

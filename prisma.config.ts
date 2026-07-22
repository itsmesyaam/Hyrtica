import "dotenv/config";
import { defineConfig } from "prisma/config";

const dbUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/hyrtica_placeholder";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: dbUrl,
  },
});

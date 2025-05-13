import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { env } from "cloudflare:workers";

export const db = new PrismaClient({
  adapter: new PrismaD1(env.DB),
});

// prime the WASM once so Vite never hangs in dev
await db.$queryRaw`SELECT 1`;

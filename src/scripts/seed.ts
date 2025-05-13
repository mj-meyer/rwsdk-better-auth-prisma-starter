import { defineScript } from "rwsdk/worker";
import { db } from "@/db";

export default defineScript(async ({ env }) => {
  await db.$executeRawUnsafe(`\
    DELETE FROM User;
    DELETE FROM sqlite_sequence;
  `);

  await db.user.create({
    data: {
      id: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      email: "mj@test.com",
      emailVerified: false,
      name: "test",
      image: null,
    },
  });

  console.log("🌱 Finished seeding");
});

import { hash } from "bcryptjs";
import { Role } from "@prisma/client";
import { prisma } from "../src/lib/prisma";

async function main() {
  const passwordHash = await hash("admin123", 12);

  await prisma.user.upsert({
    where: { email: "admin@clockroster.com" },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@clockroster.com",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log("Seeded default admin: admin@clockroster.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

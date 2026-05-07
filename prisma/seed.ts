import { hash } from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const password = await hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@clockroster.com" },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@clockroster.com",
      password,
      role: "ADMIN",
      status: "ACTIVE",
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

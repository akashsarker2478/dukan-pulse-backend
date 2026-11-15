import bcrypt from "bcryptjs";
import config from "../src/config";
import { prisma } from "../src/lib/prisma";
import { UserRole, UserStatus } from "../generated/prisma/enums";

async function main() {
  const email = config.admin_email;
  const password = config.admin_password;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Super-Admin",
      email,
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
    },
  });
  console.log(`✅ Super admin created: ${admin.email}`);
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

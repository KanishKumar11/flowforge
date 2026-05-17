import prisma from "../src/lib/db";

async function main() {
  const email = process.argv[2] || process.env.EMAIL;
  const role = process.argv[3] || process.env.ADMIN_ROLE || "ADMIN";

  if (!email) {
    console.error("Usage: npx tsx scripts/promote-admin.ts <email> [role]");
    process.exit(1);
  }

  console.log(`Promoting ${email} to admin role ${role}...`);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`User not found for email: ${email}`);
    process.exit(1);
  }

  const adminUser = await prisma.adminUser.upsert({
    where: { userId: user.id },
    create: { userId: user.id, role: role as any },
    update: { role: role as any, isActive: true },
  });

  console.log(`Promoted user ${email} (userId=${user.id}) to admin:`, adminUser);
}

main()
  .catch((error) => {
    console.error("Failed to promote admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

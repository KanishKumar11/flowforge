import prisma from "../src/lib/db";

async function main() {
  // Exact same query as admin users router
  const users = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      teamMembers: {
        where: { role: "OWNER" },
        select: { team: { select: { plan: true } } },
        take: 1,
      },
      _count: {
        select: { workflows: true, executions: true, teamMembers: true },
      },
    },
  });

  for (const u of users) {
    console.log(
      u.email,
      "-> plan:",
      u.teamMembers[0]?.team?.plan ?? "no-team",
      "| teamMembers:",
      JSON.stringify(u.teamMembers),
    );
  }

  await prisma.$disconnect();
}

main();

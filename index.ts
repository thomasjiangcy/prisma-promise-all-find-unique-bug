import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  for (let i = 0; i < 5; i++) {
    await prisma.connection.create({
      data: {
        name: `Connection ${i + 1}`,
        user: {
          create: {
            name: `User ${i + 1}`
          }
        }
      }
    });
  }

  const allConnections = await prisma.connection.findMany();
  const allConnectionTeamMembers_promiseAllFindUnique = await Promise.all(allConnections.map(async connection => await prisma.user.findUnique({
    where: {
      id: connection.userId
    }
  })));
  console.log(allConnectionTeamMembers_promiseAllFindUnique);

  const allConnectionTeamMembers_promiseAllFindUniqueOrThrow = await Promise.all(allConnections.map(async connection => await prisma.user.findUniqueOrThrow(({
    where: {
      id: connection.userId
    }
  }))));
  console.log(allConnectionTeamMembers_promiseAllFindUniqueOrThrow);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

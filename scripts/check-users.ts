import { prisma } from '../lib/prisma';

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true
      }
    });

    console.log('Total users:', users.length);
    console.log('Users:', users);

    const adminUser = await prisma.user.findFirst({
      where: {
        email: 'principkbk@gmail.com'
      }
    });

    if (adminUser) {
      console.log('\nAdmin user found:', adminUser.email);
    } else {
      console.log('\nAdmin user NOT found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
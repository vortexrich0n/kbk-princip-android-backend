const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'principkbk@gmail.com' },
      include: { membership: true }
    });

    if (user) {
      console.log('User found:');
      console.log('Email:', user.email);
      console.log('Name:', user.name);
      console.log('Role:', user.role);
      console.log('Email Verified:', user.emailVerified);
      console.log('Has membership:', !!user.membership);
      if (user.membership) {
        console.log('Membership active:', user.membership.active);
      }
    } else {
      console.log('User not found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyAdminEmail() {
  try {
    const email = 'principkbk@gmail.com';

    // Update user to have verified email and ADMIN role
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        role: 'ADMIN',
        verificationToken: null,
        verificationExpires: null
      }
    });

    console.log('✅ Admin email verified and role set!');
    console.log('Email:', updatedUser.email);
    console.log('Role:', updatedUser.role);
    console.log('Email Verified:', updatedUser.emailVerified);
    console.log('\nYou can now login at /admin-panel');

  } catch (error) {
    console.error('Error verifying admin email:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyAdminEmail();
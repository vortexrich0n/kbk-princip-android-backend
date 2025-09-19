const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    const adminEmail = 'principkbk@gmail.com';

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      // Update existing user to be admin
      const updatedAdmin = await prisma.user.update({
        where: { email: adminEmail },
        data: {
          role: 'ADMIN',
          emailVerified: true, // Admin should be verified
        }
      });
      console.log('✅ Updated existing user to admin:', updatedAdmin.email);
    } else {
      // Create new admin user (only for initial setup)
      console.log('❌ Admin user does not exist. Please create the user first through normal registration.');
      console.log('   Then run this script to grant admin privileges.');
      process.exit(1);
    }

    console.log('✅ Admin setup complete for:', adminEmail);
  } catch (error) {
    console.error('❌ Error setting up admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdmin();
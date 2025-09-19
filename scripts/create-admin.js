const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'principkbk@gmail.com';
  const password = 'Princip2024!'; // You should change this password
  const name = 'Admin KBK Princip';

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('User already exists. Updating to admin role...');

      // Update existing user to admin
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          role: 'admin',
          emailVerified: true
        }
      });

      console.log('✅ User updated to admin:', updatedUser.email);
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          name,
          role: 'admin',
          emailVerified: true,
          qrData: `admin-${Date.now()}`
        }
      });

      // Create membership for the admin
      await prisma.membership.create({
        data: {
          userId: newUser.id,
          active: true,
          startDate: new Date(),
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
        }
      });

      console.log('✅ Admin user created successfully!');
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('⚠️  Please change the password after first login!');
    }
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
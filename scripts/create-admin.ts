import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@kbkprincip.rs' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@kbkprincip.rs');
      return;
    }

    // Create admin user
    const passwordHash = await bcrypt.hash('admin123', 12);

    const admin = await prisma.user.create({
      data: {
        email: 'admin@kbkprincip.rs',
        passwordHash,
        name: 'Admin',
        role: 'ADMIN',
      }
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@kbkprincip.rs');
    console.log('Password: admin123');
    console.log('User ID:', admin.id);

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
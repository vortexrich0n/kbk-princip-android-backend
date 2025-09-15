import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Check if test user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@kbkprincip.rs' }
    });

    if (existingUser) {
      console.log('Test user already exists!');
      console.log('Email: test@kbkprincip.rs');
      return;
    }

    // Create test user
    const passwordHash = await bcrypt.hash('test123', 12);

    const user = await prisma.user.create({
      data: {
        email: 'test@kbkprincip.rs',
        passwordHash,
        name: 'Test Korisnik',
        role: 'USER',
        membership: {
          create: {
            active: true,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            plan: 'MESEČNA',
            type: 'STANDARD',
          }
        }
      },
      include: {
        membership: true
      }
    });

    console.log('Test user created successfully!');
    console.log('Email: test@kbkprincip.rs');
    console.log('Password: test123');
    console.log('User ID:', user.id);
    console.log('Membership active:', user.membership?.active);
    console.log('Membership expires:', user.membership?.expiresAt);

  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
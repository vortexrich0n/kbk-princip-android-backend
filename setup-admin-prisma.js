const { PrismaClient } = require('@prisma/client');

// Use the DATABASE_URL from environment (with pooler c-2)
process.env.DATABASE_URL = "postgresql://neondb_owner:npg_VkxulS56JXyH@ep-restless-mud-agpy12tw.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require";

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function setupAdmin() {
  try {
    console.log('🚀 KBK Princip - Admin Setup preko Prisma');
    console.log('==========================================\n');

    // Proveri da li korisnik postoji
    console.log('🔍 Tražim korisnika principkbk@gmail.com...');
    const user = await prisma.user.findUnique({
      where: { email: 'principkbk@gmail.com' },
      include: { membership: true }
    });

    if (!user) {
      console.log('\n❌ Korisnik principkbk@gmail.com NE POSTOJI u bazi!');
      console.log('📝 Molim te registruj se prvo kroz aplikaciju sa ovim email-om.');

      // Prikaži postojeće korisnike
      const users = await prisma.user.findMany({
        select: { email: true, role: true, emailVerified: true },
        take: 10,
        orderBy: { createdAt: 'desc' }
      });

      if (users.length > 0) {
        console.log('\n📋 Postojeći korisnici:');
        users.forEach(u => {
          console.log(`   - ${u.email} (${u.role}) ${u.emailVerified ? '✓' : '✗'}`);
        });
      }
      return;
    }

    console.log('\n✅ Korisnik pronađen!');
    console.log(`   Email: ${user.email}`);
    console.log(`   Ime: ${user.name || 'Nije postavljeno'}`);
    console.log(`   Trenutna uloga: ${user.role}`);
    console.log(`   Email verifikovan: ${user.emailVerified ? 'DA' : 'NE'}`);
    console.log(`   Članarina aktivna: ${user.membership?.active ? 'DA' : 'NE'}`);

    // Ažuriraj na ADMIN ako već nije
    if (user.role !== 'ADMIN' || !user.emailVerified) {
      console.log('\n🔄 Ažuriram korisnika na ADMIN...');

      const updated = await prisma.user.update({
        where: { email: 'principkbk@gmail.com' },
        data: {
          role: 'ADMIN',
          emailVerified: true
        }
      });

      console.log('\n✅ USPEŠNO AŽURIRANO!');
      console.log(`   Nova uloga: ${updated.role}`);
      console.log(`   Email verifikovan: ${updated.emailVerified ? 'DA' : 'NE'}`);
    } else {
      console.log('\n✅ Korisnik je već ADMIN sa verifikovanim email-om!');
    }

    // Prikaži sve admin korisnike
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        email: true,
        name: true,
        emailVerified: true,
        createdAt: true
      }
    });

    console.log('\n👑 Svi ADMIN korisnici:');
    admins.forEach((admin, i) => {
      console.log(`   ${i + 1}. ${admin.email} ${admin.emailVerified ? '✓' : '✗'}`);
      if (admin.name) console.log(`      Ime: ${admin.name}`);
      console.log(`      Registrovan: ${new Date(admin.createdAt).toLocaleDateString('sr-RS')}`);
    });

  } catch (error) {
    console.error('\n❌ Greška:', error.message);
    if (error.code === 'P2002') {
      console.error('   Email već postoji u bazi.');
    } else if (error.code === 'P2025') {
      console.error('   Korisnik nije pronađen.');
    }
  } finally {
    await prisma.$disconnect();
    console.log('\n🔒 Veza sa bazom zatvorena');
  }
}

setupAdmin().catch(console.error);
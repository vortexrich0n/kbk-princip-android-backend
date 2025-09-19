const { Client } = require('pg');

// Neon connection string (direct connection, not pooler)
const connectionString = 'postgresql://neondb_owner:npg_VkxulS56JXyH@ep-restless-mud-agpy12tw.eu-central-1.aws.neon.tech/neondb?sslmode=require';

async function setupAdmin() {
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('✅ Povezan sa Neon PostgreSQL bazom\n');

    // Proveri da li korisnik postoji
    const checkResult = await client.query(
      'SELECT id, email, role, "emailVerified", name FROM "User" WHERE email = $1',
      ['principkbk@gmail.com']
    );

    if (checkResult.rows.length === 0) {
      console.log('❌ Korisnik principkbk@gmail.com NE POSTOJI u bazi!');
      console.log('📝 Molim te registruj se prvo kroz aplikaciju sa ovim email-om.');
      console.log('   Zatim pokreni ovu skriptu ponovo.\n');

      // Prikaži sve postojeće korisnike
      const allUsers = await client.query('SELECT email, role FROM "User" ORDER BY "createdAt" DESC LIMIT 10');
      console.log('📋 Postojeći korisnici u bazi:');
      allUsers.rows.forEach(u => {
        console.log(`   - ${u.email} (${u.role})`);
      });

      return;
    }

    const user = checkResult.rows[0];
    console.log('👤 Pronađen korisnik:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Ime: ${user.name || 'Nije postavljeno'}`);
    console.log(`   Trenutna uloga: ${user.role}`);
    console.log(`   Email verifikovan: ${user.emailVerified ? 'DA' : 'NE'}`);
    console.log(`   ID: ${user.id}\n`);

    // Ažuriraj korisnika na ADMIN
    if (user.role !== 'ADMIN' || !user.emailVerified) {
      console.log('🔄 Ažuriram korisnika...');

      const updateResult = await client.query(
        'UPDATE "User" SET role = $1, "emailVerified" = $2 WHERE email = $3 RETURNING id, email, role, "emailVerified", name',
        ['ADMIN', true, 'principkbk@gmail.com']
      );

      const updatedUser = updateResult.rows[0];
      console.log('\n✅ USPEŠNO AŽURIRANO!');
      console.log(`   Nova uloga: ${updatedUser.role}`);
      console.log(`   Email verifikovan: ${updatedUser.emailVerified ? 'DA' : 'NE'}`);
    } else {
      console.log('✅ Korisnik je već ADMIN sa verifikovanim email-om!');
    }

    // Prikaži sve admina u sistemu
    console.log('\n👑 Svi ADMIN korisnici u sistemu:');
    const adminResult = await client.query(
      'SELECT email, name, "emailVerified", "createdAt" FROM "User" WHERE role = $1 ORDER BY "createdAt"',
      ['ADMIN']
    );

    if (adminResult.rows.length > 0) {
      adminResult.rows.forEach((admin, i) => {
        console.log(`   ${i + 1}. ${admin.email}`);
        console.log(`      Ime: ${admin.name || 'Nije postavljeno'}`);
        console.log(`      Verifikovan: ${admin.emailVerified ? 'DA' : 'NE'}`);
        console.log(`      Registrovan: ${new Date(admin.createdAt).toLocaleDateString('sr-RS')}`);
      });
    } else {
      console.log('   Nema admin korisnika.');
    }

  } catch (error) {
    console.error('❌ Greška:', error.message);
    if (error.detail) {
      console.error('   Detalji:', error.detail);
    }
  } finally {
    await client.end();
    console.log('\n🔒 Veza sa bazom zatvorena');
  }
}

// Pokreni skriptu
console.log('🚀 KBK Princip - Admin Setup za Neon PostgreSQL');
console.log('================================================\n');
setupAdmin();
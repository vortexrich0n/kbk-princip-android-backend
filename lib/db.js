const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        is_verified BOOLEAN DEFAULT false,
        verification_token VARCHAR(255),
        verification_token_expires TIMESTAMP,
        reset_token VARCHAR(255),
        reset_token_expires TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS memberships (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        active BOOLEAN DEFAULT true,
        start_date DATE DEFAULT CURRENT_DATE,
        end_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS checkins (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        qr_data VARCHAR(255),
        checked_in_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

async function createUser(email, password, name) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const result = await pool.query(
      `INSERT INTO users (email, password, name, verification_token, verification_token_expires)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, name, role, is_verified`,
      [email, hashedPassword, name, verificationToken, verificationTokenExpires]
    );

    return {
      user: result.rows[0],
      verificationToken
    };
  } catch (error) {
    if (error.code === '23505') {
      throw new Error('Email already exists');
    }
    throw error;
  }
}

async function getUserByEmail(email) {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
}

async function getUserById(id) {
  const result = await pool.query(
    'SELECT id, email, name, role, is_verified FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

async function verifyUser(token) {
  const result = await pool.query(
    `UPDATE users
     SET is_verified = true,
         verification_token = NULL,
         verification_token_expires = NULL
     WHERE verification_token = $1
     AND verification_token_expires > NOW()
     RETURNING id, email, name, role, is_verified`,
    [token]
  );

  if (result.rows.length === 0) {
    throw new Error('Invalid or expired verification token');
  }

  return result.rows[0];
}

async function generatePasswordResetToken(email) {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  const result = await pool.query(
    `UPDATE users
     SET reset_token = $1, reset_token_expires = $2
     WHERE email = $3
     RETURNING id, email, name`,
    [resetToken, resetTokenExpires, email]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  return {
    user: result.rows[0],
    resetToken
  };
}

async function resetPassword(token, newPassword) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const result = await pool.query(
    `UPDATE users
     SET password = $1,
         reset_token = NULL,
         reset_token_expires = NULL
     WHERE reset_token = $2
     AND reset_token_expires > NOW()
     RETURNING id, email, name, role`,
    [hashedPassword, token]
  );

  if (result.rows.length === 0) {
    throw new Error('Invalid or expired reset token');
  }

  return result.rows[0];
}

async function resendVerificationToken(email) {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const result = await pool.query(
    `UPDATE users
     SET verification_token = $1, verification_token_expires = $2
     WHERE email = $3 AND is_verified = false
     RETURNING id, email, name`,
    [verificationToken, verificationTokenExpires, email]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found or already verified');
  }

  return {
    user: result.rows[0],
    verificationToken
  };
}

module.exports = {
  pool,
  createTables,
  createUser,
  getUserByEmail,
  getUserById,
  verifyUser,
  generatePasswordResetToken,
  resetPassword,
  resendVerificationToken
};
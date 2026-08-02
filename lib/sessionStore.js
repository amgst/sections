const { Pool } = require('pg');

const connectionString = process.env.SUPABASE_POOLER_URL || process.env.SUPABASE_DIRECT_URL;

const pool = connectionString
  ? new Pool({ connectionString, ssl: { rejectUnauthorized: false } })
  : null;

let ensureTablePromise = null;

function ensureTable() {
  if (!pool) {
    throw new Error('No Supabase connection string configured (SUPABASE_POOLER_URL / SUPABASE_DIRECT_URL)');
  }
  if (!ensureTablePromise) {
    ensureTablePromise = pool.query(`
      CREATE TABLE IF NOT EXISTS shopify_sessions (
        shop TEXT PRIMARY KEY,
        access_token TEXT NOT NULL,
        scope TEXT,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
  }
  return ensureTablePromise;
}

async function getOfflineToken(shop) {
  await ensureTable();
  const { rows } = await pool.query(
    'SELECT access_token, scope FROM shopify_sessions WHERE shop = $1',
    [shop]
  );
  if (!rows[0]) return null;
  return { accessToken: rows[0].access_token, scope: rows[0].scope };
}

async function saveOfflineToken(shop, accessToken, scope) {
  await ensureTable();
  await pool.query(
    `INSERT INTO shopify_sessions (shop, access_token, scope, updated_at)
     VALUES ($1, $2, $3, now())
     ON CONFLICT (shop) DO UPDATE SET access_token = $2, scope = $3, updated_at = now()`,
    [shop, accessToken, scope]
  );
}

async function deleteOfflineToken(shop) {
  await ensureTable();
  await pool.query('DELETE FROM shopify_sessions WHERE shop = $1', [shop]);
}

module.exports = { getOfflineToken, saveOfflineToken, deleteOfflineToken };

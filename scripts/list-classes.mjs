/**
 * One-off: lista klas + kodow zaproszen + liczby uczniow.
 * Uzycie: node scripts/list-classes.mjs
 */
import pg from "pg";
import { readFileSync } from "node:fs";

function loadEnv(path) {
  try {
    const c = readFileSync(path, "utf8");
    const out = {};
    for (const line of c.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)\s*=\s*"?(.*?)"?\s*$/);
      if (m) out[m[1]] = m[2];
    }
    return out;
  } catch { return {}; }
}
const env = { ...loadEnv(".env.production"), ...process.env };
const url = env.POSTGRES_URL || env.DATABASE_URL;
if (!url) { console.error("Brak POSTGRES_URL"); process.exit(1); }

const pool = new pg.Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
try {
  const { rows } = await pool.query(
    `SELECT mc.invite_code, mc.name, mc.invite_code_expires_at, mc.archived_at,
            ga.name AS mentor_name, ga.email,
            (SELECT COUNT(*) FROM class_memberships cm WHERE cm.class_id = mc.id AND cm.left_at IS NULL) AS student_count
       FROM mentor_classes mc
       LEFT JOIN gm_accounts ga ON ga.id = mc.gm_account_id
       ORDER BY mc.created_at DESC`
  );
  if (!rows.length) { console.log("Brak klas w bazie."); process.exit(0); }
  console.log(`\n${rows.length} klas:\n`);
  for (const r of rows) {
    const exp = r.invite_code_expires_at ? new Date(r.invite_code_expires_at).toLocaleDateString("pl-PL") : "—";
    const status = r.archived_at ? "ARCHIVED" : "OK";
    console.log(`[${status}] ${r.invite_code}  ·  ${r.name}  ·  mentor: ${r.mentor_name} (${r.email})  ·  ${r.student_count} uczn.  ·  wygasa ${exp}`);
  }
} finally {
  await pool.end();
}

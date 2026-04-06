import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { getDb } from "@/lib/db";

/** Ensure user exists in DB, return user row */
export async function GET() {
  try {
    if (!auth0) return NextResponse.json({ error: "Auth not configured" }, { status: 500 });

    const session = await auth0.getSession();
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const sql = getDb();
    const { sub, email, name, picture } = session.user;

    // Upsert user
    const rows = await sql`
      INSERT INTO users (id, auth0_id, email, name, picture)
      VALUES (${sub}, ${sub}, ${email ?? null}, ${name ?? null}, ${picture ?? null})
      ON CONFLICT (auth0_id) DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        picture = EXCLUDED.picture
      RETURNING id
    `;

    return NextResponse.json({ userId: rows[0].id });
  } catch (error) {
    console.error("[API /user GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

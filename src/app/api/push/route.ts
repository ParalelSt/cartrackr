import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { getDb } from "@/lib/db";

async function getUserId() {
  if (!auth0) return null;
  const session = await auth0.getSession();
  return session?.user?.sub ?? null;
}

/** Save a push subscription */
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const sql = getDb();
    const { endpoint, keys } = await request.json();

    await sql`
      INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
      VALUES (${userId}, ${endpoint}, ${keys.p256dh}, ${keys.auth})
      ON CONFLICT (endpoint) DO UPDATE SET
        user_id = ${userId},
        p256dh = ${keys.p256dh},
        auth = ${keys.auth}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /push POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** Remove a push subscription */
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const sql = getDb();
    const { endpoint } = await request.json();

    await sql`DELETE FROM push_subscriptions WHERE user_id = ${userId} AND endpoint = ${endpoint}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /push DELETE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

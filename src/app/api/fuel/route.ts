import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { getDb } from "@/lib/db";

async function getUserId() {
  if (!auth0) return null;
  const session = await auth0.getSession();
  return session?.user?.sub ?? null;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const sql = getDb();
    const vehicleId = request.nextUrl.searchParams.get("vehicleId");

    let entries;
    if (vehicleId) {
      entries = await sql`
        SELECT id, vehicle_id as "vehicleId", date, odometer, liters, total_cost as "totalCost",
               price_per_liter as "pricePerLiter", notes
        FROM fuel_entries
        WHERE user_id = ${userId} AND vehicle_id = ${vehicleId}
        ORDER BY date DESC, created_at DESC
      `;
    } else {
      entries = await sql`
        SELECT id, vehicle_id as "vehicleId", date, odometer, liters, total_cost as "totalCost",
               price_per_liter as "pricePerLiter", notes
        FROM fuel_entries
        WHERE user_id = ${userId}
        ORDER BY date DESC, created_at DESC
      `;
    }

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("[API /fuel GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const sql = getDb();
    const body = await request.json();
    const { id, vehicleId, date, odometer, liters, totalCost, pricePerLiter, notes } = body;

    await sql`
      INSERT INTO fuel_entries (id, vehicle_id, user_id, date, odometer, liters, total_cost, price_per_liter, notes)
      VALUES (${id}, ${vehicleId}, ${userId}, ${date}, ${odometer}, ${liters}, ${totalCost}, ${pricePerLiter}, ${notes ?? null})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /fuel POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const sql = getDb();
    const { id } = await request.json();

    await sql`DELETE FROM fuel_entries WHERE id = ${id} AND user_id = ${userId}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /fuel DELETE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

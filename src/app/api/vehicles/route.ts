import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { getDb } from "@/lib/db";

async function getUserId() {
  if (!auth0) return null;
  const session = await auth0.getSession();
  return session?.user?.sub ?? null;
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const sql = getDb();

    const vehicles = await sql`
      SELECT id, name, make, model, year, fuel_type as "fuelType", odometer, created_at as "createdAt"
      FROM vehicles WHERE user_id = ${userId} ORDER BY created_at DESC
    `;

    const activeRows = await sql`
      SELECT vehicle_id FROM active_vehicles WHERE user_id = ${userId}
    `;
    const activeVehicleId = activeRows[0]?.vehicle_id ?? null;

    return NextResponse.json({ vehicles, activeVehicleId });
  } catch (error) {
    console.error("[API /vehicles GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const sql = getDb();
    const body = await request.json();
    const { id, name, make, model, year, fuelType, odometer } = body;

    await sql`
      INSERT INTO vehicles (id, user_id, name, make, model, year, fuel_type, odometer)
      VALUES (${id}, ${userId}, ${name}, ${make}, ${model}, ${year}, ${fuelType}, ${odometer})
    `;

    // If first vehicle, set as active
    const count = await sql`SELECT COUNT(*) as c FROM vehicles WHERE user_id = ${userId}`;
    if (Number(count[0].c) === 1) {
      await sql`
        INSERT INTO active_vehicles (user_id, vehicle_id) VALUES (${userId}, ${id})
        ON CONFLICT (user_id) DO UPDATE SET vehicle_id = ${id}
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /vehicles POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const sql = getDb();
    const { id } = await request.json();

    await sql`DELETE FROM vehicles WHERE id = ${id} AND user_id = ${userId}`;

    // If deleted vehicle was active, switch to another
    const activeRows = await sql`SELECT vehicle_id FROM active_vehicles WHERE user_id = ${userId}`;
    if (activeRows.length === 0 || activeRows[0].vehicle_id === id) {
      const remaining = await sql`SELECT id FROM vehicles WHERE user_id = ${userId} LIMIT 1`;
      if (remaining.length > 0) {
        await sql`
          INSERT INTO active_vehicles (user_id, vehicle_id) VALUES (${userId}, ${remaining[0].id})
          ON CONFLICT (user_id) DO UPDATE SET vehicle_id = ${remaining[0].id}
        `;
      } else {
        await sql`DELETE FROM active_vehicles WHERE user_id = ${userId}`;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /vehicles DELETE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const sql = getDb();
    const { activeVehicleId } = await request.json();

    await sql`
      INSERT INTO active_vehicles (user_id, vehicle_id) VALUES (${userId}, ${activeVehicleId})
      ON CONFLICT (user_id) DO UPDATE SET vehicle_id = ${activeVehicleId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /vehicles PATCH]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

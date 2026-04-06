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
    const rows = await sql`
      SELECT notifications_enabled as "notificationsEnabled",
             fuel_reminder as "fuelReminder",
             fuel_reminder_days as "fuelReminderDays",
             maintenance_reminder as "maintenanceReminder",
             maintenance_reminder_days as "maintenanceReminderDays",
             currency, distance_unit as "distanceUnit", volume_unit as "volumeUnit"
      FROM user_settings WHERE user_id = ${userId}
    `;

    if (rows.length === 0) {
      return NextResponse.json({ settings: null });
    }

    return NextResponse.json({ settings: rows[0] });
  } catch (error) {
    console.error("[API /settings GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const sql = getDb();
    const body = await request.json();

    await sql`
      INSERT INTO user_settings (user_id, notifications_enabled, fuel_reminder, fuel_reminder_days,
        maintenance_reminder, maintenance_reminder_days, currency, distance_unit, volume_unit, updated_at)
      VALUES (${userId}, ${body.notificationsEnabled}, ${body.fuelReminder}, ${body.fuelReminderDays},
        ${body.maintenanceReminder}, ${body.maintenanceReminderDays}, ${body.currency},
        ${body.distanceUnit}, ${body.volumeUnit}, NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        notifications_enabled = EXCLUDED.notifications_enabled,
        fuel_reminder = EXCLUDED.fuel_reminder,
        fuel_reminder_days = EXCLUDED.fuel_reminder_days,
        maintenance_reminder = EXCLUDED.maintenance_reminder,
        maintenance_reminder_days = EXCLUDED.maintenance_reminder_days,
        currency = EXCLUDED.currency,
        distance_unit = EXCLUDED.distance_unit,
        volume_unit = EXCLUDED.volume_unit,
        updated_at = NOW()
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /settings PUT]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

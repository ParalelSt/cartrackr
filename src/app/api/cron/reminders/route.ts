import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:noreply@cartrackr.vercel.app",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sql = getDb();

    // Find users with fuel reminders enabled who have push subscriptions
    const users = await sql`
      SELECT
        us.user_id,
        us.fuel_reminder_days,
        ps.endpoint,
        ps.p256dh,
        ps.auth,
        (
          SELECT MAX(fe.date)
          FROM fuel_entries fe
          WHERE fe.user_id = us.user_id
        ) as last_fuel_date
      FROM user_settings us
      JOIN push_subscriptions ps ON ps.user_id = us.user_id
      WHERE us.notifications_enabled = true
        AND us.fuel_reminder = true
    `;

    let sent = 0;
    let cleaned = 0;

    for (const row of users) {
      // Check if reminder is due
      const daysSinceLastFuel = row.last_fuel_date
        ? Math.floor(
            (Date.now() - new Date(row.last_fuel_date).getTime()) /
              (1000 * 60 * 60 * 24),
          )
        : 999; // No entries ever = definitely remind

      if (daysSinceLastFuel < row.fuel_reminder_days) continue;

      const payload = JSON.stringify({
        title: "Fuel Reminder",
        body: `You haven't logged fuel in ${daysSinceLastFuel} days. Time to fill up?`,
        tag: "fuel-reminder",
        url: "/fuel/add",
      });

      try {
        await webpush.sendNotification(
          {
            endpoint: row.endpoint,
            keys: { p256dh: row.p256dh, auth: row.auth },
          },
          payload,
        );
        sent++;
      } catch (err: unknown) {
        // If subscription is expired/invalid, remove it
        if (
          err &&
          typeof err === "object" &&
          "statusCode" in err &&
          ((err as { statusCode: number }).statusCode === 404 ||
            (err as { statusCode: number }).statusCode === 410)
        ) {
          await sql`DELETE FROM push_subscriptions WHERE endpoint = ${row.endpoint}`;
          cleaned++;
        } else {
          console.error("[CRON] Push failed for", row.endpoint, err);
        }
      }
    }

    return NextResponse.json({
      ok: true,
      checked: users.length,
      sent,
      cleaned,
    });
  } catch (error) {
    console.error("[CRON /reminders]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

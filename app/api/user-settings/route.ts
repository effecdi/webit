import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth, isUnauthorized } from '@/lib/api-auth';

const DEFAULTS = {
  notifMessage: true,
  notifSchedule: true,
  notifAnniversary: true,
  notifGift: false,
  notifDaily: false,
  privacyProfileVisible: true,
  privacyLocationShare: false,
  privacyReadReceipt: true,
  privacyOnlineStatus: true,
  privacyActivityShare: false,
  supportNewsletter: true,
  supportEventNotify: true,
  supportFeedback: false,
  supportSurvey: false,
};

export async function GET() {
  const auth = await requireAuth();
  if (isUnauthorized(auth)) return auth;

  const [existing] = await db.select().from(userSettings).where(eq(userSettings.userId, auth.userId));

  if (!existing) {
    return NextResponse.json(DEFAULTS);
  }

  return NextResponse.json({
    notifMessage: existing.notifMessage,
    notifSchedule: existing.notifSchedule,
    notifAnniversary: existing.notifAnniversary,
    notifGift: existing.notifGift,
    notifDaily: existing.notifDaily,
    privacyProfileVisible: existing.privacyProfileVisible,
    privacyLocationShare: existing.privacyLocationShare,
    privacyReadReceipt: existing.privacyReadReceipt,
    privacyOnlineStatus: existing.privacyOnlineStatus,
    privacyActivityShare: existing.privacyActivityShare,
    supportNewsletter: existing.supportNewsletter,
    supportEventNotify: existing.supportEventNotify,
    supportFeedback: existing.supportFeedback,
    supportSurvey: existing.supportSurvey,
  });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAuth();
  if (isUnauthorized(auth)) return auth;

  const body = await req.json();

  const values = {
    userId: auth.userId,
    notifMessage: body.notifMessage ?? DEFAULTS.notifMessage,
    notifSchedule: body.notifSchedule ?? DEFAULTS.notifSchedule,
    notifAnniversary: body.notifAnniversary ?? DEFAULTS.notifAnniversary,
    notifGift: body.notifGift ?? DEFAULTS.notifGift,
    notifDaily: body.notifDaily ?? DEFAULTS.notifDaily,
    privacyProfileVisible: body.privacyProfileVisible ?? DEFAULTS.privacyProfileVisible,
    privacyLocationShare: body.privacyLocationShare ?? DEFAULTS.privacyLocationShare,
    privacyReadReceipt: body.privacyReadReceipt ?? DEFAULTS.privacyReadReceipt,
    privacyOnlineStatus: body.privacyOnlineStatus ?? DEFAULTS.privacyOnlineStatus,
    privacyActivityShare: body.privacyActivityShare ?? DEFAULTS.privacyActivityShare,
    supportNewsletter: body.supportNewsletter ?? DEFAULTS.supportNewsletter,
    supportEventNotify: body.supportEventNotify ?? DEFAULTS.supportEventNotify,
    supportFeedback: body.supportFeedback ?? DEFAULTS.supportFeedback,
    supportSurvey: body.supportSurvey ?? DEFAULTS.supportSurvey,
    updatedAt: new Date(),
  };

  const [existing] = await db.select().from(userSettings).where(eq(userSettings.userId, auth.userId));

  if (existing) {
    const [updated] = await db.update(userSettings)
      .set(values)
      .where(eq(userSettings.userId, auth.userId))
      .returning();
    return NextResponse.json(updated);
  } else {
    const [created] = await db.insert(userSettings).values(values).returning();
    return NextResponse.json(created);
  }
}

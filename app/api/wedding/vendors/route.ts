import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { weddingVendors, expenses } from '@/db/schema';
import { eq, and, inArray, desc } from 'drizzle-orm';
import { requireAuth, isUnauthorized } from '@/lib/api-auth';
import { getCoupleUserIds } from '@/lib/couple-utils';

export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (isUnauthorized(auth)) return auth;
  const userId = auth.userId;
  const coupleUserIds = await getCoupleUserIds(userId);
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('mode') || 'wedding';
  const category = searchParams.get('category');

  try {
    const conditions = [
      inArray(weddingVendors.userId, coupleUserIds),
      eq(weddingVendors.mode, mode),
    ];

    if (category) {
      conditions.push(eq(weddingVendors.category, category));
    }

    const result = await db.select().from(weddingVendors)
      .where(and(...conditions))
      .orderBy(desc(weddingVendors.createdAt));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching wedding vendors:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (isUnauthorized(auth)) return auth;
    const userId = auth.userId;
    const body = await request.json();

    const {
      category,
      name,
      price,
      pros,
      cons,
      notes,
      preference,
      status,
      mode = 'wedding',
      contractDate,
    } = body;

    if (!category || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [newVendor] = await db.insert(weddingVendors).values({
      userId,
      mode,
      category,
      name,
      price: typeof price === 'number' ? price : price ? Number(price) : 0,
      pros,
      cons,
      notes,
      preference: typeof preference === 'number' ? preference : preference ? Number(preference) : 0,
      status: status || 'candidate',
      contractDate: contractDate ? new Date(contractDate) : null,
    }).returning();

    return NextResponse.json(newVendor);
  } catch (error) {
    console.error('Error creating wedding vendor:', error);
    return NextResponse.json({ error: 'Failed to create wedding vendor' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (isUnauthorized(auth)) return auth;
    const userId = auth.userId;
    const coupleUserIds = await getCoupleUserIds(userId);
    const body = await request.json();
    const { id, ...rest } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};

    if (rest.category !== undefined) updates.category = rest.category;
    if (rest.name !== undefined) updates.name = rest.name;
    if (rest.price !== undefined) {
      updates.price = typeof rest.price === 'number' ? rest.price : Number(rest.price);
    }
    if (rest.pros !== undefined) updates.pros = rest.pros;
    if (rest.cons !== undefined) updates.cons = rest.cons;
    if (rest.notes !== undefined) updates.notes = rest.notes;
    if (rest.preference !== undefined) {
      updates.preference = typeof rest.preference === 'number' ? rest.preference : Number(rest.preference);
    }
    if (rest.status !== undefined) updates.status = rest.status;
    if (rest.contractDate !== undefined) {
      updates.contractDate = rest.contractDate ? new Date(rest.contractDate) : null;
    }

    let updatedVendor = null;

    if (rest.status === 'contracted') {
      const current = await db.select().from(weddingVendors).where(eq(weddingVendors.id, id));
      if (current.length > 0) {
        const vendor = current[0];
        const category = vendor.category;

        await db.update(weddingVendors)
          .set({ status: 'candidate' })
          .where(
            and(
              inArray(weddingVendors.userId, coupleUserIds),
              eq(weddingVendors.mode, vendor.mode),
              eq(weddingVendors.category, category),
            ),
          );

        const [updated] = await db.update(weddingVendors)
          .set(updates)
          .where(eq(weddingVendors.id, id))
          .returning();

        updatedVendor = updated;

        const title = `${vendor.category} - ${vendor.name}`;

        const existingExpenses = await db
          .select()
          .from(expenses)
          .where(
            and(
              eq(expenses.userId, userId),
              eq(expenses.mode, vendor.mode),
              eq(expenses.category, vendor.category),
              eq(expenses.title, title),
            ),
          );

        if (existingExpenses.length === 0) {
          await db.insert(expenses).values({
            userId,
            title,
            amount: (vendor.price ?? 0).toString(),
            category: vendor.category,
            vendorId: vendor.id,
            vendorName: vendor.name,
            date: new Date(),
            isPaid: false,
            memo: '업체 비교에서 자동 생성된 항목',
            mode: vendor.mode,
          });
        }
      }
    } else {
      const [updated] = await db.update(weddingVendors)
        .set(updates)
        .where(eq(weddingVendors.id, id))
        .returning();

      updatedVendor = updated;
    }

    return NextResponse.json(updatedVendor);
  } catch (error) {
    console.error('Error updating wedding vendor:', error);
    return NextResponse.json({ error: 'Failed to update wedding vendor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  try {
    await db.delete(weddingVendors).where(eq(weddingVendors.id, parseInt(id, 10)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting wedding vendor:', error);
    return NextResponse.json({ error: 'Failed to delete wedding vendor' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-utils';
import { UserStats } from '@/types/user';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin(request);

    const client = await import('@/lib/dbConnect').then(m => m.default);
    const db = client.db("240academy");

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      total,
      active,
      users,
      admins,
      newThisMonth
    ] = await Promise.all([
      db.collection('user').countDocuments(),
      db.collection('user').countDocuments({ isActive: { $ne: false } }),
      db.collection('user').countDocuments({ role: { $ne: 'admin' } }),
      db.collection('user').countDocuments({ role: 'admin' }),
      db.collection('user').countDocuments({ 
        createdAt: { $gte: startOfMonth } 
      })
    ]);

    const stats: UserStats = {
      total,
      active,
      students: users,
      admins,
      newThisMonth
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении статистики пользователей' },
      { status: 500 }
    );
  }
}
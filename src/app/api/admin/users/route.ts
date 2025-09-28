import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';

    const client = await import('@/lib/dbConnect').then(m => m.default);
    const db = client.db("240academy");

    const query: Record<string, unknown> = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      db.collection('user').find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection('user').countDocuments(query)
    ]);

    const usersWithCounts = users.map((user) => {
      return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        isActive: user.isActive !== false,
        createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
        lastLoginAt: user.lastLoginAt?.toISOString(),
        testResultsCount: 0,
        completedCoursesCount: 0
      };
    });

    return NextResponse.json({
      users: usersWithCounts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении пользователей' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { userId, isActive, role } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'ID пользователя обязателен' }, { status: 400 });
    }

    const client = await import('@/lib/dbConnect').then(m => m.default);
    const db = client.db("240academy");

    const updateData: Record<string, unknown> = {};
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (role && ['user', 'admin'].includes(role)) updateData.role = role;

    const result = await db.collection('user').findOneAndUpdate(
      { _id: userId },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    return NextResponse.json({
      _id: result._id.toString(),
      name: result.name,
      email: result.email,
      role: result.role || 'user',
      isActive: result.isActive !== false,
      createdAt: result.createdAt?.toISOString() || new Date().toISOString(),
      lastLoginAt: result.lastLoginAt?.toISOString()
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении пользователя' },
      { status: 500 }
    );
  }
}
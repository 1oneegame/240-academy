import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-utils';
import clientPromise from '@/lib/dbConnect';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const client = await clientPromise;
    const db = client.db("240academy");
    
    const resources = await db.collection('resources').find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(resources);
  } catch (error) {
    console.error('Ошибка при получении ресурсов:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Не авторизован') {
        return NextResponse.json(
          { error: 'Не авторизован' },
          { status: 401 }
        );
      }
      if (error.message === 'Недостаточно прав') {
        return NextResponse.json(
          { error: 'Недостаточно прав' },
          { status: 403 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

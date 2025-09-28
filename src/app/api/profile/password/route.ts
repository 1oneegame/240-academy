import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/dbConnect';

export const runtime = 'nodejs';

export async function PUT(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('better-auth.session_token')?.value;
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("240academy");
    
    const tokenPart = sessionToken.split('.')[0];
    
    const session = await db.collection('session').findOne({
      token: { $regex: `^${tokenPart}` }
    });

    if (!session) {
      return NextResponse.json({ error: 'Неверная сессия' }, { status: 401 });
    }

    const user = await db.collection('user').findOne({
      _id: session.userId
    });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 401 });
    }

    const { password } = await request.json();

    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Пароль должен содержать минимум 6 символов' }, { status: 400 });
    }

    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await db.collection('user').updateOne(
      { _id: user._id },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Пароль изменен'
    });

  } catch {
    return NextResponse.json(
      { error: 'Ошибка сервера при изменении пароля' },
      { status: 500 }
    );
  }
}

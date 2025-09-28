import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/dbConnect';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
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

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      surname: user.surname
    });

  } catch {
    return NextResponse.json(
      { error: 'Ошибка сервера при получении профиля' },
      { status: 500 }
    );
  }
}

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

    const { name, email, phone, surname } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Имя и email обязательны' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {
      name,
      email,
      updatedAt: new Date()
    };

    if (phone) updateData.phone = phone;
    if (surname) updateData.surname = surname;

    const result = await db.collection('user').updateOne(
      { _id: user._id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Профиль обновлен'
    });

  } catch {
    return NextResponse.json(
      { error: 'Ошибка сервера при обновлении профиля' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/dbConnect';

export const runtime = 'nodejs';

export async function PUT(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('better-auth.session_token')?.value;
    
    if (!sessionToken) {
      console.warn('password.change: no session token');
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("240academy");
    
    const tokenPart = sessionToken.split('.')[0];
    
    const session = await db.collection('session').findOne({
      token: { $regex: `^${tokenPart}` }
    });

    if (!session) {
      console.warn('password.change: session not found', { tokenPart });
      return NextResponse.json({ error: 'Неверная сессия' }, { status: 401 });
    }

    const user = await db.collection('user').findOne({
      _id: session.userId
    });

    if (!user) {
      console.warn('password.change: user not found', { userId: String(session.userId) });
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 401 });
    }

    const { password } = await request.json();

    if (!password || password.length < 6) {
      console.warn('password.change: invalid password length', { userId: String(user._id) });
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
      console.error('password.change: user update failed', { userId: String(user._id) });
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    await db.collection('password').updateOne(
      { userId: user._id },
      {
        $set: {
          hash: hashedPassword,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    const deleteResult = await db.collection('session').deleteMany({ userId: user._id });
    console.log('password.change: success', { userId: String(user._id), sessionsDeleted: deleteResult.deletedCount });

    const response = NextResponse.json({ 
      success: true,
      message: 'Пароль изменен, выполнен выход из системы'
    });
    
    response.cookies.set('better-auth.session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });
    return response;

  } catch (error) {
    console.error('password.change: error', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при изменении пароля' },
      { status: 500 }
    );
  }
}

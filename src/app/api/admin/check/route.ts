import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('better-auth.session_token')?.value;
    
    if (!sessionToken) {
      return NextResponse.json({ isAdmin: false, error: 'Not authenticated' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("240academy");
    
    // Извлечь основную часть токена (до точки)
    const tokenPart = sessionToken.split('.')[0];
    
    // Найти сессию по основной части токена
    const session = await db.collection('session').findOne({
      token: { $regex: `^${tokenPart}` }
    });

    if (!session) {
      return NextResponse.json({ isAdmin: false, error: 'Invalid session' }, { status: 401 });
    }

    // Найти пользователя
    const user = await db.collection('user').findOne({
      _id: session.userId
    });

    if (!user) {
      return NextResponse.json({ isAdmin: false, error: 'User not found' }, { status: 401 });
    }

    const userRole = user.role || 'user';
    const isAdmin = userRole === 'admin';

    return NextResponse.json({ 
      isAdmin,
      role: userRole,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json({ isAdmin: false, error: 'Failed to check admin status' }, { status: 500 });
  }
}

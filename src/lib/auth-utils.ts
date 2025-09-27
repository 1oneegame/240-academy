import { NextRequest } from 'next/server';
import clientPromise from '@/lib/dbConnect';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  surname: string;
  role: string;
}

export async function getAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const sessionToken = request.cookies.get('better-auth.session_token')?.value;
    
    if (!sessionToken) {
      return null;
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
      return null;
    }

    // Найти пользователя
    const user = await db.collection('user').findOne({
      _id: session.userId
    });

    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      surname: user.surname,
      role: user.role || 'user'
    };
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
    return null;
  }
}

export async function requireAdmin(request: NextRequest): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser(request);
  
  if (!user) {
    throw new Error('Не авторизован');
  }
  
  if (user.role !== 'admin') {
    throw new Error('Недостаточно прав');
  }
  
  return user;
}

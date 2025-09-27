import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/dbConnect';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('better-auth.session_token')?.value;
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
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
      return NextResponse.json({ error: 'Неверная сессия' }, { status: 401 });
    }

    // Найти пользователя
    const user = await db.collection('user').findOne({
      _id: session.userId
    });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 401 });
    }

    const { testId, testTitle, score, totalQuestions, percentage, answers, mode, timeSpent } = await request.json();

    if (!testId || typeof score !== 'number' || typeof totalQuestions !== 'number') {
      return NextResponse.json({ error: 'Неверные данные' }, { status: 400 });
    }

    const testResultData = {
      userId: user._id.toString(),
      testId,
      testTitle: testTitle || 'Без названия',
      score,
      totalQuestions,
      percentage,
      answers,
      mode,
      timeSpent: timeSpent || 0,
      completedAt: new Date(),
      createdAt: new Date()
    };

    const result = await db.collection('testResults').insertOne(testResultData);

    return NextResponse.json({ 
      success: true, 
      resultId: result.insertedId 
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка сервера при сохранении результата' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('better-auth.session_token')?.value;
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
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
      return NextResponse.json({ error: 'Неверная сессия' }, { status: 401 });
    }

    // Найти пользователя
    const user = await db.collection('user').findOne({
      _id: session.userId
    });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 401 });
    }

    const results = await db.collection('testResults')
      .find({ userId: user._id.toString() })
      .sort({ completedAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json(results);

  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка сервера при получении результатов' },
      { status: 500 }
    );
  }
}
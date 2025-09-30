import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/dbConnect';
import { getAuthenticatedUser } from '@/lib/auth-utils';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("240academy");
    const user = await getAuthenticatedUser(request);
    if (!user) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });

    const { testId, testTitle, score, totalQuestions, percentage, answers, mode, timeSpent } = await request.json();

    if (!testId || typeof score !== 'number' || typeof totalQuestions !== 'number') {
      return NextResponse.json({ error: 'Неверные данные' }, { status: 400 });
    }

    const testResultData = {
      userId: user.id,
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

  } catch {
    return NextResponse.json(
      { error: 'Ошибка сервера при сохранении результата' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("240academy");
    const user = await getAuthenticatedUser(request);
    if (!user) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });

    const results = await db.collection('testResults')
      .find({ userId: user.id })
      .sort({ completedAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json(results);

  } catch {
    return NextResponse.json(
      { error: 'Ошибка сервера при получении результатов' },
      { status: 500 }
    );
  }
}
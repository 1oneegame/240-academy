import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-utils';
import clientPromise from '@/lib/dbConnect';
import Resource from '@/models/Resource';
import { ResourceCreateData } from '@/types/resource';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("240academy");
    
    const resources = await db.collection('resources').find({ isPublished: true })
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(resources);
  } catch (error) {
    console.error('Ошибка при получении ресурсов:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin(request);

    const client = await clientPromise;
    const db = client.db("240academy");
    
    const data: ResourceCreateData = await request.json();
    
    const resource = {
      ...data,
      createdBy: user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('resources').insertOne(resource);
    
    const createdResource = await db.collection('resources').findOne({ _id: result.insertedId });
    
    return NextResponse.json(createdResource, { status: 201 });
  } catch (error) {
    console.error('Ошибка при создании ресурса:', error);
    
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

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-utils';
import clientPromise from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';
import { ResourceUpdateData } from '@/types/resource';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("240academy");
    
    const resource = await db.collection('resources').findOne({ _id: new ObjectId(params.id) });
    
    if (!resource) {
      return NextResponse.json(
        { error: 'Ресурс не найден' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(resource);
  } catch (error) {
    console.error('Ошибка при получении ресурса:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request);

    const client = await clientPromise;
    const db = client.db("240academy");
    
    const data: ResourceUpdateData = await request.json();
    
    const updateData = {
      ...data,
      updatedAt: new Date()
    };
    
    const result = await db.collection('resources').findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return NextResponse.json(
        { error: 'Ресурс не найден' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Ошибка при обновлении ресурса:', error);
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request);

    const client = await clientPromise;
    const db = client.db("240academy");
    
    const result = await db.collection('resources').findOneAndDelete({ _id: new ObjectId(params.id) });
    
    if (!result) {
      return NextResponse.json(
        { error: 'Ресурс не найден' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Ресурс удален' });
  } catch (error) {
    console.error('Ошибка при удалении ресурса:', error);
    
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

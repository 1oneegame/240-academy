import { NextRequest, NextResponse } from 'next/server';
import { use } from 'react';
import clientPromise from '@/lib/dbConnect';
import { VideoCourse, VideoCourseUpdateData } from '@/types/video-course';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("240academy");
    const videoCourse = await db.collection('video-courses').findOne({ _id: new ObjectId(id) });
    
    if (!videoCourse) {
      return NextResponse.json({ error: 'Video course not found' }, { status: 404 });
    }
    
    return NextResponse.json(videoCourse);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch video course' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: VideoCourseUpdateData = await request.json();
    const client = await clientPromise;
    const db = client.db("240academy");
    
    const { _id, ...bodyWithoutId } = body as any;
    const updateData: any = {
      ...bodyWithoutId,
      updatedAt: new Date()
    };
    
    if (body.lessons) {
      updateData.lessons = body.lessons.map((lesson, index) => ({
        ...lesson,
        id: (lesson as any).id || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        }),
        order: index + 1
      }));
    }
    
    const result = await db.collection('video-courses').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Video course not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update video course' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("240academy");
    
    const result = await db.collection('video-courses').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Video course not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete video course' }, { status: 500 });
  }
}

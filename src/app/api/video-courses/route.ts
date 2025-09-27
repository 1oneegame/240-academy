import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/dbConnect';
import { VideoCourse, VideoCourseCreateData } from '@/types/video-course';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("240academy");
    const videoCourses = await db.collection('video-courses').find({}).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json(videoCourses);
  } catch (error) {
    console.error('Error fetching video courses:', error);
    return NextResponse.json({ error: 'Failed to fetch video courses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: VideoCourseCreateData = await request.json();
    const client = await clientPromise;
    const db = client.db("240academy");
    
    const videoCourseData: Omit<VideoCourse, '_id'> = {
      ...body,
      lessons: body.lessons.map((lesson, index) => ({
        ...lesson,
        id: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        }),
        order: index + 1,
        isCompleted: false
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin'
    };
    
    const result = await db.collection('video-courses').insertOne(videoCourseData);
    
    return NextResponse.json({ 
      success: true, 
      videoCourseId: result.insertedId 
    });
  } catch (error) {
    console.error('Error creating video course:', error);
    return NextResponse.json({ error: 'Failed to create video course' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/dbConnect';
import { Course, CourseCreateData } from '@/types/course';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("240academy");
    const courses = await db.collection('courses').find({}).toArray();
    
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CourseCreateData = await request.json();
    const client = await clientPromise;
    const db = client.db("240academy");
    
    const courseData: Omit<Course, '_id'> = {
      ...body,
      videos: body.videos.map((video, index) => ({
        ...video,
        id: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        }),
        order: index + 1
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin'
    };
    
    const result = await db.collection('courses').insertOne(courseData);
    
    return NextResponse.json({ 
      success: true, 
      courseId: result.insertedId 
    });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
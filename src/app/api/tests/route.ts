import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/dbConnect';
import { Test, TestCreateData } from '@/types/test';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("240academy");
    const tests = await db.collection('tests').find({}).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json(tests);
  } catch (error) {
    console.error('Error fetching tests:', error);
    return NextResponse.json({ error: 'Failed to fetch tests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: TestCreateData = await request.json();
    const client = await clientPromise;
    const db = client.db("240academy");
    
    const testData: Omit<Test, '_id'> = {
      ...body,
      questions: body.questions.map((question, index) => ({
        ...question,
        id: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        })
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin'
    };
    
    const result = await db.collection('tests').insertOne(testData);
    
    return NextResponse.json({ 
      success: true, 
      testId: result.insertedId 
    });
  } catch (error) {
    console.error('Error creating test:', error);
    return NextResponse.json({ error: 'Failed to create test' }, { status: 500 });
  }
}
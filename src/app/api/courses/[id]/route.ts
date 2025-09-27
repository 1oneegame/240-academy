import { NextRequest, NextResponse } from 'next/server';
import { use } from 'react';
import clientPromise from '@/lib/dbConnect';
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
    const course = await db.collection('courses').findOne({ _id: new ObjectId(id) });
    
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    
    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("240academy");
    
    const { _id, ...bodyWithoutId } = body;
    const updateData = {
      ...bodyWithoutId,
      updatedAt: new Date()
    };
    
    const result = await db.collection('courses').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
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
    
    const result = await db.collection('courses').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
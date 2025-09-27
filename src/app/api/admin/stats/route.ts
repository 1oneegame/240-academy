import { NextResponse } from 'next/server';
import clientPromise from '@/lib/dbConnect';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("240academy");
    
    const [usersCount, coursesCount, testsCount, courseCompletions] = await Promise.all([
      db.collection('user').countDocuments(),
      db.collection('courses').countDocuments(),
      db.collection('tests').countDocuments(),
      db.collection('courseCompletions').countDocuments()
    ]);
    
    const publishedCourses = await db.collection('courses').countDocuments({ isPublished: true });
    const publishedTests = await db.collection('tests').countDocuments({ isPublished: true });
    
    const recentUsers = await db.collection('user')
      .find({}, { projection: { name: 1, email: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    
    const courseStats = await db.collection('courses').aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          published: { $sum: { $cond: ['$isPublished', 1, 0] } }
        }
      }
    ]).toArray();
    
    const testStats = await db.collection('tests').aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          published: { $sum: { $cond: ['$isPublished', 1, 0] } }
        }
      }
    ]).toArray();
    
    return NextResponse.json({
      users: {
        total: usersCount,
        recent: recentUsers
      },
      courses: {
        total: coursesCount,
        published: publishedCourses,
        byCategory: courseStats
      },
      tests: {
        total: testsCount,
        published: publishedTests,
        byCategory: testStats
      },
      completions: courseCompletions
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
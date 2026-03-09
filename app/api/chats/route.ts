import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where = email ? { email } : {};

    const [chats, total] = await Promise.all([
      prisma.chat.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          prompt: true,
          createdAt: true,
          // We don't fetch the full response here for the list view to keep it light
          // but for the admin view we might want to see who requested what.
        }
      }),
      prisma.chat.count({ where })
    ]);

    return NextResponse.json({
      chats,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error: unknown) {
    console.error('Fetch chats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chats' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'DATABASE_ERROR'
  | 'UNKNOWN_ERROR';

function buildError(code: ErrorCode, message: string, status: number) {
  const meta: Record<ErrorCode, { title: string; suggestion: string }> = {
    VALIDATION_ERROR: {
      title: 'Invalid Request',
      suggestion: 'Please make sure an email is provided.',
    },
    DATABASE_ERROR: {
      title: 'Database Connection Failed',
      suggestion:
        'Could not reach the database. Please check your internet connection, or try again in a moment.',
    },
    UNKNOWN_ERROR: {
      title: 'Something Went Wrong',
      suggestion: 'An unexpected error occurred. Please refresh and try again.',
    },
  };

  const { title, suggestion } = meta[code];
  return NextResponse.json(
    { error: { code, title, message, suggestion } },
    { status },
  );
}

function isDbConnectionError(msg: string): boolean {
  return /ECONNREFUSED|ETIMEOUT|querySrv|ENOTFOUND|MongoServerSelectionError/i.test(msg);
}

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');

    if (!email) {
      return buildError('VALIDATION_ERROR', 'Email query parameter is required.', 400);
    }

    const chats = await prisma.chat.findMany({
      where: { email },
      select: {
        id: true,
        prompt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ chats });
  } catch (error: unknown) {
    console.error('Chats API error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';

    if (isDbConnectionError(message)) {
      return buildError('DATABASE_ERROR', message, 503);
    }

    return buildError('UNKNOWN_ERROR', message, 500);
  }
}

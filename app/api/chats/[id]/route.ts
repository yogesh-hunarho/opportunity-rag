import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type ErrorCode =
  | 'NOT_FOUND'
  | 'DATABASE_ERROR'
  | 'UNKNOWN_ERROR';

function buildError(code: ErrorCode, message: string, status: number) {
  const meta: Record<ErrorCode, { title: string; suggestion: string }> = {
    NOT_FOUND: {
      title: 'Chat Not Found',
      suggestion: 'This analysis may have been deleted. Try generating a new one.',
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const chat = await prisma.chat.findUnique({
      where: { id },
    });

    if (!chat) {
      return buildError('NOT_FOUND', 'No analysis found with this ID.', 404);
    }

    return NextResponse.json({ chat });
  } catch (error: unknown) {
    console.error('Chat detail API error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';

    if (isDbConnectionError(message)) {
      return buildError('DATABASE_ERROR', message, 503);
    }

    return buildError('UNKNOWN_ERROR', message, 500);
  }
}

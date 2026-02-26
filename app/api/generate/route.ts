import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { prisma } from '@/lib/prisma';
// import sampleData from '@/lib/avgc-data.json';
import sampleDataForAI from "@/lib/data-for-gemini.json"



// ── Structured Error Types ──────────────────────────────────────────
type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'AI_GENERATION_ERROR'
  | 'JSON_PARSE_ERROR'
  | 'DATABASE_ERROR'
  | 'RATE_LIMIT_ERROR'
  | 'UNKNOWN_ERROR';

interface ApiError {
  code: ErrorCode;
  title: string;
  message: string;
  suggestion: string;
}

function buildError(
  code: ErrorCode,
  message: string,
  status: number,
): NextResponse {
  const meta: Record<ErrorCode, { title: string; suggestion: string }> = {
    VALIDATION_ERROR: {
      title: 'Invalid Request',
      suggestion: 'Please make sure both email and a prompt are provided.',
    },
    AI_GENERATION_ERROR: {
      title: 'AI Generation Failed',
      suggestion:
        'Gemini could not generate a response. Try rephrasing your prompt or try again later.',
    },
    JSON_PARSE_ERROR: {
      title: 'Response Format Error',
      suggestion:
        'The AI returned an unexpected format. Please try again — a simpler or shorter prompt often helps.',
    },
    DATABASE_ERROR: {
      title: 'Could Not Save Analysis',
      suggestion:
        'Your analysis was generated but could not be saved. Please try again in a moment.',
    },
    RATE_LIMIT_ERROR: {
      title: 'Too Many Requests',
      suggestion:"You've hit the rate limit. Please wait a minute before generating another analysis.",
    },
    UNKNOWN_ERROR: {
      title: 'Something Went Wrong',
      suggestion:
        'An unexpected error occurred. Please refresh the page and try again.',
    },
  };

  const { title, suggestion } = meta[code];

  const body: ApiError = { code, title, message, suggestion };
  return NextResponse.json({ error: body }, { status });
}

// ── System Prompt ───────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert business opportunity analyzer. The user will give you a topic/industry/policy and you must generate a comprehensive business opportunity analysis in a SPECIFIC JSON format.

You MUST return ONLY valid JSON (no markdown, no code fences, no extra text). The JSON must follow this EXACT structure:

${JSON.stringify(sampleDataForAI, null, 2)}

RULES:
1. Replace ALL content with analysis relevant to the user's prompt/topic.
2. Keep the EXACT same JSON structure and keys.
3. The "navigation" array must have exactly 5 items with ids: "opportunities", "firstmover", "roadmap", "gaps", "checklist".
4. "opportunities.items" should have 5-7 cards. Each card must have: color (green/blue/purple/orange), icon (emoji), pill, pillType (hot/high/med), title, desc, meta (array of {label, val}), details (array of strings).
5. "firstmover.scorecards" should have 3 items. Each score value is 0-100, color is "green" or "orange".
6. "firstmover.topPicks" should have exactly 3 items with rank emoji (🥇🥈🥉).
7. "roadmap.phases" should have 4-5 items with color (green/blue/purple/orange).
8. "gaps.table.rows" should have 6-8 rows. statusType is "red" or "yellow".
9. "checklist.categories" should have 3-4 categories, each with 4-5 items.
10. All monetary values should use appropriate currency symbols.
11. Make the analysis realistic, data-driven, and actionable.
12. Return ONLY the JSON object, nothing else.`;

export async function POST(req: NextRequest) {
  try {
    const { email, prompt, apiKey } = await req.json();

    if (!email || !prompt) {
      return buildError(
        'VALIDATION_ERROR',
        'Email and prompt are required.',
        400,
      );
    }

    let currentAi;
    if (email.toLowerCase() === 'yogesh.singh@hunarho.com') {
      currentAi = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    } else {
      if (!apiKey) {
        return buildError(
          'VALIDATION_ERROR',
          'Gemini API Key is required for this email address.',
          400,
        );
      }
      currentAi = new GoogleGenAI({ apiKey });
    }

    // ── Call Gemini ────────────────────────────────────────────────
    let response;
    try {
      response = await currentAi.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.7,
          responseMimeType: 'application/json',
          maxOutputTokens:10000
        },
      });
    } catch (aiErr: unknown) {
      console.error('Gemini API error:', aiErr);
      const msg =
        aiErr instanceof Error ? aiErr.message : 'Gemini API call failed';

      // Detect rate-limit from Google API errors
      if (msg.toLowerCase().includes('resource exhausted') || msg.includes('429')) {
        return buildError('RATE_LIMIT_ERROR', msg, 429);
      }
      return buildError('AI_GENERATION_ERROR', msg, 502);
    }

    // ── Parse JSON response ───────────────────────────────────────
    const text = response.text ?? '';

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(text);
    } catch {
      // Try to extract JSON from possible markdown fences
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        try {
          parsedResponse = JSON.parse(jsonMatch[1].trim());
        } catch {
          return buildError(
            'JSON_PARSE_ERROR',
            'Could not parse the extracted JSON from AI response.',
            502,
          );
        }
      } else {
        return buildError(
          'JSON_PARSE_ERROR',
          'The AI response was not valid JSON.',
          502,
        );
      }
    }

    // ── Save to MongoDB via Prisma ────────────────────────────────
    let chat;
    try {
      chat = await prisma.chat.create({
        data: {
          email,
          prompt,
          response: parsedResponse,
        },
      });
    } catch (dbErr: unknown) {
      console.error('Database error:', dbErr);
      // Still return the generated data even if save fails
      return NextResponse.json({
        id: null,
        data: parsedResponse,
        warning: {
          code: 'DATABASE_ERROR' as ErrorCode,
          message: 'Analysis generated but could not be saved to history.',
        },
      });
    }

    return NextResponse.json({
      id: chat.id,
      data: parsedResponse,
    });
  } catch (error: unknown) {
    console.error('Generate API error:', error);
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    return buildError('UNKNOWN_ERROR', message, 500);
  }
}

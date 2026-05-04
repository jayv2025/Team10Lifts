import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

type Workout = {
  day: string;
  focus: string;
  exercises: string[];
  difficulty: Difficulty;
  estimatedTime: string;
};

type Program = {
  title: string;
  summary: string;
  workouts: Workout[];
};

type RequestBody = {
  prompt?: string;
};

function getEnv(name: string): string {
  const value = Deno.env.get(name);

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getGroqApiKey(): string {
  const groqKey = Deno.env.get('GROQ_API_KEY');
  const legacyKey = Deno.env.get('GEMINI_API_KEY');

  if (groqKey) {
    return groqKey;
  }

  if (legacyKey) {
    return legacyKey;
  }

  throw new Error(
    'Missing required environment variable: GROQ_API_KEY or GEMINI_API_KEY'
  );
}

function buildPrompt(userPrompt: string): string {
  return `
You are a workout programming assistant for a fitness app.

Create a practical workout split based on the user's request.
Return only valid JSON with this shape:
{
  "title": "string",
  "summary": "string",
  "workouts": [
    {
      "day": "string",
      "focus": "string",
      "difficulty": "Beginner" | "Intermediate" | "Advanced",
      "estimatedTime": "string",
      "exercises": ["Exercise - sets x reps", "Exercise - sets x reps"]
    }
  ]
}

Rules:
- Generate between 2 and 7 workouts.
- Every workout must include 4 to 7 exercises unless the day is recovery or conditioning focused.
- Use concise, app-friendly names.
- Keep estimatedTime human-readable like "45 min".
- Do not include markdown fences.
- Do not include explanations outside the JSON.

User request: ${userPrompt}
`.trim();
}

function normalizeProgram(rawProgram: Program): Program {
  const title =
    typeof rawProgram.title === 'string' && rawProgram.title.trim().length > 0
      ? rawProgram.title.trim()
      : 'Generated Workout Program';

  const summary =
    typeof rawProgram.summary === 'string' &&
    rawProgram.summary.trim().length > 0
      ? rawProgram.summary.trim()
      : 'A structured workout split generated from your request.';

  const workouts = Array.isArray(rawProgram.workouts)
    ? rawProgram.workouts
        .map((workout) => {
          const difficulty: Difficulty =
            workout.difficulty === 'Intermediate' ||
            workout.difficulty === 'Advanced'
              ? workout.difficulty
              : 'Beginner';

          const exercises = Array.isArray(workout.exercises)
            ? workout.exercises
                .map((exercise) =>
                  typeof exercise === 'string' ? exercise.trim() : ''
                )
                .filter((exercise) => exercise.length > 0)
            : [];

          return {
            day:
              typeof workout.day === 'string' && workout.day.trim().length > 0
                ? workout.day.trim()
                : 'Workout Day',
            focus:
              typeof workout.focus === 'string' &&
              workout.focus.trim().length > 0
                ? workout.focus.trim()
                : 'Full Body',
            difficulty,
            estimatedTime:
              typeof workout.estimatedTime === 'string' &&
              workout.estimatedTime.trim().length > 0
                ? workout.estimatedTime.trim()
                : '45 min',
            exercises,
          };
        })
        .filter((workout) => workout.exercises.length > 0)
    : [];

  if (workouts.length === 0) {
    throw new Error('The model returned a program without any valid workouts.');
  }

  return {
    title,
    summary,
    workouts,
  };
}

function parseProgramText(text: string): Program {
  const trimmed = text.trim();
  const withoutCodeFence = trimmed.replace(/^```json\s*|\s*```$/g, '');
  const parsed = JSON.parse(withoutCodeFence) as Program;
  return normalizeProgram(parsed);
}

const responseSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    summary: { type: 'string' },
    workouts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          day: { type: 'string' },
          focus: { type: 'string' },
          difficulty: {
            type: 'string',
            enum: ['Beginner', 'Intermediate', 'Advanced'],
          },
          estimatedTime: { type: 'string' },
          exercises: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        required: ['day', 'focus', 'difficulty', 'estimatedTime', 'exercises'],
        additionalProperties: false,
      },
    },
  },
  required: ['title', 'summary', 'workouts'],
  additionalProperties: false,
} as const;

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const groqApiKey = getGroqApiKey();
    const body = (await request.json()) as RequestBody;
    const prompt = body.prompt?.trim();

    if (!prompt) {
      return Response.json(
        { error: 'prompt is required.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const groqResponse = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',
          messages: [
            {
              role: 'system',
              content:
                'You are a workout programming assistant. Return only valid JSON that matches the required schema.',
            },
            {
              role: 'user',
              content: buildPrompt(prompt),
            },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'workout_program',
              strict: true,
              schema: responseSchema,
            },
          },
          temperature: 0.7,
          max_tokens: 2000,
        }),
      }
    );

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      throw new Error(`Groq request failed: ${errorText}`);
    }

    const groqData = await groqResponse.json();
    const responseText = groqData?.choices?.[0]?.message?.content ?? '';

    if (!responseText) {
      throw new Error('Groq returned an empty response.');
    }

    const program = parseProgramText(responseText);

    return Response.json({ program }, { headers: corsHeaders });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unexpected server error.',
      },
      { status: 500, headers: corsHeaders }
    );
  }
});

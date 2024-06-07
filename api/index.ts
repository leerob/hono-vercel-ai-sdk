import { Hono } from 'hono';
import { streamText as honoStream } from 'hono/streaming';
import { handle } from 'hono/vercel';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

const app = new Hono().basePath('/api');

app.get('/', async (c) => {
  return honoStream(c, async (stream) => {
    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      prompt: 'Invent a new holiday and describe its traditions.',
    });

    for await (const textPart of result.textStream) {
      await stream.write(textPart);
    }
  });
});

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const OPTIONS = handler;

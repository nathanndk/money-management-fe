import { NextResponse } from 'next/server';
import { z } from 'zod';
import { volatileUsers } from '@/data/runtime';

const schema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(4) });

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  const { name, email, password } = parsed.data;
  if (volatileUsers.some((u) => u.email === email)) return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
  volatileUsers.push({ id: `u_${Date.now()}`, name, email, password });
  return NextResponse.json({ ok: true });
}
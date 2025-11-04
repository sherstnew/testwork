import { NextRequest, NextResponse } from 'next/server';
import client from 'prom-client';
import { clientSessions } from '@/lib/prometheus';
import { dbConnect } from '../../../lib/mongoose';
import { SessionModel } from '../../../lib/models';

const METRICS_TOKEN = process.env.METRICS_TOKEN;

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (token !== METRICS_TOKEN) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  const now = Date.now();
  await dbConnect();

  const sessions = await SessionModel.find({ expiredAt: { $gte: now } });
  clientSessions.observe(sessions.length);
  
  return NextResponse.json(await client.register.metrics());
}

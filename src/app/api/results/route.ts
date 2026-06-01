import { NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/mongoose';
import { ResultModel } from '../../../lib/models';
import { httpRequestsTotal, httpRequestDurationSeconds } from '@/lib/prometheus';

export async function GET() {
  httpRequestsTotal.inc();
  const end = httpRequestDurationSeconds.startTimer({ method: 'GET', route: '/api/results' });
  await dbConnect();
  const results = await ResultModel.find().sort({ createdAt: -1 }).exec();
  end({ status_code: '200' });
  return NextResponse.json(results);
}

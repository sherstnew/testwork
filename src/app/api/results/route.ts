import { NextResponse } from 'next/server';
import { dbConnect } from '../_lib/mongoose';
import { ResultModel } from '../_lib/models';
import { httpRequestsTotal, httpRequestDurationSeconds } from '@/app/api/_lib/prometheus';

export async function GET() {
  httpRequestsTotal.inc();
  const end = httpRequestDurationSeconds.startTimer({ method: 'GET', route: '/api/results' });
  await dbConnect();
  const results = await ResultModel.find().sort({ createdAt: -1 }).exec();
  end({ status_code: '200' });
  return NextResponse.json(results);
}

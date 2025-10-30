import { NextResponse } from 'next/server';
import { dbConnect } from '../_lib/mongoose';
import { ResultModel } from '../_lib/models';

export async function GET() {
  await dbConnect();
  const results = await ResultModel.find().sort({ createdAt: -1 }).exec();
  return NextResponse.json(results);
}

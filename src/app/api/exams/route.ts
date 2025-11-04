import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/mongoose';
import { ExamModel, QuestionModel, ResultModel } from '../../../lib/models';
import { httpRequestsTotal, httpRequestDurationSeconds } from '@/lib/prometheus';

export async function GET() {
  httpRequestsTotal.inc();
  const end = httpRequestDurationSeconds.startTimer({ method: 'GET', route: '/api/exams' });
  await dbConnect();
  const exams = await ExamModel.find()
  .populate({ path: 'questions', model: QuestionModel })
  .populate({
    path: 'results',
    model: ResultModel,
    options: { sort: { createdAt: -1 } },
  });
  end({ status_code: '200' });
  return NextResponse.json(exams);
}

export async function POST(req: NextRequest) {
  httpRequestsTotal.inc();
  const end = httpRequestDurationSeconds.startTimer({ method: 'POST', route: '/api/exams' });
  await dbConnect();
  const data = await req.json();
  const newExam = new ExamModel(data);
  const createdExam = await newExam.save();
  end({ status_code: '201' });
  return NextResponse.json(createdExam, { status: 201 });
}

import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../_lib/mongoose';
import {
  ResultModel,
  SessionModel,
  ExamModel
} from '../../_lib/models';
import { Types } from 'mongoose';
import { httpRequestsTotal, httpRequestDurationSeconds } from '@/app/api/_lib/prometheus';

export async function POST(req: NextRequest, { params }: { params: { examId: string } }) {
  httpRequestsTotal.inc();
  const end = httpRequestDurationSeconds.startTimer({ method: 'POST', route: '/api/results/[examId]' });
  await dbConnect();
  const examId = params.examId;
  if (!Types.ObjectId.isValid(examId)) {
    end({ status_code: '400' });
    return NextResponse.json({ error: 'Invalid examId' }, { status: 400 });
  }
  const data = await req.json();
  // data: {id (sessionId), name, result, time}
  const session = await SessionModel.findById(data.id).exec();
  if (!session) {
    end({ status_code: '404' });
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const createdResult = await new ResultModel({
    name: session.name,
    result: data.result,
    time: data.time,
  }).save();

  await SessionModel.findByIdAndDelete(data.id).exec();
  
  const exam = await ExamModel.findById(examId);
  if (!exam) {
    end({ status_code: '404' });
    return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
  } 
  exam.results.push(createdResult._id);
  await exam.save();
  
  end({ status_code: '201' });
  return NextResponse.json(createdResult, { status: 201 });
}

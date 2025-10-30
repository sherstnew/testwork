import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../_lib/mongoose';
import {
  ResultModel,
  SessionModel,
  ExamModel
} from '../../_lib/models';
import { Types } from 'mongoose';

export async function POST(req: NextRequest, { params }: { params: { examId: string } }) {
  await dbConnect();
  const examId = params.examId;
  if (!Types.ObjectId.isValid(examId)) {
    return NextResponse.json({ error: 'Invalid examId' }, { status: 400 });
  }
  const data = await req.json();
  // data: {id (sessionId), name, result, time}
  const session = await SessionModel.findById(data.id).exec();
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  const createdResult = await new ResultModel({
    name: session.name,
    result: data.result,
    time: data.time,
  }).save();

  await SessionModel.findByIdAndDelete(data.id).exec();

  const exam = await ExamModel.findById(examId);
  if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
  exam.results.push(createdResult._id);
  await exam.save();

  return NextResponse.json(createdResult, { status: 201 });
}

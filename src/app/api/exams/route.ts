import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../_lib/mongoose';
import { ExamModel, QuestionModel, ResultModel } from '../_lib/models';

export async function GET() {
  await dbConnect();
  const exams = await ExamModel.find()
    .populate({ path: 'questions', model: QuestionModel })
    .populate({
      path: 'results',
      model: ResultModel,
      options: { sort: { createdAt: -1 } },
    });
  return NextResponse.json(exams);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  const newExam = new ExamModel(data);
  const createdExam = await newExam.save();
  return NextResponse.json(createdExam, { status: 201 });
}

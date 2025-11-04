import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../_lib/mongoose';
import { ExamModel, QuestionModel, ResultModel } from '../../_lib/models';
import { Types } from 'mongoose';
import { httpRequestsTotal, httpRequestDurationSeconds } from '@/app/api/_lib/prometheus';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  httpRequestsTotal.inc();
  const end = httpRequestDurationSeconds.startTimer({ method: 'GET', route: '/api/exams/[id]' });
  await dbConnect();
  const id = params.id;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  const exam = await ExamModel.findById(id)
  .populate({ path: 'questions', model: QuestionModel })
  .populate({
    path: 'results',
    model: ResultModel,
    options: { sort: { createdAt: -1 } },
  });
  if (!exam) {
    end({ status_code: '404' });
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  end({ status_code: '200' });
  return NextResponse.json(exam);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  httpRequestsTotal.inc();
  const end = httpRequestDurationSeconds.startTimer({ method: 'PATCH', route: '/api/exams/[id]' });
  await dbConnect();
  const id = params.id;
  if (!Types.ObjectId.isValid(id)) {
    end({ status_code: '400' });
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  const data = await req.json();
  const updated = await ExamModel.findByIdAndUpdate(id, data, { new: true });
  end({ status_code: '200' });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  httpRequestsTotal.inc();
  const end = httpRequestDurationSeconds.startTimer({ method: 'DELETE', route: '/api/exams/[id]' });
  await dbConnect();
  const id = params.id;
  if (!Types.ObjectId.isValid(id)) {
    end({ status_code: '400' });
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  await ExamModel.findByIdAndDelete(id);
  end({ status_code: '200' });
  return NextResponse.json({ success: true });
}

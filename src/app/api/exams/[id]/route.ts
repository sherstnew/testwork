import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../_lib/mongoose';
import { ExamModel, QuestionModel, ResultModel } from '../../_lib/models';
import { Types } from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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
  if (!exam) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(exam);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const id = params.id;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  const data = await req.json();
  const updated = await ExamModel.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const id = params.id;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  await ExamModel.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

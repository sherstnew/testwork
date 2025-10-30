import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../_lib/mongoose';
import { SessionModel, ExamModel, QuestionModel } from '../_lib/models';
import { Types } from 'mongoose';

// POST /api/sessions?question - создать вопрос
// POST /api/sessions/[examId] - создать сессию для экзамена
export async function POST(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  if (searchParams.has('question')) {
    // createQuestion
    const question = await req.json();
    const created = await new QuestionModel(question).save();
    return NextResponse.json(created, { status: 201 });
  } else if (searchParams.has('examId')) {
    // createSession
    const examId = searchParams.get('examId');
    if (!Types.ObjectId.isValid(examId!)) {
      return NextResponse.json({ error: 'Invalid examId' }, { status: 400 });
    }
    const createSessionDto = await req.json();
    const exam = await ExamModel.findById(examId);
    if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 3);
    createSessionDto.expiredAt = expiredAt;
    // Найти случайные вопросы
    const allQuestions = await QuestionModel.find();
    const shuffled = allQuestions.sort(() => Math.random() - 0.5).slice(0, exam.questionsLimit);
    createSessionDto.questions = shuffled;
    const createdSession = await new SessionModel(createSessionDto).save();
    return NextResponse.json(createdSession, { status: 201 });
  } else {
    return NextResponse.json({ error: 'Specify question or examId' }, { status: 400 });
  }
}

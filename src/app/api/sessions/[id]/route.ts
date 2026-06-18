import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/mongoose';
import { SessionModel } from '../../../../lib/models';
import { Types } from 'mongoose';
import { httpRequestsTotal, httpRequestDurationSeconds } from '@/lib/prometheus';

type SessionObject = {
  questions?: unknown[];
  result?: number;
  initialLength?: number;
  incorrects?: unknown[];
  selectedAnswer?: string;
  endsAt?: Date;
};

type SerializableSession = {
  toObject: () => SessionObject;
};

const getSessionTime = (endsAt?: Date) => {
  if (!endsAt) {
    return 600;
  }

  return Math.max(0, Math.ceil((endsAt.getTime() - Date.now()) / 1000));
};

const serializeSession = (session: SerializableSession) => {
  const sessionObject = session.toObject();

  return {
    ...sessionObject,
    result: sessionObject.result ?? 0,
    initialLength: sessionObject.initialLength ?? sessionObject.questions?.length ?? 0,
    incorrects: sessionObject.incorrects ?? [],
    selectedAnswer: sessionObject.selectedAnswer ?? '',
    time: getSessionTime(sessionObject.endsAt),
  };
};

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  httpRequestsTotal.inc();
  const end = httpRequestDurationSeconds.startTimer({ method: 'GET', route: '/api/sessions/[id]' });
  await dbConnect();
  const id = params.id;
  if (!Types.ObjectId.isValid(id)) {
    end({ status_code: '400' });
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  const session = await SessionModel.findById(id).exec();
  const currentDate = new Date();
  if (session) {
    if (session.expiredAt.getTime() > currentDate.getTime()) {
      end({ status_code: '200' });
      return NextResponse.json(serializeSession(session));
    } else {
      await SessionModel.findByIdAndDelete(id).exec();
      end({ status_code: '410' });
      return NextResponse.json({ error: 'Session Expired' }, { status: 410 });
    }
  } else {
    end({ status_code: '404' });
    return NextResponse.json({ error: 'Session Error' }, { status: 404 });
  }
}

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  httpRequestsTotal.inc();
  const end = httpRequestDurationSeconds.startTimer({ method: 'PATCH', route: '/api/sessions/[id]' });
  await dbConnect();
  const id = params.id;
  if (!Types.ObjectId.isValid(id)) {
    end({ status_code: '400' });
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const session = await SessionModel.findById(id).exec();
  const currentDate = new Date();
  if (!session) {
    end({ status_code: '404' });
    return NextResponse.json({ error: 'Session Error' }, { status: 404 });
  }

  if (session.expiredAt.getTime() <= currentDate.getTime()) {
    await SessionModel.findByIdAndDelete(id).exec();
    end({ status_code: '410' });
    return NextResponse.json({ error: 'Session Expired' }, { status: 410 });
  }

  const data = await req.json();
  if (Array.isArray(data.questions)) {
    session.questions = data.questions;
  }
  if (typeof data.result === 'number') {
    session.result = data.result;
  }
  if (Array.isArray(data.incorrects)) {
    session.incorrects = data.incorrects;
  }
  if (typeof data.selectedAnswer === 'string') {
    session.selectedAnswer = data.selectedAnswer;
  }

  await session.save();
  end({ status_code: '200' });
  return NextResponse.json(serializeSession(session));
}

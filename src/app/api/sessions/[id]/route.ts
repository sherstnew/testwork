import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/mongoose';
import { SessionModel } from '../../../../lib/models';
import { Types } from 'mongoose';
import { httpRequestsTotal, httpRequestDurationSeconds } from '@/lib/prometheus';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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
      return NextResponse.json(session);
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

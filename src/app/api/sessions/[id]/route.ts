import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../_lib/mongoose';
import { SessionModel } from '../../_lib/models';
import { Types } from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const id = params.id;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  const session = await SessionModel.findById(id).exec();
  const currentDate = new Date();
  if (session) {
    if (session.expiredAt.getTime() > currentDate.getTime()) {
      return NextResponse.json(session);
    } else {
      await SessionModel.findByIdAndDelete(id).exec();
      return NextResponse.json({ error: 'Session Expired' }, { status: 410 });
    }
  } else {
    return NextResponse.json({ error: 'Session Error' }, { status: 404 });
  }
}

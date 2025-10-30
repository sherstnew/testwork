import { dbConnect } from '../src/app/api/_lib/mongoose';
import { SessionModel } from '../src/app/api/_lib/models';

async function cleanupSessions() {
  await dbConnect();
  const now = new Date();
  const expired = await SessionModel.deleteMany({ expiredAt: { $lte: now } });
  console.log(`Удалено просроченных сессий: ${expired.deletedCount}`);
  process.exit(0);
}

cleanupSessions().catch((e) => {
  console.error('Ошибка очистки сессий', e);
  process.exit(1);
});

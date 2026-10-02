import { dbConnect } from '../src/lib/mongoose';
import { SessionModel } from '../src/lib/models';

async function cleanupSessions() {
  await dbConnect();
  const result = await SessionModel.deleteMany({});
  console.log(`Удалено сессий: ${result.deletedCount}`);
  process.exit(0);
}

cleanupSessions().catch((e) => {
  console.error('Ошибка очистки сессий', e);
  process.exit(1);
});

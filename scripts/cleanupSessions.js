import mongoose from 'mongoose';

async function cleanupSessions() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/testwork';
  await mongoose.connect(uri, { bufferCommands: false });
  try {
    const result = await mongoose.connection.collection('sessions').deleteMany({});
    console.log(`Удалено сессий: ${result.deletedCount}`);
  } finally {
    await mongoose.disconnect();
  }
}

cleanupSessions().catch((e) => {
  console.error('Ошибка очистки сессий', e);
  process.exitCode = 1;
});

export const finishTest = async (sessionId: string, result: number, name: string, time: number) => {
  return await (await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/results`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: sessionId,
      name: name,
      result: result,
      time: time,
    }),
  })).json();
};

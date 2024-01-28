export const finishTest = async (sessionId: string, result: number) => {
  return await (await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sessions/${sessionId}/result`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      result: result,
    }),
  })).json();
};

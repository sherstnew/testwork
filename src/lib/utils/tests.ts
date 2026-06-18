export const startTest = async (name: string, examId: string | string[]) => {
  const session = await (
    await fetch(`/api/sessions?examId=${examId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name || 'Аноним',
      }),
    })
  ).json();

  return session;
};

export const loadTest = async (sessionId: string) => {
  const session = await (await fetch(`/api/sessions/${sessionId}`)).json();

  if (session.error) {
    throw new Error(session.error);
  } else {
    return session;
  }
};

export type TestProgress = {
  questions?: unknown[];
  result?: number;
  incorrects?: unknown[];
  selectedAnswer?: string;
};

export const updateTest = async (sessionId: string, progress: TestProgress) => {
  const session = await (
    await fetch(`/api/sessions/${sessionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(progress),
    })
  ).json();

  if (session.error) {
    throw new Error(session.error);
  } else {
    return session;
  }
};

export const finishTest = async (
  sessionId: string,
  result: number,
  name: string,
  time: number,
  examId: string | string[]
) => {
  return await (
    await fetch(`/api/results/${examId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: sessionId,
        name,
        result,
        time,
      }),
    })
  ).json();
};

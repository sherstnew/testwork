export const loadTest = async (sessionId: string) => {
  const session = await (await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sessions/${sessionId}`)).json();

  if (session === 'Session Error') {
    throw new Error('Session Error');
  } else {
    return session;
  };
};

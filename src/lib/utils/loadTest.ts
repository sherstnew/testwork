export const loadTest = async (sessionId: string) => {
  const session = await (await fetch(`/api/sessions/${sessionId}`)).json();

  if (session === 'Session Error') {
    throw new Error('Session Error');
  } else {
    return session;
  };
};

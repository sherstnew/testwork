export const startTest = async (name: string, examId: string | string[]) => {
  let session = await (await fetch(`/api/sessions?examId=${examId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name || 'Аноним'
    })
  })).json();

  return session;
};
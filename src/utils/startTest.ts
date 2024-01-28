export const startTest = async (name: string) => {
  let session = await (await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sessions`, {
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
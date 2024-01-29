export const getResults = async () => {
  const results = await (await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/results/`)).json();
  return results;
};

export const getAllExams = async () => {
  const exams = await (await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/exams/`)).json();
  return exams.statusCode == 404 || exams.statusCode == 400 ? undefined : exams;
};

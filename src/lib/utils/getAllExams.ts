export const getAllExams = async () => {
  const exams = await (await fetch(`/api/exams/`)).json();
  return exams.statusCode == 404 || exams.statusCode == 400 ? undefined : exams;
};

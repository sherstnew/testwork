export const getExam = async (examId: string | string[]) => {
  const exam = await (await fetch(`/api/exams/${examId}`)).json();
  return exam.statusCode == 404 || exam.statusCode == 400 ? undefined : exam;
};

export const getAllExams = async () => {
  const exams = await (await fetch(`/api/exams/`)).json();
  return exams.statusCode == 404 || exams.statusCode == 400 ? undefined : exams;
};

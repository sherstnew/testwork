export const getExam = async (examId: string|string[]) => {
  const exam = await (await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/exams/${examId}`)).json();
  return exam.statusCode == 404 || exam.statusCode == 400 ? undefined : exam;
};

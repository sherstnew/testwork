import { getExam } from './getExam';

export const getResults = async (examId: string|string[]) => {
  const results = await getExam(examId);
  return results ? results.results : undefined;
};
